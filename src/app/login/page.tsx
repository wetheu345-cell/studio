
'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/page-header';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isUserLoading } = useUser();

  const redirectUrl = searchParams.get('redirect');

  useEffect(() => {
    if (isUserLoading || !user) {
      return;
    }

    if (redirectUrl) {
        router.push(redirectUrl);
        return;
    }

    if (firestore) {
      const userDocRef = doc(firestore, 'users', user.uid);
      getDoc(userDocRef).then(userDoc => {
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role === 'Instructor' || userData.role === 'Manager' || userData.role === 'Admin') {
            router.push('/admin');
          } else {
            router.push('/account');
          }
        } else {
          router.push('/account');
        }
      });
    }
  }, [user, isUserLoading, firestore, router, redirectUrl]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!auth) return;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The useEffect will handle the redirect
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // The useEffect will handle the redirect
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
      <PageHeader title="Log In" description="Access your account to manage lessons." />
      <Card className="w-full max-w-sm mt-8">
        <form onSubmit={handleLogin}>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>Enter your email below to login to your account.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
             <Button variant="outline" type="button" onClick={handleGoogleSignIn}>
                Login with Google
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
            {error && <p className="text-destructive text-sm">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit">Sign in</Button>
            <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="underline">
                    Sign up
                </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

    