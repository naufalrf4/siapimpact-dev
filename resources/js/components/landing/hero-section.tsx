import { Button } from '@/components/ui/button';
import { usePrefersReducedMotion } from '@/hooks/use-scroll-animation';
import { heroContent } from '@/lib/landing-data';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeroSectionProps {
    className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
    const prefersReducedMotion = usePrefersReducedMotion();
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        if (prefersReducedMotion) return;

        const timer = setTimeout(() => setHasAnimated(true), 100);
        return () => clearTimeout(timer);
    }, [prefersReducedMotion]);

    const isVisible = prefersReducedMotion || hasAnimated;

    const handleScrollToGuidelines = (
        e: React.MouseEvent<HTMLButtonElement>,
    ) => {
        e.preventDefault();
        const target = document.getElementById(
            heroContent.secondaryCta.targetId,
        );
        if (target) {
            const navbarHeight = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition =
                elementPosition + window.scrollY - navbarHeight;
            window.scrollTo({
                top: offsetPosition,
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
            });
        }
    };

    const handleScrollDown = () => {
        window.scrollTo({
            top: window.innerHeight - 80,
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
    };

    const getAnimationClass = () => {
        if (prefersReducedMotion) return '';
        return cn(
            'scroll-animate-fade-up',
            isVisible && 'scroll-animate-visible',
        );
    };

    const getAnimationStyle = (delayMs: number): React.CSSProperties => {
        if (prefersReducedMotion) return {};
        return { animationDelay: `${delayMs}ms` };
    };

    return (
        <section
            className={cn(
                'relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 py-16 text-center sm:px-6 sm:py-12 lg:px-8',
                className,
            )}
        >
            {/* Background decorative elements */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute right-1/4 bottom-0 h-[400px] w-[400px] translate-y-1/2 rounded-full bg-accent/5 blur-3xl" />
                <div className="absolute top-1/3 right-0 h-[300px] w-[300px] translate-x-1/2 rounded-full bg-secondary/5 blur-3xl" />
            </div>

            {/* Grid pattern overlay */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='currentColor'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
                }}
            />

            <div className="relative mx-auto max-w-5xl">
                {/* Logos */}
                <div
                    className={cn(
                        'mb-12 flex items-center justify-center gap-6 sm:gap-8 lg:gap-12',
                        getAnimationClass(),
                    )}
                    style={getAnimationStyle(0)}
                >
                    <div className="group relative">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
                        <img
                            src="/images/logo/kemendukbangga.png"
                            alt="Logo Kementerian Pembangunan Keluarga dan Demografi (Kemendukbangga)"
                            className="relative h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:h-20 lg:h-24"
                        />
                    </div>
                    <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent sm:h-16 lg:h-20" />
                    <div className="group relative">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
                        <img
                            src="/images/logo/sakina.png"
                            alt="Logo SAKINA - Superapps Keluarga Indonesia"
                            className="relative h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:h-20 lg:h-24"
                        />
                    </div>
                </div>

                {/* Tagline badge */}
                <div
                    className={cn(
                        'mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2',
                        'border border-primary/20 bg-primary/10',
                        getAnimationClass(),
                    )}
                    style={getAnimationStyle(50)}
                >
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                    </span>
                    <span className="text-sm font-medium text-primary sm:text-base">
                        {heroContent.tagline}
                    </span>
                </div>

                {/* Headline */}
                <h1
                    className={cn(
                        'mb-6 text-3xl leading-tight font-bold text-foreground sm:text-4xl lg:text-5xl xl:text-6xl',
                        getAnimationClass(),
                    )}
                    style={getAnimationStyle(150)}
                >
                    {heroContent.headline}
                </h1>

                {/* Subheadline */}
                <p
                    className={cn(
                        'mx-auto mb-10 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl',
                        getAnimationClass(),
                    )}
                    style={getAnimationStyle(250)}
                >
                    {heroContent.subheadline}
                </p>

                {/* CTA Buttons */}
                <div
                    className={cn(
                        'flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-5',
                        getAnimationClass(),
                    )}
                    style={getAnimationStyle(350)}
                >
                    <Button
                        asChild
                        size="lg"
                        className="group w-full bg-gradient-to-r from-primary to-primary/90 px-8 py-6 text-base font-semibold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl sm:w-auto sm:text-lg"
                    >
                        <Link href={heroContent.primaryCta.href}>
                            {heroContent.primaryCta.text}
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleScrollToGuidelines}
                        className="w-full border-2 px-8 py-6 text-base font-semibold transition-all duration-300 hover:scale-105 hover:bg-accent/10 sm:w-auto sm:text-lg"
                    >
                        {heroContent.secondaryCta.text}
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
