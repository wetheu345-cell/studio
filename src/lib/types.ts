
export type UserRole = 'Admin' | 'Manager' | 'Instructor' | 'Rider';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
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
    date: string; // e.g., "2024-12-09"
    startTime: string; // e.g., "09:00"
    endTime: string; // e.g., "11:00"
}

export interface Availability {
    id: string;
    instructorId: string;
    weekStartDate: string; // "2024-12-09"
    timeSlots: TimeSlot[];
}

export interface MuseumRental {
  id: string;
  userId: string;
  userName: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
}

