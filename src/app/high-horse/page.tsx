
'use client';
import { PageHeader } from "@/components/page-header"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlayCircle } from "lucide-react";

export default function HighHorsePage() {
    const featureImage = PlaceHolderImages.find(img => img.id === 'high-horse-1');
    const documentaryUrl = "https://www.peacocktv.com/watch-online/tv/high-horse-the-black-cowboy/7955261022260771112";

    return (
        <div className="container py-12 md:py-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-4">
                     <PageHeader 
                        title="Featured in 'The High Horse'"
                        description="We are honored to be featured in the NBC News documentary, 'The High Horse,' which shines a light on the stories of Black and brown horse riders reclaiming their space in the equestrian world."
                        className="text-left items-start"
                    />
                    <p className="text-muted-foreground leading-relaxed">
                        The film explores the rich history and vibrant present of horsemanship within communities of color, a narrative that has long been overlooked. Our founder, Patricia Kelly, and the mission of Ebony Horsewomen are central to this powerful story of resilience, healing, and community.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        We invite you to watch the documentary to see firsthand how the deep bond between humans and horses can inspire change and create a more inclusive future for the next generation of equestrians.
                    </p>
                     <Button size="lg" asChild>
                        <a href={documentaryUrl} target="_blank" rel="noopener noreferrer">
                            <PlayCircle className="mr-2 h-5 w-5" />
                            Watch on Peacock
                        </a>
                    </Button>
                </div>
                 {featureImage && (
                    <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                        <Image src={featureImage.imageUrl} alt="High Horse documentary feature" fill className="object-cover" data-ai-hint={featureImage.imageHint} />
                    </div>
                )}
            </div>
        </div>
    )
}
