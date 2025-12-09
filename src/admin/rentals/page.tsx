
'use client';
import { useMemo, useState } from 'react';
import {
  useCollection,
  useFirestore,
  errorEmitter,
  FirestorePermissionError,
} from '@/firebase';
import { collection, doc, updateDoc } from 'firebase/firestore';
import type { MuseumRental } from '@/lib/types';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function AdminRentalsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const rentalsQuery = useMemo(
    () =>
      firestore
        ? collection(firestore, 'museumRentals')
        : null,
    [firestore]
  );
  const { data: rentals, isLoading } = useCollection<MuseumRental>(rentalsQuery);

  const handleStatusChange = (
    rentalId: string,
    status: 'Confirmed' | 'Cancelled'
  ) => {
    if (!firestore) return;

    const rentalRef = doc(firestore, 'museumRentals', rentalId);
    const rentalUpdate = { status };
    updateDoc(rentalRef, rentalUpdate)
      .then(() => {
        toast({
          title: 'Status Updated',
          description: `The rental has been marked as ${status}.`,
        });
      })
      .catch((error) => {
        errorEmitter.emit(
          'permission-error',
          new FirestorePermissionError({
            path: rentalRef.path,
            operation: 'update',
            requestResourceData: rentalUpdate,
          })
        );
      });
  };

  const getStatusVariant = (status: MuseumRental['status']) => {
    switch (status) {
      case 'Confirmed':
        return 'default';
      case 'Cancelled':
        return 'destructive';
      case 'Pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="Museum Rental Requests"
        description="Review and manage all incoming requests for museum rentals."
      />
      <Card className="mt-8">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead>Event Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ))}
              {rentals?.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell className="font-medium">{rental.userName}</TableCell>
                  <TableCell className="hidden md:table-cell">{rental.email}</TableCell>
                  <TableCell>
                    {format(new Date(rental.date), 'PPP')} at {rental.time}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(rental.status)}>
                      {rental.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(rental.id, 'Confirmed')}
                          disabled={rental.status === 'Confirmed'}
                        >
                          Confirm
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(rental.id, 'Cancelled')}
                          disabled={rental.status === 'Cancelled'}
                        >
                          Cancel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && rentals?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No rental requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
