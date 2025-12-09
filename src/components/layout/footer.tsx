
'use client';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Heart } from 'lucide-react';
import { Logo } from '@/components/icons';
import Link from 'next/link';
import { useUser } from '@/firebase';

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            {...props}
        >
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.84-.95-6.43-2.8-1.59-1.87-2.32-4.2-1.9-6.4.24-1.28.62-2.5 1.16-3.66.73-1.56 1.76-2.93 3.07-4.08.91-.8 1.94-1.42 3.09-1.83.01-2.54.01-5.08.01-7.62Z" />
        </svg>
    )
}

export function Footer() {
    const { user } = useUser();
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
                <h4 className="font-headline text-lg tracking-wide">Quick Links</h4>
                <ul className="space-y-1">
                    <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
                    <li><Link href="/booking" className="text-muted-foreground hover:text-primary">Booking</Link></li>
                    <li><Link href="/horses" className="text-muted-foreground hover:text-primary">Our Horses</Link></li>
                    <li><Link href="/instructors" className="text-muted-foreground hover:text-primary">Instructors</Link></li>
                    <li><a href="https://ebonyhorsewomen.org/donate" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">Donate</a></li>
                    {user ? (
                        <li><Link href="/admin" className="text-muted-foreground hover:text-primary">Admin</Link></li>
                    ) : (
                        <li><Link href="/login" className="text-muted-foreground hover:text-primary">Admin Login</Link></li>
                    )}
                </ul>
            </div>
             <div className="space-y-2">
                <h4 className="font-headline text-lg tracking-wide">Contact Us</h4>
                <ul className="space-y-1 text-muted-foreground text-sm">
                    <li>337 Vine Street</li>
                    <li>Hartford, CT 06112</li>
                    <li>860-293-2914</li>
                    <li>contact@ebonyhorsewomen.com</li>
                </ul>
            </div>
            <div className="space-y-2">
                <h4 className="font-headline text-lg tracking-wide">Follow Us</h4>
                <div className="flex space-x-4">
                    <Link href="https://www.facebook.com/EbonyHorsewomenCenter" aria-label="Facebook"><Facebook className="h-6 w-6 text-muted-foreground hover:text-primary" /></Link>
                    <Link href="https://www.instagram.com/ebonyhorsewomen" aria-label="Instagram"><Instagram className="h-6 w-6 text-muted-foreground hover:text-primary" /></Link>
                    <Link href="https://www.linkedin.com/company/ebonyhorsewomeninc" aria-label="LinkedIn"><Linkedin className="h-6 w-6 text-muted-foreground hover:text-primary" /></Link>
                    <Link href="https://www.youtube.com/c/EHIEquestrianandTherapeuticCenter" aria-label="YouTube"><Youtube className="h-6 w-6 text-muted-foreground hover:text-primary" /></Link>
                    <Link href="https://www.tiktok.com/@ebonyhorsewomeninc" aria-label="TikTok"><TikTokIcon className="h-6 w-6 text-muted-foreground hover:text-primary" /></Link>
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
}
