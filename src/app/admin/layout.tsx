'use client';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AdminSidebar } from "./_components/admin-sidebar"
import { useUser, useFirestore } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { Logo } from "@/components/icons";
import { Header } from "@/components/layout/header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (firestore) {
      const userDocRef = doc(firestore, 'users', user.uid);
      getDoc(userDocRef).then(userDoc => {
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role === 'Instructor' || userData.role === 'Manager') {
            setIsAuthorized(true);
          } else {
            router.push('/account'); // Redirect non-admins
          }
        } else {
            router.push('/account'); // Redirect if user doc doesn't exist
        }
        setLoading(false);
      });
    }
  }, [user, userLoading, firestore, router]);


  return (
    <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
            <Header />
            {loading || !isAuthorized ? (
                 <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center">
                    <div className="animate-pulse">
                        <Logo className="h-12 w-auto text-muted-foreground" />
                    </div>
                </div>
            ) : (
                children
            )}
        </SidebarInset>
    </SidebarProvider>
  )
}
