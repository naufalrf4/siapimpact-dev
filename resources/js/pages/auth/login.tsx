import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/login';
import { Form, Head } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface LoginProps {
    status?: string;
}

export default function Login({ status }: LoginProps) {
    useEffect(() => {
        if (status) {
            toast.success('Login berhasil!', {
                description: 'Anda telah berhasil masuk ke panel admin',
            });
        }
    }, [status]);

    return (
        <AuthLayout
            title="Masuk ke Panel Admin"
            description="Gunakan akun admin resmi untuk masuk ke panel pengelolaan SIAP Impact."
        >
            <Head title="Admin Login - SIAP Impact">
                <meta
                    name="description"
                    content="Masuk ke panel administratif SIAP Impact untuk mengelola pendaftar dan program."
                />
                <meta property="og:title" content="Admin Login - SIAP Impact" />
                <meta
                    property="og:description"
                    content="Masuk ke panel administratif SIAP Impact untuk mengelola pendaftar dan program."
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

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email admin</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="Masukkan email admin"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">
                                    Kata sandi admin
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Masukkan kata sandi admin"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember">
                                    Ingat saya di perangkat ini
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Masuk sebagai admin
                            </Button>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
