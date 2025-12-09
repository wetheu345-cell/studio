export type UserRole = 'Admin' | 'Manager' | 'Instructor' | 'Rider';

export interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  role: UserRole;
  createdAt: any;
}

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

export type HorseFormData = Omit<Horse, 'id' | 'imageUrl' | 'imageHint'> & {
  imageFile?: FileList;
};

export interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  timestamp: any;
}

export interface TimeSlot {
    date: string; 
    startTime: string; 
    endTime: string; 
}

export interface Availability {
    id: string;
    instructorId: string;
    weekStartDate: string;
    timeSlots: TimeSlot[];
}

export interface MuseumRental {
  id: string;
  userId: string;
  userName: string;
  email: string | null;
  date: string;
  time: string;
  guests: number;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
}
