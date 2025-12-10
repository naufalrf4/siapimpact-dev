import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { HomeIcon, ServerCrashIcon } from 'lucide-react';

interface ServerErrorProps {
    status?: number;
    message?: string;
}

export default function ServerError({
    status = 500,
    message = 'Terjadi kesalahan pada server.',
}: ServerErrorProps) {
    return (
        <>
            <Head title="Kesalahan Server - SIAP Impact">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=poppins:400,500,600,700&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-foreground">
                {/* Logo */}
                <div className="mb-8">
                    <img
                        src="/images/logo/sakina.png"
                        alt="Logo SAKINA"
                        className="h-12 w-auto"
                    />
                </div>

                {/* Error Icon */}
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
                    <ServerCrashIcon className="h-10 w-10 shrink-0 text-destructive" />
                </div>

                {/* Error Code */}
                <h1 className="mb-2 text-6xl font-bold text-destructive">
                    {status}
                </h1>

                {/* Error Title */}
                <h2 className="mb-4 text-xl font-semibold text-foreground">
                    Kesalahan Server
                </h2>

                {/* Error Message */}
                <p className="mb-8 max-w-md text-center text-muted-foreground">
                    {message} Tim kami sedang bekerja untuk memperbaiki masalah
                    ini. Silakan coba lagi dalam beberapa saat.
                </p>

                {/* CTA Button */}
                <Button asChild size="lg" className="gap-2">
                    <Link href="/">
                        <HomeIcon className="h-[18px] w-[18px] shrink-0" />
                        Kembali ke Beranda
                    </Link>
                </Button>

                {/* Footer */}
                <div className="mt-16 flex items-center gap-4">
                    <img
                        src="/images/logo/kemendukbangga.png"
                        alt="Logo Kemendukbangga"
                        className="h-8 w-auto opacity-60"
                    />
                    <img
                        src="/images/logo/sakina.png"
                        alt="Logo SAKINA"
                        className="h-8 w-auto opacity-60"
                    />
                </div>

                <p className="mt-4 text-xs text-muted-foreground">
                    © {new Date().getFullYear()} SIAP Impact - Kementerian
                    Pembangunan Keluarga dan Demografi
                </p>
            </div>
        </>
    );
}
