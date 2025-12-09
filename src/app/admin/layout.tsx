
'use client';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AdminSidebar } from "./_components/admin-sidebar"
import { AdminHeader } from "./_components/admin-header"
import { useUser, useFirestore } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { Logo } from "@/components/icons";
import { FirebaseErrorListener } from "@/components/FirebaseErrorListener";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authCheckCompleted, setAuthCheckCompleted] = useState(false);

  useEffect(() => {
    // Wait until the initial user loading is finished
    if (isUserLoading) {
      return;
    }

    // If no user is logged in, redirect to login page
    if (!user) {
      router.push('/login');
      return;
    }
    
    // If user is logged in, check their role from Firestore
    if (firestore) {
      // The manager role is hardcoded in security rules to a specific email.
      // We can perform a client-side check for a better UX, but the rules are the source of truth.
      if (user.email === 'wetheu345@gmail.com') {
        setIsAuthorized(true);
        setAuthCheckCompleted(true);
        return;
      }

      const userDocRef = doc(firestore, 'users', user.uid);
      getDoc(userDocRef).then(userDoc => {
        if (userDoc.exists()) {
          const userData = userDoc.data();
          // Check if user has an authorized role
          if (userData.role === 'Instructor' || userData.role === 'Manager') {
            setIsAuthorized(true);
          } else {
            // If role is not authorized, redirect to their account page
            router.push('/account');
          }
        } else {
          // If no user document exists, they are not an admin
            router.push('/account'); 
        }
        // Mark the authorization check as complete
        setAuthCheckCompleted(true);
      }).catch(() => {
        // On error fetching doc, treat as unauthorized and redirect
        router.push('/account');
        setAuthCheckCompleted(true);
      });
    }
  }, [user, isUserLoading, firestore, router]);

  // Show a loading indicator while checking auth status
  const isLoading = isUserLoading || !authCheckCompleted;
  if (isLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="animate-pulse">
                <Logo className="h-12 w-auto text-muted-foreground" />
            </div>
        </div>
    );
  }

  // If authorized, render the admin layout
  if (isAuthorized) {
    return (
      <SidebarProvider>
        <FirebaseErrorListener />
        <AdminSidebar />
        <SidebarInset>
          <AdminHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // Render nothing (or a fallback) while redirecting for unauthorized users
  return null;
}
