
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Lesson, Instructor, Horse } from "@/lib/types";
import { Clock, User, Heart } from "lucide-react";

interface LessonCardProps {
    lesson: Lesson;
    instructor?: Instructor;
    horse?: Horse;
}

export function LessonCard({ lesson, instructor, horse }: LessonCardProps) {

    const getStatusVariant = (status: Lesson['status']) => {
        switch (status) {
            case 'Confirmed': return 'default';
            case 'Cancelled': return 'destructive';
            case 'Pending': return 'secondary';
            default: return 'outline';
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{lesson.userName}</CardTitle>
                        <CardDescription>{lesson.type} Lesson</CardDescription>
                    </div>
                     <Badge variant={getStatusVariant(lesson.status)}>{lesson.status}</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                 <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{lesson.time}</span>
                </div>
                {instructor && (
                    <div className="flex items-center text-sm text-muted-foreground">
                        <User className="mr-2 h-4 w-4" />
                        <span>Instructor: {instructor.name}</span>
                    </div>
                )}
                {horse && (
                     <div className="flex items-center text-sm text-muted-foreground">
                        <Heart className="mr-2 h-4 w-4" />
                        <span>Horse: {horse.name}</span>
                    </div>
                )}
                 {!horse && lesson.horseId && (
                     <div className="flex items-center text-sm text-muted-foreground">
                        <Heart className="mr-2 h-4 w-4" />
                        <span>Horse ID: {lesson.horseId}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

    