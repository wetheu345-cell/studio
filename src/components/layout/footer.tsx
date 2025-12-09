import { Facebook, Twitter, Instagram } from 'lucide-react';
import { Logo } from '@/components/icons';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t py-10">
      <div className="container grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-start gap-4">
          <Logo className="h-8 w-auto" />
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Ebony Horse Women. All rights reserved.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-2">
            <div className="space-y-2">
                <h4 className="font-headline text-lg">Quick Links</h4>
                <ul className="space-y-1">
                    <li><Link href="/booking" className="text-muted-foreground hover:text-primary">Booking</Link></li>
                    <li><Link href="/horses" className="text-muted-foreground hover:text-primary">Our Horses</Link></li>
                    <li><Link href="/instructors" className="text-muted-foreground hover:text-primary">Instructors</Link></li>
                    <li><Link href="/admin" className="text-muted-foreground hover:text-primary">Admin Login</Link></li>
                </ul>
            </div>
             <div className="space-y-2">
                <h4 className="font-headline text-lg">Contact Us</h4>
                <ul className="space-y-1 text-muted-foreground text-sm">
                    <li>123 Horse Ranch Rd</li>
                    <li>Equestria, 54321</li>
                    <li>(123) 456-7890</li>
                    <li>contact@ebonyhorsewomen.com</li>
                </ul>
            </div>
            <div className="space-y-2">
                <h4 className="font-headline text-lg">Follow Us</h4>
                <div className="flex space-x-4">
                    <Link href="#" aria-label="Facebook"><Facebook className="h-6 w-6 text-muted-foreground hover:text-primary" /></Link>
                    <Link href="#" aria-label="Twitter"><Twitter className="h-6 w-6 text-muted-foreground hover:text-primary" /></Link>
                    <Link href="#" aria-label="Instagram"><Instagram className="h-6 w-6 text-muted-foreground hover:text-primary" /></Link>
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
}
