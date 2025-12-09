'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile, getAdditionalUserInfo } from 'firebase/auth';
import { useAuth, useFirestore, useUser, errorEmitter, FirestorePermissionError } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/page-header';
import Link from 'next/link';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { validateSignupCode } from '@/ai/flows/validate-signup-code';
import type { UserRole } from '@/lib/types';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<UserRole>('Rider');
  const [registrationCode, setRegistrationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && user) {
        router.push('/account');
    }
  }, [user, isUserLoading, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSigningUp(true);
    if (!auth || !firestore) {
      setError('Firebase is not initialized.');
      setIsSigningUp(false);
      return;
    }

    if (role === 'Instructor' || role === 'Manager') {
        const { isValid } = await validateSignupCode(registrationCode);
        if (!isValid) {
            setError('Invalid registration code.');
            setIsSigningUp(false);
            return;
        }
    }
    
    if (role === 'Admin') {
        setError('Cannot sign up as Admin.');
        setIsSigningUp(false);
        return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      
      await updateProfile(newUser, { displayName });

      const userDocRef = doc(firestore, 'users', newUser.uid);
      const userData = {
        uid: newUser.uid,
        email: newUser.email,
        displayName: displayName, 
        role: role,
        createdAt: serverTimestamp(),
      };
      
      await setDoc(userDocRef, userData).catch(error => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'create',
                requestResourceData: userData
            }));
        });

      if (role === 'Instructor' || role === 'Manager') {
        router.push('/admin');
      } else {
        router.push('/account');
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth || !firestore) return;
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const { isNewUser } = getAdditionalUserInfo(result) || { isNewUser: false };
      
      if (isNewUser) {
        const newUser = result.user;
        const userDocRef = doc(firestore, 'users', newUser.uid);
        const userData = {
            uid: newUser.uid,
            email: newUser.email,
            displayName: newUser.displayName,
            photoURL: newUser.photoURL,
            role: 'Rider' as const, // Default role for Google Sign-in
            createdAt: serverTimestamp(),
        };

        await setDoc(userDocRef, userData, { merge: true });
      }
      router.push('/account');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (isUserLoading || user) {
    return (
        <div className="container py-12 text-center">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <div className="container flex flex-col items-center py-12">
      <PageHeader title="Sign Up" description="Create an account to start booking lessons." className="px-4"/>
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
                <Label htmlFor="displayName">Full Name</Label>
                <Input id="displayName" type="text" placeholder="Jane Doe" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
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
            <Button className="w-full" type="submit" disabled={isSigningUp}>
              {isSigningUp ? 'Creating Account...' : 'Create account'}
            </Button>
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
