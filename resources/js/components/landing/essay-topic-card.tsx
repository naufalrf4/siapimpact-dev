import type { EssayTopic } from '@/lib/landing-data';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface EssayTopicCardProps {
    topic: EssayTopic;
    index?: number;
    onClick: () => void;
    className?: string;
    style?: React.CSSProperties;
}

export function EssayTopicCard({
    topic,
    index = 0,
    onClick,
    className,
    style,
}: EssayTopicCardProps) {
    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
            className={cn(
                'group relative cursor-pointer rounded-xl p-6',
                'border border-border/50 bg-card',
                'transition-all duration-200 ease-out',
                'hover:border-primary/40 hover:bg-accent/5 hover:shadow-xl',
                'hover:-translate-y-1',
                'focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none',
                'active:translate-y-0 active:scale-[0.98]',
                className,
            )}
            style={style}
        >
            {/* Topic number badge */}
            <div className="absolute -top-3 -left-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-md">
                {index + 1}
            </div>

            {/* Content */}
            <div className="pt-2">
                <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary sm:text-xl">
                        {topic.title}
                    </h3>
                    <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all duration-200 ease-out group-hover:translate-x-1 group-hover:text-primary" />
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {topic.description}
                </p>
            </div>
        </div>
    );
}

export default EssayTopicCard;
