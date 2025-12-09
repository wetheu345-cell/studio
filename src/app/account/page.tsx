'use client';
import { useUser } from '@/firebase';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { User as UserIcon, Mail } from 'lucide-react';

export default function AccountPage() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="container py-12">
        <Skeleton className="h-10 w-1/3 mx-auto" />
        <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
        <Card className="max-w-md mx-auto mt-8">
            <CardHeader className="flex flex-row items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-12 text-center">
        <PageHeader title="Access Denied" description="Please log in to view your account details." />
      </div>
    );
  }

  return (
    <div className="container py-12">
      <PageHeader title="My Profile" description="View and manage your account details." />
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
            <AvatarFallback>
              <UserIcon className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{user.displayName || 'No Name Provided'}</CardTitle>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </CardHeader>
        <CardContent>
            <h3 className="font-semibold mb-4">Lesson History</h3>
            <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-8">
                <p>Your upcoming and past lessons will be displayed here.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
