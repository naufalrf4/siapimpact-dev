import { home } from '@/routes';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2Icon, HomeIcon, MailIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function Success() {
    return (
        <>
            <Head title="Pendaftaran Berhasil - SIAP Impact">
                <meta
                    name="description"
                    content="Terima kasih telah mendaftar di program SIAP Impact. Cek email Anda untuk informasi lebih lanjut mengenai proses rekrutmen."
                />
                <meta
                    property="og:title"
                    content="Pendaftaran Berhasil - SIAP Impact"
                />
                <meta
                    property="og:description"
                    content="Terima kasih telah mendaftar di program SIAP Impact. Cek email Anda untuk informasi lebih lanjut mengenai proses rekrutmen."
                />
                <meta property="og:type" content="website" />
                <meta
                    property="og:url"
                    content={
                        typeof window !== 'undefined'
                            ? window.location.href
                            : ''
                    }
                />
                <link
                    rel="canonical"
                    href={
                        typeof window !== 'undefined'
                            ? window.location.href
                            : ''
                    }
                />
            </Head>
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-secondary/20 to-background px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-lg">
                    <Card className="text-center">
                        <CardHeader className="pb-4">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <CheckCircle2Icon className="h-10 w-10 text-green-600" />
                            </div>
                            <CardTitle className="text-2xl">
                                Terima kasih!
                            </CardTitle>
                            <CardDescription className="text-base">
                                Pendaftaran Anda sudah kami terima.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <Button
                                    asChild
                                    size="lg"
                                    className="w-full sm:w-auto"
                                >
                                    <Link href={home()}>
                                        <HomeIcon className="h-4 w-4" />
                                        Kembali ke Beranda
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
