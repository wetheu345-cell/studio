
'use client';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AdminSidebar } from "./_components/admin-sidebar"
import { AdminHeader } from "./_components/admin-header"
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/icons";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, firebaseUser, isUserLoading } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isUserLoading) {
      return;
    }

    if (!firebaseUser) {
      router.push('/login?redirect=/admin');
      return;
    }
    
    // Once we have the app user object, we can check their role.
    if (user) {
        const hasAdminAccess = user.role === 'Instructor' || user.role === 'Manager' || user.role === 'Admin';
        if (hasAdminAccess) {
            setIsAuthorized(true);
        } else {
            // User is logged in but not an admin type, send them to their profile.
            router.push('/account');
        }
    } else if (!isUserLoading && firebaseUser && !user) {
        // This can happen briefly while the user document is loading, or if it doesn't exist.
        // If they definitely don't have a user doc, they are not an admin.
        router.push('/account');
    }

  }, [user, firebaseUser, isUserLoading, router]);

  // While checking for authorization, show a loading state.
  if (isUserLoading || !isAuthorized) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <Logo className="h-12 w-auto text-muted-foreground" />
                <p className="text-muted-foreground">Checking permissions...</p>
            </div>
        </div>
    );
  }
  
  // If authorized, render the admin layout.
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader />
        <main className="h-full">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
