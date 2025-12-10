import { cn } from '@/lib/utils';
import { home } from '@/routes';
import { type RouteDefinition } from '@/wayfinder';
import { Link } from '@inertiajs/react';

interface AppLogoIconOnlyProps {
    href?: string | RouteDefinition<'get'>;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

const sizeClasses: Record<NonNullable<AppLogoIconOnlyProps['size']>, string> = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12',
    '2xl': 'h-14 w-14',
    '3xl': 'h-16 w-16',
    '4xl': 'h-20 w-20',
};

export default function AppLogoIconOnly({
    href = home(),
    className,
    size = 'md',
}: AppLogoIconOnlyProps) {
    const logoContent = (
        <img
            src="/images/logo/sakina.png"
            alt="SIAP Impact Logo"
            className={cn(sizeClasses[size], 'object-contain', className)}
        />
    );

    if (href) {
        return (
            <Link href={href} prefetch className="inline-flex">
                {logoContent}
            </Link>
        );
    }

    return logoContent;
}
