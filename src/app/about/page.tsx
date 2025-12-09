
'use client';
import { PageHeader } from "@/components/page-header"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Heart } from "lucide-react"

export default function AboutPage() {
    const aboutImage1 = PlaceHolderImages.find(img => img.id === 'about-1');
    const aboutImage2 = PlaceHolderImages.find(img => img.id === 'about-2');

    return (
        <div className="container py-12 md:py-16">
            <PageHeader 
                title="Our Story"
                description="Founded in 1984 by Patricia E. Kelly, a U.S. Marine Corps veteran and African-American cowgirl, to provide urban youth and families with access to the healing power of horses."
            />

            <div className="mt-12 grid md:grid-cols-2 gap-12 items-center">
                {aboutImage1 && (
                    <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                        <Image src={aboutImage1.imageUrl} alt="Founder with horse" fill className="object-cover" data-ai-hint={aboutImage1.imageHint} />
                    </div>
                )}
                <div className="space-y-4">
                    <h2 className="font-headline text-3xl font-bold tracking-wide">The Inspiration</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        The inspiration to start EHI came when a child from a Hartford neighborhood asked Patricia, “Is that a real horse?”—a question that revealed how few opportunities many underserved youth had to connect with nature or experience equine life firsthand.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        Her dream was to level the playing field for youth from urban communities, to give them access to the same opportunities, resources, equine-based programming, and equine-assisted therapy as their suburban counterparts. She knew this would be life-altering and enriching for those who became involved.
                    </p>
                </div>
            </div>

            <div className="mt-16 grid md:grid-cols-2 gap-12 items-center">
                 <div className="space-y-4 md:order-2">
                    <h2 className="font-headline text-3xl font-bold tracking-wide">A Home in Keney Park</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        EHI operates from its Equestrian and Therapeutic Center in the historic landmark, Keney Park, a 693-acre park designed by Frederick Law Olmsted. There are 25 miles of well-maintained trails throughout the park’s wooded area for riders to explore.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        Our facility features spacious stables and both indoor and outdoor riding arenas, accommodating public lessons and advanced training for our jumping and dressage teams.
                    </p>
                </div>
                {aboutImage2 && (
                    <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg md:order-1">
                        <Image src={aboutImage2.imageUrl} alt="Riding trails in a park" fill className="object-cover" data-ai-hint={aboutImage2.imageHint} />
                    </div>
                )}
            </div>

            <div className="mt-16 text-center max-w-4xl mx-auto">
                 <h2 className="font-headline text-3xl font-bold tracking-wide">Join Our Teams</h2>
                 <p className="text-muted-foreground leading-relaxed mt-4">
                    Ready to take your riding to the next level? EHI is home to competitive jumping and dressage teams. We offer advanced training for dedicated riders looking to excel in their discipline.
                 </p>
                 <Button asChild className="mt-6">
                    <Link href="/booking">Inquire About Joining</Link>
                 </Button>
            </div>

             <div className="mt-16 text-center max-w-4xl mx-auto">
                 <h2 className="font-headline text-3xl font-bold tracking-wide">Leading the Way in Equine Therapy</h2>
                 <p className="text-muted-foreground leading-relaxed mt-4">
                    EHI has become the regional leader in providing culturally competent equine-assisted therapy and Psychotherapy. Mental health professionals, MSW, and BSW students can earn Continuing Education Credits (CECs) approved by NASW/CT. EHI also offers a certification course in Culturally Competent Equine Assisted Psychotherapy (CEAT) training.
                 </p>
            </div>

            <div className="mt-16">
                <Card className="bg-secondary/50">
                    <CardContent className="p-8 md:p-12 grid md:grid-cols-3 gap-8 items-center">
                        <div className="md:col-span-2 space-y-4">
                            <h2 className="font-headline text-3xl font-bold tracking-wide">Support Our Mission</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                As a 501(c)(3) non-profit organization, EHI relies on funding from grants, private foundations, individual contributions, and in-kind donations. Each of our 16 horses requires $3,000 per year for food, boarding, training, and veterinary care. You can help us continue our good work with a donation today.
                            </p>
                        </div>
                        <div className="text-center">
                             <Button size="lg" asChild>
                                <a href="https://ebonyhorsewomen.org/donate" target="_blank" rel="noopener noreferrer">
                                    <Heart className="mr-2 h-5 w-5" />
                                    Donate Now
                                </a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>


        </div>
    )
}
