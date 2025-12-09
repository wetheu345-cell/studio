
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth, useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/page-header';
import Link from 'next/link';
import { doc, setDoc } from 'firebase/firestore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type UserRole = 'Rider' | 'Instructor' | 'Manager';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Rider');
  const [registrationCode, setRegistrationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!auth || !firestore) return;

    if ((role === 'Instructor' || role === 'Manager') && registrationCode !== process.env.NEXT_PUBLIC_PRIVATE_SIGNUP_CODE) {
        setError('Invalid registration code.');
        return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user role in Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        role: role,
        createdAt: new Date(),
      });
      
      if (role === 'Instructor' || role === 'Manager') {
        router.push('/admin');
      } else {
        router.push('/account');
      }

    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth || !firestore) return;
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // For Google Sign-in, we'll default to 'Rider' but ideally you'd have a role selection step
      await setDoc(doc(firestore, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: 'Rider', // Default role
        createdAt: new Date(),
      }, { merge: true });

      router.push('/account');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container flex flex-col items-center py-12">
      <PageHeader title="Sign Up" description="Create an account to start booking lessons." />
      <Card className="w-full max-w-sm mt-8">
        <form onSubmit={handleSignup}>
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>Enter your information to create an account.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button variant="outline" type="button" onClick={handleGoogleSignIn}>
              Sign up with Google
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">I am a...</Label>
              <Select onValueChange={(value: UserRole) => setRole(value)} defaultValue={role}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rider">Rider</SelectItem>
                  <SelectItem value="Instructor">Instructor</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(role === 'Instructor' || role === 'Manager') && (
                <div className="grid gap-2">
                    <Label htmlFor="registrationCode">Registration Code</Label>
                    <Input id="registrationCode" type="text" placeholder="Enter admin-provided code" required value={registrationCode} onChange={(e) => setRegistrationCode(e.target.value)} />
                </div>
            )}
            {error && <p className="text-destructive text-sm">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit">Create account</Button>
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="underline">
                Log in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
