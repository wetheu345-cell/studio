export interface Horse {
  id: string;
  name: string;
  breed: string;
  age: number;
  description: string;
  imageUrl: string;
  imageHint: string;
  suitability: 'Beginner' | 'Intermediate' | 'Advanced' | 'Therapy';
}

export interface Instructor {
  id: string;
  name: string;
  specialty: string;
  bio: string;
imageUrl: string;
  imageHint: string;
  userId?: string;
}

export interface Lesson {
  id: string;
  userId: string;
  type: 'Regular' | 'Therapy';
  instructorId: string;
  horseId: string;
  date: string;
  time: string;
  userName: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}
