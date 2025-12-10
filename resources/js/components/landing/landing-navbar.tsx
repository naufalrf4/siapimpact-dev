import { Button } from '@/components/ui/button';
import { usePrefersReducedMotion } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { MenuIcon, XIcon } from 'lucide-react';
import { useCallback, useState } from 'react';

interface NavLink {
    label: string;
    href: string;
    isAnchor: boolean;
}

interface LandingNavbarProps {
    currentPath?: string;
    showRegisterButton?: boolean;
    className?: string;
}

const navLinks: NavLink[] = [
    { label: 'Tujuan', href: '#program-objectives', isAnchor: true },
    { label: 'Seleksi', href: '#selection-stages', isAnchor: true },
    { label: 'Topik', href: '#essay-topics', isAnchor: true },
    { label: 'Panduan', href: '#essay-guidelines', isAnchor: true },
];

export function LandingNavbar({
    currentPath = '/',
    showRegisterButton = true,
    className,
}: LandingNavbarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const prefersReducedMotion = usePrefersReducedMotion();
    const isHomePage = currentPath === '/';

    const handleAnchorClick = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
            const targetId = href.replace('#', '');
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();
                const navbarHeight = 80; // Approximate sticky header height
                const elementPosition =
                    targetElement.getBoundingClientRect().top;
                const offsetPosition =
                    elementPosition + window.scrollY - navbarHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth',
                });
                setIsMobileMenuOpen(false);
            } else if (!isHomePage) {
                // If not on home page and target doesn't exist, navigate to home with hash
                e.preventDefault();
                window.location.href = '/' + href;
            }
        },
        [prefersReducedMotion, isHomePage],
    );

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
    };

    return (
        <header
            className={cn(
                'sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
                className,
            )}
        >
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <img
                        src="/images/logo/sakina.png"
                        alt="Logo SAKINA"
                        className="h-8 w-auto"
                    />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-6 lg:flex">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={isHomePage ? link.href : '/' + link.href}
                            onClick={(e) =>
                                link.isAnchor && handleAnchorClick(e, link.href)
                            }
                            className="text-sm font-medium text-muted-foreground transition-all duration-200 ease-out hover:scale-105 hover:text-foreground"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Desktop CTA */}
                <div className="hidden items-center gap-4 lg:flex">
                    {!isHomePage && (
                        <Link
                            href="/"
                            className="text-sm font-medium text-muted-foreground transition-all duration-200 ease-out hover:scale-105 hover:text-foreground"
                        >
                            Beranda
                        </Link>
                    )}
                    {showRegisterButton && (
                        <Button asChild size="sm" className="px-6">
                            <Link href="/register">Daftar</Link>
                        </Button>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    type="button"
                    onClick={toggleMobileMenu}
                    className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-all duration-200 ease-out hover:scale-105 hover:bg-accent hover:text-foreground active:scale-95 lg:hidden"
                    aria-expanded={isMobileMenuOpen}
                    aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
                >
                    {isMobileMenuOpen ? (
                        <XIcon className="h-5 w-5 shrink-0" />
                    ) : (
                        <MenuIcon className="h-5 w-5 shrink-0" />
                    )}
                </button>
            </nav>

            {/* Mobile Menu */}
            <div
                className={cn(
                    'overflow-hidden border-t border-border/40 bg-background/95 backdrop-blur transition-all duration-200 lg:hidden',
                    isMobileMenuOpen
                        ? 'max-h-96 opacity-100'
                        : 'max-h-0 opacity-0',
                )}
            >
                <div className="space-y-1 px-4 py-4">
                    {!isHomePage && (
                        <Link
                            href="/"
                            className="block rounded-md px-3 py-2 text-base font-medium text-primary transition-colors hover:bg-accent"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Beranda
                        </Link>
                    )}
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={isHomePage ? link.href : '/' + link.href}
                            onClick={(e) => {
                                if (link.isAnchor) {
                                    handleAnchorClick(e, link.href);
                                } else {
                                    setIsMobileMenuOpen(false);
                                }
                            }}
                            className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        >
                            {link.label}
                        </a>
                    ))}
                    {showRegisterButton && (
                        <div className="pt-4">
                            <Button asChild className="w-full">
                                <Link
                                    href="/register"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Daftar
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default LandingNavbar;
