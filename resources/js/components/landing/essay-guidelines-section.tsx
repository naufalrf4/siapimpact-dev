import { usePrefersReducedMotion } from '@/hooks/use-scroll-animation';
import { essayGuidelines, essayGuidelinesHeading } from '@/lib/landing-data';
import { cn } from '@/lib/utils';
import { CheckCircle2, FileText } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface EssayGuidelinesSectionProps {
    id?: string;
    className?: string;
}

export function EssayGuidelinesSection({
    id = 'essay-guidelines',
    className,
}: EssayGuidelinesSectionProps) {
    const { technical, structure } = essayGuidelines;
    const sectionRef = useRef<HTMLElement | null>(null);
    const prefersReducedMotion = usePrefersReducedMotion();
    const [hasIntersected, setHasIntersected] = useState(false);

    useEffect(() => {
        if (prefersReducedMotion) return;

        const element = sectionRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    setHasIntersected(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px',
            },
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [prefersReducedMotion]);

    const isVisible = prefersReducedMotion || hasIntersected;

    return (
        <section
            ref={sectionRef}
            id={id}
            className={cn('px-4 py-20 sm:px-6 lg:px-8', className)}
        >
            <div className="mx-auto max-w-6xl">
                <h2
                    className={cn(
                        'mb-12 text-center text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl',
                        !prefersReducedMotion && 'scroll-animate-fade-up',
                        isVisible && 'scroll-animate-visible',
                    )}
                >
                    {essayGuidelinesHeading}
                </h2>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Technical Requirements Card */}
                    <div
                        className={cn(
                            'rounded-xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg',
                            !prefersReducedMotion && 'scroll-animate-fade-up',
                            isVisible && 'scroll-animate-visible',
                        )}
                        style={
                            !prefersReducedMotion
                                ? { animationDelay: '100ms' }
                                : undefined
                        }
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground">
                                Persyaratan Teknis
                            </h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                                <div className="w-24 shrink-0 text-sm font-medium text-muted-foreground">
                                    Jumlah Kata
                                </div>
                                <div className="font-medium text-foreground">
                                    {technical.wordCount}
                                </div>
                            </div>
                            <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                                <div className="w-24 shrink-0 text-sm font-medium text-muted-foreground">
                                    Format
                                </div>
                                <div className="font-medium text-foreground">
                                    {technical.format}
                                </div>
                            </div>
                            <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                                <div className="w-24 shrink-0 text-sm font-medium text-muted-foreground">
                                    Bahasa
                                </div>
                                <div className="font-medium text-foreground">
                                    {technical.language}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 rounded-lg bg-muted/50 p-3">
                                <div className="text-sm font-medium text-muted-foreground">
                                    Penamaan File
                                </div>
                                <code className="rounded bg-primary/10 px-2 py-1 text-sm font-medium break-all text-primary">
                                    {technical.fileNaming}
                                </code>
                            </div>
                        </div>
                    </div>

                    {/* Content Structure Card */}
                    <div
                        className={cn(
                            'rounded-xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg',
                            !prefersReducedMotion && 'scroll-animate-fade-up',
                            isVisible && 'scroll-animate-visible',
                        )}
                        style={
                            !prefersReducedMotion
                                ? { animationDelay: '200ms' }
                                : undefined
                        }
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground">
                                Struktur Konten
                            </h3>
                        </div>

                        <ol className="space-y-4">
                            {structure.map((item) => (
                                <li key={item.id} className="group flex gap-4">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm transition-transform group-hover:scale-110">
                                        {item.id}
                                    </span>
                                    <div className="flex-1 pt-0.5">
                                        <span className="mb-1 block font-semibold text-foreground">
                                            {item.title}
                                        </span>
                                        <span className="text-sm leading-relaxed text-muted-foreground">
                                            {item.description}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default EssayGuidelinesSection;
