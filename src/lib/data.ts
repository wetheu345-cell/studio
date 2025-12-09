import type { Horse, Instructor, Lesson } from './types';
import imageData from './placeholder-images.json';

export const PlaceHolderImages = imageData.placeholderImages;

const horseImages = PlaceHolderImages.filter(img => img.type === 'horse');

export const horses: Horse[] = horseImages.map((img, index) => ({
  id: img.id,
  name: img.name || `Horse ${index + 1}`,
  breed: img.breed || 'Unknown Breed',
  age: Math.floor(Math.random() * 15) + 5,
  description: `This is a wonderful horse with a great temperament. Perfect for riders of all levels. Enjoys long walks and is very gentle.`,
  imageUrl: img.imageUrl,
  imageHint: img.imageHint,
  suitability: ['Beginner', 'Intermediate', 'Advanced', 'Therapy'][index % 4] as 'Beginner' | 'Intermediate' | 'Advanced' | 'Therapy',
}));

const instructorImages = PlaceHolderImages.filter(img => img.type === 'instructor');

export const instructors: Instructor[] = [
  {
    id: 'instructor-1',
    name: 'Jane Doe',
    specialty: 'Beginner & Youth Lessons',
    bio: 'Jane has been riding for over 20 years and has a passion for teaching new riders. Her patient and encouraging approach makes her a favorite among beginners.',
    imageUrl: instructorImages.find(i => i.id === 'instructor-1')?.imageUrl || '',
    imageHint: instructorImages.find(i => i.id === 'instructor-1')?.imageHint || '',
  },
  {
    id: 'instructor-2',
    name: 'John Smith',
    specialty: 'Advanced & Dressage',
    bio: 'A former competitor, John brings a wealth of knowledge in advanced riding techniques and dressage. He helps riders hone their skills and reach their potential.',
    imageUrl: instructorImages.find(i => i.id === 'instructor-2')?.imageUrl || '',
    imageHint: instructorImages.find(i => i.id === 'instructor-2')?.imageHint || '',
  },
  {
    id: 'instructor-3',
    name: 'Emily Jones',
    specialty: 'Therapeutic Riding',
    bio: 'Emily is a certified therapeutic riding instructor with a background in occupational therapy. She believes in the healing power of horses and creates a safe, supportive environment.',
    imageUrl: instructorImages.find(i => i.id === 'instructor-3')?.imageUrl || '',
    imageHint: instructorImages.find(i => i.id === 'instructor-3')?.imageHint || '',
  },
  {
    id: 'instructor-4',
    name: 'Michael Brown',
    specialty: 'All-around Horsemanship',
    bio: 'Michael focuses on building a strong foundation of horsemanship, from groundwork to advanced riding. His holistic approach builds confidence in both horse and rider.',
    imageUrl: instructorImages.find(i => i.id === 'instructor-4')?.imageUrl || '',
    imageHint: instructorImages.find(i => i.id === 'instructor-4')?.imageHint || '',
  },
];

export const lessons: Lesson[] = [
    { id: '1', type: 'Regular', instructorId: 'instructor-1', horseId: 'horse-1', date: '2024-08-10', time: '09:00', userName: 'Alice Johnson', status: 'Confirmed' },
    { id: '2', type: 'Therapy', instructorId: 'instructor-3', horseId: 'horse-5', date: '2024-08-10', time: '10:00', userName: 'Bob Williams', status: 'Confirmed' },
    { id: '3', type: 'Regular', instructorId: 'instructor-2', horseId: 'horse-3', date: '2024-08-11', time: '14:00', userName: 'Charlie Davis', status: 'Pending' },
];
