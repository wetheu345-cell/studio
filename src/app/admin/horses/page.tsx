'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCollection, useFirestore } from "@/firebase"
import type { Horse } from "@/lib/types";
import { collection, deleteDoc, doc } from "firebase/firestore"
import { HorseFormDialog } from "./_components/horse-form-dialog";

export default function AdminHorsesPage() {
  const firestore = useFirestore();
  const { data: horses, loading } = useCollection<Horse>(collection(getFirestore(), 'horses'));
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

  const handleDeleteHorse = async (horseId: string) => {
    if (window.confirm("Are you sure you want to delete this horse?")) {
      await deleteDoc(doc(firestore, 'horses', horseId));
    }
  }


  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between">
        <PageHeader title="Manage Horses" className="text-left" />
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
                <TableHead>Breed</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Suitability</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">Loading...</TableCell>
                  <TableCell>Loading...</TableCell>
                  <TableCell>...</TableCell>
                  <TableCell>...</TableCell>
                  <TableCell>...</TableCell>
                </TableRow>
              ))}
              {horses?.map((horse) => (
                <TableRow key={horse.id}>
                  <TableCell className="font-medium">{horse.name}</TableCell>
                  <TableCell>{horse.breed}</TableCell>
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
