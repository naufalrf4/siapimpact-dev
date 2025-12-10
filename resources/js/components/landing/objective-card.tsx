import { cn } from '@/lib/utils';
import { Heart, Lightbulb, Target, Users } from 'lucide-react';

interface ObjectiveCardProps {
    title: string;
    icon?: React.ReactNode;
    index?: number;
    className?: string;
    style?: React.CSSProperties;
}

const iconMap: Record<number, React.ReactNode> = {
    0: <Heart className="h-6 w-6" />,
    1: <Users className="h-6 w-6" />,
    2: <Lightbulb className="h-6 w-6" />,
    3: <Target className="h-6 w-6" />,
};

const gradientColors: Record<number, string> = {
    0: 'from-rose-500 to-pink-500',
    1: 'from-blue-500 to-cyan-500',
    2: 'from-amber-500 to-orange-500',
    3: 'from-emerald-500 to-teal-500',
};

export function ObjectiveCard({
    title,
    icon,
    index = 0,
    className,
    style,
}: ObjectiveCardProps) {
    const displayIcon = icon || iconMap[index % 4];
    const gradient = gradientColors[index % 4];

    return (
        <div
            className={cn(
                'group relative flex items-start gap-4 rounded-xl p-5',
                'border border-border/50 bg-card',
                'transition-all duration-200 ease-out',
                'hover:border-primary/30 hover:bg-accent/5 hover:shadow-lg',
                'hover:-translate-y-1',
                'active:translate-y-0 active:shadow-md',
                className,
            )}
            style={style}
        >
            {/* Number badge */}
            <div
                className={cn(
                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                    'bg-gradient-to-br text-white shadow-md',
                    'transition-all duration-200 ease-out group-hover:scale-110 group-hover:shadow-lg',
                    gradient,
                )}
            >
                {displayIcon}
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
                <p className="text-base leading-relaxed font-medium text-foreground transition-colors duration-200 group-hover:text-primary sm:text-lg">
                    {title}
                </p>
            </div>
        </div>
    );
}

export default ObjectiveCard;
