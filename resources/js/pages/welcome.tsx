import { Head } from '@inertiajs/react';

import { EssayGuidelinesSection } from '@/components/landing/essay-guidelines-section';
import { EssayTopicsSection } from '@/components/landing/essay-topics-section';
import { FinalCTASection } from '@/components/landing/final-cta-section';
import { HeroSection } from '@/components/landing/hero-section';
import { LandingNavbar } from '@/components/landing/landing-navbar';
import { ProgramObjectivesSection } from '@/components/landing/program-objectives-section';
import { SelectionStagesSection } from '@/components/landing/selection-stages-section';

export default function Welcome({
    canRegister = false,
}: {
    canRegister?: boolean;
}) {
    return (
        <>
            <Head title="SIAP Impact - Program Pengembangan Talenta Muda Indonesia">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,600,700&display=swap"
                    rel="stylesheet"
                />
                <meta
                    name="description"
                    content="SIAP Impact adalah program gerakan nasional Kementerian Pembangunan Keluarga dan Demografi melalui SAKINA untuk memperkuat kualitas generasi muda Indonesia melalui inovasi dan pengembangan talenta."
                />
                <meta
                    property="og:title"
                    content="SIAP Impact - Program Pengembangan Talenta Muda Indonesia"
                />
                <meta
                    property="og:description"
                    content="SIAP Impact adalah program gerakan nasional Kementerian Pembangunan Keluarga dan Demografi melalui SAKINA untuk memperkuat kualitas generasi muda Indonesia melalui inovasi dan pengembangan talenta."
                />
                <meta property="og:image" content="/images/logo/sakina.png" />
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

            <div className="min-h-screen scroll-smooth bg-background text-foreground">
                <LandingNavbar
                    currentPath="/"
                    showRegisterButton={canRegister}
                />

                <main>
                    <HeroSection />
                    <ProgramObjectivesSection id="program-objectives" />
                    <SelectionStagesSection id="selection-stages" />
                    <EssayTopicsSection id="essay-topics" />
                    <EssayGuidelinesSection id="essay-guidelines" />
                    <FinalCTASection />
                </main>

                <footer className="border-t border-border bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                            <div className="flex items-center gap-4">
                                <img
                                    src="/images/logo/kemendukbangga.png"
                                    alt="Logo Kemendukbangga"
                                    className="h-10 w-auto"
                                />
                                <img
                                    src="/images/logo/sakina.png"
                                    alt="Logo SAKINA"
                                    className="h-10 w-auto"
                                />
                            </div>
                            <p className="text-center text-sm text-muted-foreground">
                                © {new Date().getFullYear()} SIAP Impact -
                                Kementerian Pembangunan Keluarga dan Demografi
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
