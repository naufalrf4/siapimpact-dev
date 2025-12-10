import { cn } from '@/lib/utils';
import { useState } from 'react';

interface StageItemProps {
    number: number;
    title: string;
    description?: string;
    output?: string;
    isLast?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export function StageItem({
    number,
    title,
    description,
    output,
    isLast = false,
    className,
    style,
}: StageItemProps) {
    const [isHovered, setIsHovered] = useState(false);
    const hasDetails = description || output;

    const handleClick = () => {
        const essayGuidelinesSection =
            document.getElementById('essay-guidelines');
        if (essayGuidelinesSection) {
            const navbarHeight = 80; // Account for sticky navbar
            const elementPosition =
                essayGuidelinesSection.getBoundingClientRect().top;
            const offsetPosition =
                elementPosition + window.scrollY - navbarHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div
            className={cn(
                'relative flex flex-col items-center text-center',
                'lg:flex-row lg:items-center lg:text-left',
                className,
            )}
            style={style}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex flex-col items-center lg:flex-row">
                <button
                    onClick={handleClick}
                    className={cn(
                        'flex h-12 w-12 shrink-0 items-center justify-center rounded-full',
                        'bg-primary text-lg font-bold text-primary-foreground shadow-md',
                        'transition-all duration-200 ease-out',
                        'hover:scale-110 hover:bg-primary/90 hover:shadow-lg',
                        'active:scale-100 active:shadow-md',
                        'sm:h-14 sm:w-14 sm:text-xl',
                        'cursor-pointer focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:outline-none',
                    )}
                    aria-label={`Tahap ${number}: ${title} - Klik untuk melihat panduan esai`}
                >
                    {number}
                </button>

                {/* Vertical connector for mobile */}
                {!isLast && (
                    <div className="my-2 h-8 w-0.5 bg-primary/30 lg:hidden" />
                )}

                {/* Horizontal connector for desktop */}
                {!isLast && (
                    <div className="hidden h-0.5 w-16 bg-primary/30 lg:block xl:w-24" />
                )}
            </div>

            <div className="mt-3 flex items-center gap-2 lg:mt-0 lg:ml-4">
                <div>
                    <p className="text-sm font-semibold text-foreground sm:text-base lg:text-lg">
                        {title}
                    </p>
                </div>
            </div>

            {/* Hover tooltip/card with expanded content */}
            {hasDetails && (
                <div
                    className={cn(
                        'absolute z-50 w-72 rounded-lg border border-border bg-card p-4 shadow-xl',
                        'transition-all duration-200 ease-out',
                        // Position: below on mobile, above on desktop
                        'top-full left-1/2 mt-2 -translate-x-1/2',
                        'lg:top-auto lg:bottom-full lg:mt-0 lg:mb-2',
                        // Visibility and animation
                        isHovered
                            ? 'pointer-events-auto translate-y-0 opacity-100'
                            : 'pointer-events-none translate-y-2 opacity-0 lg:-translate-y-2',
                    )}
                    role="tooltip"
                    aria-hidden={!isHovered}
                >
                    {/* Tooltip arrow */}
                    <div
                        className={cn(
                            'absolute h-3 w-3 rotate-45 border-border bg-card',
                            // Arrow position: top on mobile (pointing up), bottom on desktop (pointing down)
                            '-top-1.5 left-1/2 -translate-x-1/2 border-t border-l',
                            'lg:top-auto lg:-bottom-1.5 lg:border-t-0 lg:border-r lg:border-b lg:border-l-0',
                        )}
                    />

                    <h4 className="mb-2 text-sm font-bold text-foreground">
                        Tahap {number}: {title}
                    </h4>

                    {description && (
                        <div className="mb-3">
                            <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                Deskripsi
                            </p>
                            <p className="text-sm leading-relaxed text-foreground">
                                {description}
                            </p>
                        </div>
                    )}

                    {output && (
                        <div>
                            <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                Output
                            </p>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {output}
                            </p>
                        </div>
                    )}

                    <p className="mt-3 text-xs font-medium text-primary">
                        Klik untuk melihat panduan esai →
                    </p>
                </div>
            )}
        </div>
    );
}

export default StageItem;
