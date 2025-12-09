
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
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isUserLoading) {
      // Still waiting for user data to load.
      return;
    }

    if (!user) {
      // If loading is finished and there's no user, redirect to login.
      router.push('/login?redirect=/admin');
      return;
    }
    
    // Check if the user's role allows access to the admin dashboard
    const hasAdminAccess = user.role === 'Instructor' || user.role === 'Manager' || user.role === 'Admin';
    if (hasAdminAccess) {
        setIsAuthorized(true);
    } else {
        // If the user is not authorized, redirect them to their account page.
        router.push('/account');
    }
  }, [user, isUserLoading, router]);

  // While checking for authorization, show a loading state.
  if (isUserLoading || !isAuthorized) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="animate-pulse">
                <Logo className="h-12 w-auto text-muted-foreground" />
                <p className="text-muted-foreground mt-2">Checking permissions...</p>
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
