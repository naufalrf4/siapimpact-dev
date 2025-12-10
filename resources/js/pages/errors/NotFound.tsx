import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { HomeIcon, SearchXIcon } from 'lucide-react';

interface NotFoundProps {
    status?: number;
    message?: string;
}

export default function NotFound({
    status = 404,
    message = 'Halaman yang Anda cari tidak ditemukan.',
}: NotFoundProps) {
    return (
        <>
            <Head title="Halaman Tidak Ditemukan - SIAP Impact">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=poppins:400,500,600,700&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-foreground">
                {/* Error Icon */}
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                    <SearchXIcon className="h-10 w-10 shrink-0 text-muted-foreground" />
                </div>

                {/* Error Code */}
                <h1 className="mb-2 text-6xl font-bold text-primary">
                    {status}
                </h1>

                {/* Error Title */}
                <h2 className="mb-4 text-xl font-semibold text-foreground">
                    Halaman Tidak Ditemukan
                </h2>

                {/* Error Message */}
                <p className="mb-8 max-w-md text-center text-muted-foreground">
                    {message} Pastikan alamat URL yang Anda masukkan sudah benar
                    atau kembali ke halaman utama.
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
