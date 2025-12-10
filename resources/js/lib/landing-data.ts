/**
 * Static content data for the SIAP Impact / SAKINA landing page
 * This file contains all text content, configuration, and data structures
 * used across the landing page sections.
 */

// ============================================================================
// Type Definitions
// ============================================================================

export interface EssayTopic {
    id: string;
    title: string;
    description: string;
}

export interface EssayStructureItem {
    id: number;
    title: string;
    description: string;
}

export interface ProgramObjective {
    id: string;
    title: string;
}

export interface SelectionStage {
    id: number;
    title: string;
    description?: string;
    output?: string;
}

// ============================================================================
// Hero Section Content
// ============================================================================

export const heroContent = {
    headline:
        'SIAP ber-IMPACT menjadi talenta unggul menghadapi bonus demografi?',
    subheadline:
        'Kemendukbangga melalui Superapps Keluarga Indonesia – SAKINA menghadirkan program SIAP Impact, sebuah gerakan nasional untuk memperkuat kualitas generasi muda Indonesia.',
    tagline: "Youth Innovation for Indonesia's Future",
    primaryCta: {
        text: 'Daftarkan Diri Kalian Sekarang!',
        href: '/register',
    },
    secondaryCta: {
        text: 'Panduan Esai',
        targetId: 'essay-guidelines',
    },
};

// ============================================================================
// Program Objectives Section Content
// ============================================================================

export const programObjectivesHeading =
    'Kami bertujuan membentuk generasi muda yang memiliki:';

export const programObjectives: ProgramObjective[] = [
    { id: 'social', title: 'Social empathy & responsibility' },
    { id: 'family', title: 'Family resilience literacy' },
    { id: 'digital', title: 'Digital citizenship & innovation mindset' },
    {
        id: 'leadership',
        title: "Collaborative leadership for Indonesia's human development",
    },
];

// ============================================================================
// Selection Stages Section Content
// ============================================================================

export const selectionStagesHeading = 'Tahapan Seleksi';

export const selectionStages: SelectionStage[] = [
    {
        id: 1,
        title: 'Pendaftaran',
        description:
            'Daftarkan diri Anda dengan melengkapi formulir dan mengunggah dokumen yang diperlukan.',
        output: 'Konfirmasi pendaftaran dikirim ke email Anda',
    },
    {
        id: 2,
        title: 'Seleksi Administrasi',
        description:
            'Tim kami memeriksa kelengkapan dokumen dan kesesuaian dengan kriteria program.',
        output: 'Pengumuman peserta yang lolos ke tahap berikutnya',
    },
    {
        id: 3,
        title: 'Seleksi Esai / Tahapan Lanjutan',
        description:
            'Evaluasi mendalam terhadap esai, rekomendasi, dan potensi kepemimpinan Anda.',
        output: 'Daftar peserta yang diterima di program SIAP Impact',
    },
    {
        id: 4,
        title: 'Pengumuman',
        description:
            'Pengumuman resmi peserta yang diterima dan informasi orientasi program.',
        output: 'Undangan mengikuti program SIAP Impact 2026',
    },
];

// ============================================================================
// Essay Topics Section Content
// ============================================================================

export const essayTopicsHeading = 'Topik Esai';

export const essayTopics: EssayTopic[] = [
    {
        id: 'digital-humanity',
        title: 'Digital for Humanity',
        description:
            'Inovasi digital untuk meningkatkan kualitas hidup masyarakat dan memperkuat hubungan antar generasi.',
    },
    {
        id: 'youth-families',
        title: 'Youth for Strong Families',
        description:
            'Gagasan, peran, dan aksi inovatif generasi muda dalam memperkuat ketahanan, keharmonisan, dan kemandirian keluarga muda.',
    },
    {
        id: 'generation-gap',
        title: 'Bridging the Generation Gap',
        description:
            'Solusi inovatif untuk memperkuat komunikasi, kolaborasi, dan semangat kebersamaan lintas generasi.',
    },
    {
        id: 'human-development',
        title: 'Human Development for the Future',
        description:
            'Ide inovatif untuk meningkatkan kualitas penduduk muda, mencakup karakter, mentalitas, empati sosial, dan kesiapan menghadapi perubahan global.',
    },
    {
        id: 'population-action',
        title: 'From Awareness to Population Action',
        description:
            'Gerakan konkret anak muda untuk meningkatkan kesadaran dan partisipasi masyarakat dalam isu-isu kependudukan.',
    },
];

// ============================================================================
// Essay Guidelines Section Content
// ============================================================================

export const essayGuidelinesHeading = 'Panduan Esai';

export const essayGuidelines = {
    technical: {
        wordCount: '700–1.000 kata (2–3 halaman)',
        format: 'A4, Calibri 12, spasi 1,5',
        language: 'Bahasa Indonesia yang komunikatif dan inspiratif',
        fileNaming: 'NamaLengkap_AsalUniversitas_JudulEsai_SIAPImpact2026.pdf',
    },
    structure: [
        {
            id: 1,
            title: 'Judul Gagasan',
            description: 'maks. 15 kata, komunikatif',
        },
        {
            id: 2,
            title: 'Latar Belakang Isu Kependudukan',
            description:
                'Menjelaskan fenomena kependudukan yang relevan dengan bonus demografi.',
        },
        {
            id: 3,
            title: 'Ide atau Solusi Inovatif',
            description:
                'Menjelaskan langkah atau pendekatan yang dapat dilakukan generasi muda.',
        },
        {
            id: 4,
            title: 'Dampak & Relevansi Sosial',
            description:
                'Menjelaskan manfaat bagi keluarga, masyarakat, atau bangsa.',
        },
        {
            id: 5,
            title: 'Aksi atau Rencana Implementasi',
            description:
                'Menjelaskan langkah konkret yang bisa dimulai dari diri sendiri, kampus, atau komunitas.',
        },
    ] as EssayStructureItem[],
};

// ============================================================================
// Final CTA Section Content
// ============================================================================

export const finalCtaContent = {
    heading: 'Daftarkan Diri Kalian Sekarang!',
    motivationalCopy:
        'Jadilah bagian dari gerakan nasional untuk memperkuat kualitas generasi muda Indonesia. Tunjukkan ide inovatifmu dan berkontribusi untuk masa depan bangsa.',
    ctaButton: {
        text: 'Daftar Sekarang',
        href: '/register',
    },
};
