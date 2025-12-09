'use client';
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCollection, useFirestore, errorEmitter, FirestorePermissionError } from "@/firebase"
import type { Horse } from "@/lib/types";
import { collection, deleteDoc, doc } from "firebase/firestore"
import { HorseFormDialog } from "./_components/horse-form-dialog";
import { useToast } from "@/hooks/use-toast";

export default function AdminHorsesPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const horsesCollection = useMemo(() => firestore ? collection(firestore, 'horses') : null, [firestore]);
  const { data: horses, isLoading } = useCollection<Horse>(horsesCollection);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedHorse, setSelectedHorse] = useState<Horse | undefined>(undefined);

  const handleAddHorse = () => {
    setSelectedHorse(undefined);
    setIsDialogOpen(true);
  };

  const handleEditHorse = (horse: Horse) => {
    setSelectedHorse(horse);
    setIsDialogOpen(true);
  }

  const handleDeleteHorse = (horseId: string) => {
    if (!firestore) return;
    if (window.confirm("Are you sure you want to delete this horse?")) {
      const horseRef = doc(firestore, 'horses', horseId);
      deleteDoc(horseRef)
        .then(() => {
          toast({ title: 'Success', description: 'Horse deleted successfully.' });
        })
        .catch(error => {
          errorEmitter.emit(
            'permission-error',
            new FirestorePermissionError({
              path: horseRef.path,
              operation: 'delete'
            })
          );
        });
    }
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between">
        <PageHeader title="Manage Horses" />
        <Button onClick={handleAddHorse}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Horse
        </Button>
      </div>
      <Card className="mt-8">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Breed</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Suitability</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">Loading...</TableCell>
                  <TableCell className="hidden sm:table-cell">Loading...</TableCell>
                  <TableCell>...</TableCell>
                  <TableCell>...</TableCell>
                  <TableCell>...</TableCell>
                </TableRow>
              ))}
              {horses?.map((horse) => (
                <TableRow key={horse.id}>
                  <TableCell className="font-medium">{horse.name}</TableCell>
                  <TableCell className="hidden sm:table-cell">{horse.breed}</TableCell>
                  <TableCell>{horse.age}</TableCell>
                  <TableCell>
                    <Badge variant={horse.suitability === "Therapy" ? "destructive" : "secondary"}>
                      {horse.suitability}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditHorse(horse)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteHorse(horse.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <HorseFormDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        horse={selectedHorse}
      />
    </div>
  )
}
