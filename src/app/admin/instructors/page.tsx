'use client';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCollection } from "@/firebase";
import { Instructor } from "@/lib/types";
import { collection, getFirestore } from "firebase/firestore";

export default function AdminInstructorsPage() {
  const { data: instructors, loading } = useCollection<Instructor>(collection(getFirestore(), 'instructors'));

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between">
        <PageHeader title="Manage Instructors" className="text-left" />
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Instructor
        </Button>
      </div>
      <Card className="mt-8">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>...</AvatarFallback>
                      </Avatar>
                      Loading...
                    </div>
                  </TableCell>
                  <TableCell>Loading...</TableCell>
                  <TableCell>...</TableCell>
                </TableRow>
              ))}
              {instructors?.map((instructor) => (
                <TableRow key={instructor.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={instructor.imageUrl} alt={instructor.name} />
                        <AvatarFallback>{instructor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {instructor.name}
                    </div>
                  </TableCell>
                  <TableCell>{instructor.specialty}</TableCell>
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
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Schedule</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
