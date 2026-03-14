import { store } from '@/actions/App/Http/Controllers/Public/RegistrationController';
import { Form, Head } from '@inertiajs/react';
import {
    AlertCircle,
    Download,
    FileTextIcon,
    ImageIcon,
    Save,
    UploadIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import AlertError from '@/components/alert-error';
import InputError from '@/components/input-error';
import { LandingNavbar } from '@/components/landing/landing-navbar';
import { TwibbonEditorModal } from '@/components/register/twibbon-editor-modal';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import {
    clearDraft,
    hasDraft,
    loadDraft,
    saveDraft,
} from '@/lib/draft-storage';
import { validateField } from '@/lib/form-validation';

interface FileState {
    recommendation_letter: File | null;
    twibbon_screenshot: File | null;
    essay_file: File | null;
}

interface FileError {
    recommendation_letter: string | null;
    twibbon_screenshot: string | null;
    essay_file: string | null;
}

const FILE_SIZE_LIMITS = {
    recommendation_letter: 10 * 1024 * 1024, // 10MB
    twibbon_screenshot: 5 * 1024 * 1024, // 5MB
    essay_file: 10 * 1024 * 1024, // 10MB
};

export default function Register() {
    const [formData, setFormData] = useState({
        full_name: '',
        national_id: '',
        birth_place: '',
        birth_date: '',
        phone: '',
        email: '',
        domicile: '',
        university: '',
        study_program: '',
        semester: '',
        gpa: '',
    });

    const [validationWarnings, setValidationWarnings] = useState<
        Record<string, string>
    >({});
    const [autoSaveStatus, setAutoSaveStatus] = useState<
        'idle' | 'saving' | 'saved'
    >('idle');
    const [draftLoaded, setDraftLoaded] = useState(false);
    const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null);
    const [isTwibbonModalOpen, setIsTwibbonModalOpen] = useState(false);

    const [files, setFiles] = useState<FileState>({
        recommendation_letter: null,
        twibbon_screenshot: null,
        essay_file: null,
    });

    const [fileErrors, setFileErrors] = useState<FileError>({
        recommendation_letter: null,
        twibbon_screenshot: null,
        essay_file: null,
    });

    // Load draft on component mount
    useEffect(() => {
        if (hasDraft()) {
            const draft = loadDraft();
            if (draft) {
                setFormData((prev) => ({
                    ...prev,
                    full_name: draft.full_name || '',
                    national_id: draft.national_id || '',
                    birth_place: draft.birth_place || '',
                    birth_date: draft.birth_date || '',
                    phone: draft.phone || '',
                    email: draft.email || '',
                    domicile: draft.domicile || '',
                    university: draft.university || '',
                    study_program: draft.study_program || '',
                    semester: draft.semester || '',
                    gpa: draft.gpa || '',
                }));
                toast.info('Draft sebelumnya berhasil dimuat', {
                    description:
                        'Data Anda telah dipulihkan dari penyimpanan lokal',
                });
            }
        }

        setDraftLoaded(true);
    }, []);

    // Auto-save draft every 10 seconds of idle time
    useEffect(() => {
        if (!draftLoaded) return;

        if (idleTimer) {
            clearTimeout(idleTimer);
        }

        const timer = setTimeout(() => {
            setAutoSaveStatus('saving');
            saveDraft(formData);
            setAutoSaveStatus('saved');

            setTimeout(() => {
                setAutoSaveStatus('idle');
            }, 2000);
        }, 10000);

        setIdleTimer(timer);

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [formData, draftLoaded]);

    const validateFileSize = (
        field: keyof FileState,
        file: File,
    ): string | null => {
        const limit = FILE_SIZE_LIMITS[field];
        if (file.size > limit) {
            const limitMB = limit / (1024 * 1024);
            return `Ukuran file melebihi batas maksimal ${limitMB}MB`;
        }
        return null;
    };

    const handleFileChange =
        (field: keyof FileState) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0] || null;
            let error: string | null = null;

            if (file) {
                error = validateFileSize(field, file);
            }

            setFiles((prev) => ({ ...prev, [field]: file }));
            setFileErrors((prev) => ({ ...prev, [field]: error }));
        };

    const getFileHint = (field: keyof FileState): string => {
        switch (field) {
            case 'recommendation_letter':
                return 'Format: PDF, Maks. 10MB';
            case 'twibbon_screenshot':
                return 'Format: JPG/PNG, Maks. 5MB';
            case 'essay_file':
                return 'Format: PDF, Maks. 10MB';
            default:
                return '';
        }
    };

    const updateFormField = (name: keyof typeof formData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        const error = validateField(name, value);

        setValidationWarnings((prev) => {
            const updated = { ...prev };
            if (error) {
                updated[name] =
                    `${error.type === 'error' ? '⚠️' : 'ℹ️'} ${error.message}`;
            } else {
                delete updated[name];
            }
            return updated;
        });
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;

        updateFormField(name as keyof typeof formData, value);
    };

    const handleSaveDraft = () => {
        setAutoSaveStatus('saving');
        saveDraft(formData);
        setAutoSaveStatus('saved');

        toast.success('Draft berhasil disimpan!', {
            description: 'Anda dapat melanjutkan pengisian formulir nanti',
        });

        setTimeout(() => {
            setAutoSaveStatus('idle');
        }, 2000);
    };

    const handleFormSuccess = () => {
        clearDraft();

        toast.success('Pendaftaran berhasil disubmit!', {
            description: 'Terima kasih telah mendaftar di program SIAP Impact',
        });
    };

    const handleCopyTwibbonCaption = async (caption: string) => {
        await navigator.clipboard.writeText(caption);
        toast.success('Caption berhasil disalin!', {
            description:
                'Tempel caption saat Anda mengunggah twibbon ke Instagram.',
        });
    };

    return (
        <>
            <Head title="Daftar SIAP Impact - Generasi Muda Unggul">
                <meta
                    name="description"
                    content="Daftar sekarang untuk program SIAP Impact dan bergabunglah dengan generasi muda unggul Indonesia. Isi formulir pendaftaran dengan data lengkap dan dokumen pendukung."
                />
                <meta
                    property="og:title"
                    content="Daftar SIAP Impact - Generasi Muda Unggul"
                />
                <meta
                    property="og:description"
                    content="Daftar sekarang untuk program SIAP Impact dan bergabunglah dengan generasi muda unggul Indonesia. Isi formulir pendaftaran dengan data lengkap dan dokumen pendukung."
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
            <div className="min-h-screen bg-gradient-to-b from-secondary/20 to-background">
                <LandingNavbar
                    currentPath="/register"
                    showRegisterButton={false}
                />

                <div className="px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl">
                        {/* Header */}
                        <div className="mb-10 text-center">
                            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                                Selangkah Menuju Generasi yang SIAP memberikan
                                IMPACT
                            </h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Silakan lengkapi formulir pendaftaran di bawah
                                ini ya. Pastikan seluruh data dan dokumen yang
                                Anda unggah sudah benar dan sesuai ketentuan.
                            </p>
                        </div>

                        {/* Form Instructions */}
                        <Card className="mb-8 border-primary/20 bg-primary/5">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg text-primary">
                                    Panduan Mengisi Formulir
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                <ul className="space-y-2">
                                    <li className="flex gap-3">
                                        <span className="font-semibold text-primary">
                                            •
                                        </span>
                                        <span>
                                            Isi seluruh kolom dengan data
                                            terbaru dan valid.
                                        </span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-semibold text-primary">
                                            •
                                        </span>
                                        <span>
                                            Semua field bertanda (*) wajib
                                            diisi.
                                        </span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-semibold text-primary">
                                            •
                                        </span>
                                        <span>
                                            Dokumen yang diunggah harus sesuai
                                            format yang telah ditentukan.
                                        </span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-semibold text-primary">
                                            •
                                        </span>
                                        <span>
                                            Anda dapat mengedit kembali isian
                                            sebelum menekan tombol Submit.
                                        </span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-semibold text-primary">
                                            •
                                        </span>
                                        <span>
                                            Pastikan setiap bagian terisi
                                            lengkap agar proses pendaftaran
                                            dapat diproses tanpa hambatan.
                                        </span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Registration Form */}
                        <Form
                            action={store.url()}
                            method="post"
                            encType="multipart/form-data"
                            className="space-y-6"
                            onSuccess={handleFormSuccess}
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* General Error Alert */}
                                    {errors.general && (
                                        <AlertError
                                            errors={[errors.general]}
                                            title="Pendaftaran Gagal"
                                        />
                                    )}

                                    {/* Identity Section */}
                                    <Card className="border-primary/10">
                                        <CardHeader className="pb-5">
                                            <CardTitle className="text-xl">
                                                Formulir Identitas Diri
                                            </CardTitle>
                                            <CardDescription className="text-base">
                                                Lengkapi data identitas diri
                                                Anda dengan benar
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-5">
                                            {/* Full Name */}
                                            <div className="grid gap-2">
                                                <Label htmlFor="full_name">
                                                    Nama Lengkap *
                                                </Label>
                                                <Input
                                                    id="full_name"
                                                    name="full_name"
                                                    type="text"
                                                    required
                                                    autoFocus
                                                    value={formData.full_name}
                                                    onChange={handleInputChange}
                                                    placeholder="Masukkan nama lengkap sesuai KTP"
                                                    aria-invalid={
                                                        !!errors.full_name ||
                                                        !!validationWarnings.full_name
                                                    }
                                                />
                                                {validationWarnings.full_name && (
                                                    <p className="flex items-center gap-1 text-xs text-amber-600">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {
                                                            validationWarnings.full_name
                                                        }
                                                    </p>
                                                )}
                                                <InputError
                                                    message={errors.full_name}
                                                />
                                            </div>

                                            {/* NIK */}
                                            <div className="grid gap-2">
                                                <Label htmlFor="national_id">
                                                    NIK *
                                                </Label>
                                                <Input
                                                    id="national_id"
                                                    name="national_id"
                                                    type="text"
                                                    required
                                                    maxLength={16}
                                                    value={formData.national_id}
                                                    onChange={handleInputChange}
                                                    placeholder="Masukkan 16 digit NIK"
                                                    aria-invalid={
                                                        !!errors.national_id ||
                                                        !!validationWarnings.national_id
                                                    }
                                                />
                                                {validationWarnings.national_id && (
                                                    <p className="flex items-center gap-1 text-xs text-amber-600">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {
                                                            validationWarnings.national_id
                                                        }
                                                    </p>
                                                )}
                                                <InputError
                                                    message={errors.national_id}
                                                />
                                            </div>

                                            {/* Birth Place & Date */}
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="birth_place">
                                                        Tempat Lahir *
                                                    </Label>
                                                    <Input
                                                        id="birth_place"
                                                        name="birth_place"
                                                        type="text"
                                                        required
                                                        value={
                                                            formData.birth_place
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        placeholder="Kota/Kabupaten"
                                                        aria-invalid={
                                                            !!errors.birth_place
                                                        }
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.birth_place
                                                        }
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="birth_date">
                                                        Tanggal Lahir *
                                                    </Label>
                                                    <Input
                                                        id="birth_date"
                                                        name="birth_date"
                                                        type="date"
                                                        required
                                                        value={
                                                            formData.birth_date
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        aria-invalid={
                                                            !!errors.birth_date
                                                        }
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.birth_date
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            {/* Phone */}
                                            <div className="grid gap-2">
                                                <Label htmlFor="phone">
                                                    Nomor Handphone *
                                                </Label>
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    type="tel"
                                                    required
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="08xxxxxxxxxx"
                                                    aria-invalid={
                                                        !!errors.phone ||
                                                        !!validationWarnings.phone
                                                    }
                                                />
                                                {validationWarnings.phone && (
                                                    <p className="flex items-center gap-1 text-xs text-amber-600">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {
                                                            validationWarnings.phone
                                                        }
                                                    </p>
                                                )}
                                                <InputError
                                                    message={errors.phone}
                                                />
                                            </div>

                                            {/* Email */}
                                            <div className="grid gap-2">
                                                <Label htmlFor="email">
                                                    Alamat Email *
                                                </Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="email@example.com"
                                                    aria-invalid={
                                                        !!errors.email ||
                                                        !!validationWarnings.email
                                                    }
                                                />
                                                {validationWarnings.email && (
                                                    <p className="flex items-center gap-1 text-xs text-amber-600">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {
                                                            validationWarnings.email
                                                        }
                                                    </p>
                                                )}
                                                <InputError
                                                    message={errors.email}
                                                />
                                            </div>

                                            {/* Domicile */}
                                            <div className="grid gap-2">
                                                <Label htmlFor="domicile">
                                                    Domisili *
                                                </Label>
                                                <Input
                                                    id="domicile"
                                                    name="domicile"
                                                    type="text"
                                                    required
                                                    value={formData.domicile}
                                                    onChange={handleInputChange}
                                                    placeholder="Kota/Kabupaten tempat tinggal saat ini"
                                                    aria-invalid={
                                                        !!errors.domicile
                                                    }
                                                />
                                                <InputError
                                                    message={errors.domicile}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Academic Section */}
                                    <Card className="border-primary/10">
                                        <CardHeader className="pb-5">
                                            <CardTitle className="text-xl">
                                                Data Akademik
                                            </CardTitle>
                                            <CardDescription className="text-base">
                                                Lengkapi informasi akademik Anda
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-5">
                                            {/* University */}
                                            <div className="grid gap-2">
                                                <Label htmlFor="university">
                                                    Asal Universitas *
                                                </Label>
                                                <Input
                                                    id="university"
                                                    name="university"
                                                    type="text"
                                                    required
                                                    value={formData.university}
                                                    onChange={handleInputChange}
                                                    placeholder="Nama universitas"
                                                    aria-invalid={
                                                        !!errors.university
                                                    }
                                                />
                                                <InputError
                                                    message={errors.university}
                                                />
                                            </div>

                                            {/* Study Program */}
                                            <div className="grid gap-2">
                                                <Label htmlFor="study_program">
                                                    Program Studi *
                                                </Label>
                                                <Input
                                                    id="study_program"
                                                    name="study_program"
                                                    type="text"
                                                    required
                                                    value={
                                                        formData.study_program
                                                    }
                                                    onChange={handleInputChange}
                                                    placeholder="Nama program studi"
                                                    aria-invalid={
                                                        !!errors.study_program
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors.study_program
                                                    }
                                                />
                                            </div>

                                            {/* Semester & GPA */}
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="semester">
                                                        Semester *
                                                    </Label>
                                                    <Select
                                                        name="semester"
                                                        required
                                                        value={
                                                            formData.semester
                                                        }
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            updateFormField(
                                                                'semester',
                                                                value,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            aria-invalid={
                                                                !!errors.semester
                                                            }
                                                        >
                                                            <SelectValue placeholder="Pilih semester" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Array.from(
                                                                { length: 14 },
                                                                (_, i) => i + 1,
                                                            ).map((sem) => (
                                                                <SelectItem
                                                                    key={sem}
                                                                    value={sem.toString()}
                                                                >
                                                                    Semester{' '}
                                                                    {sem}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            errors.semester
                                                        }
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="gpa">
                                                        IPK Terakhir *
                                                    </Label>
                                                    <Input
                                                        id="gpa"
                                                        name="gpa"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max="4"
                                                        required
                                                        value={formData.gpa}
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        placeholder="0.00 - 4.00"
                                                        aria-invalid={
                                                            !!errors.gpa ||
                                                            !!validationWarnings.gpa
                                                        }
                                                    />
                                                    {validationWarnings.gpa && (
                                                        <p className="flex items-center gap-1 text-xs text-amber-600">
                                                            <AlertCircle className="h-3 w-3" />
                                                            {
                                                                validationWarnings.gpa
                                                            }
                                                        </p>
                                                    )}
                                                    <InputError
                                                        message={errors.gpa}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Document Upload Section */}
                                    <Card className="border-primary/10">
                                        <CardHeader className="pb-5">
                                            <CardTitle className="text-xl">
                                                Unggah Dokumen Pendukung
                                            </CardTitle>
                                            <CardDescription className="text-base">
                                                Pastikan file jelas, terbaca,
                                                dan sesuai persyaratan
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-5">
                                            {/* Recommendation Letter */}
                                            <div className="grid gap-2">
                                                <Label htmlFor="recommendation_letter">
                                                    Surat Rekomendasi Dosen *
                                                </Label>
                                                <div className="flex justify-end">
                                                    <Button
                                                        asChild
                                                        type="button"
                                                        variant="outline"
                                                        className="ml-auto w-fit"
                                                    >
                                                        <a
                                                            href="/registrations/Format%20Surat%20Rekomendasi%20Dosen.docx"
                                                            download
                                                        >
                                                            <Download className="h-4 w-4" />
                                                            Download Format
                                                            Surat
                                                        </a>
                                                    </Button>
                                                </div>
                                                <div className="relative">
                                                    <Input
                                                        id="recommendation_letter"
                                                        name="recommendation_letter"
                                                        type="file"
                                                        accept=".pdf"
                                                        required
                                                        onChange={handleFileChange(
                                                            'recommendation_letter',
                                                        )}
                                                        className="file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-1 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
                                                        aria-invalid={
                                                            !!errors.recommendation_letter ||
                                                            !!fileErrors.recommendation_letter
                                                        }
                                                    />
                                                </div>
                                                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <FileTextIcon className="h-3 w-3" />
                                                    {getFileHint(
                                                        'recommendation_letter',
                                                    )}
                                                    {files.recommendation_letter &&
                                                        !fileErrors.recommendation_letter && (
                                                            <span className="ml-2 text-primary">
                                                                ✓{' '}
                                                                {
                                                                    files
                                                                        .recommendation_letter
                                                                        .name
                                                                }
                                                            </span>
                                                        )}
                                                </p>
                                                {fileErrors.recommendation_letter && (
                                                    <InputError
                                                        message={
                                                            fileErrors.recommendation_letter
                                                        }
                                                    />
                                                )}
                                                <InputError
                                                    message={
                                                        errors.recommendation_letter
                                                    }
                                                />
                                            </div>

                                            {/* Twibbon Helper */}
                                            <div className="flex justify-end">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        setIsTwibbonModalOpen(
                                                            true,
                                                        )
                                                    }
                                                    className="ml-auto w-fit"
                                                >
                                                    <ImageIcon className="h-4 w-4" />
                                                    Editor Twibbon
                                                </Button>
                                            </div>

                                            {/* Twibbon Screenshot */}
                                            <div className="grid gap-2">
                                                <Label htmlFor="twibbon_screenshot">
                                                    Screenshot Unggahan
                                                    Instagram Twibbon *
                                                </Label>
                                                <Input
                                                    id="twibbon_screenshot"
                                                    name="twibbon_screenshot"
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    required
                                                    onChange={handleFileChange(
                                                        'twibbon_screenshot',
                                                    )}
                                                    className="file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-1 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
                                                    aria-invalid={
                                                        !!errors.twibbon_screenshot ||
                                                        !!fileErrors.twibbon_screenshot
                                                    }
                                                />
                                                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <ImageIcon className="h-3 w-3" />
                                                    {getFileHint(
                                                        'twibbon_screenshot',
                                                    )}
                                                    {files.twibbon_screenshot &&
                                                        !fileErrors.twibbon_screenshot && (
                                                            <span className="ml-2 text-primary">
                                                                ✓{' '}
                                                                {
                                                                    files
                                                                        .twibbon_screenshot
                                                                        .name
                                                                }
                                                            </span>
                                                        )}
                                                </p>
                                                {fileErrors.twibbon_screenshot && (
                                                    <InputError
                                                        message={
                                                            fileErrors.twibbon_screenshot
                                                        }
                                                    />
                                                )}
                                                <InputError
                                                    message={
                                                        errors.twibbon_screenshot
                                                    }
                                                />
                                            </div>

                                            {/* Essay */}
                                            <div className="grid gap-2">
                                                <Label htmlFor="essay_file">
                                                    Essay *
                                                </Label>
                                                <Input
                                                    id="essay_file"
                                                    name="essay_file"
                                                    type="file"
                                                    accept=".pdf"
                                                    required
                                                    onChange={handleFileChange(
                                                        'essay_file',
                                                    )}
                                                    className="file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-1 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
                                                    aria-invalid={
                                                        !!errors.essay_file ||
                                                        !!fileErrors.essay_file
                                                    }
                                                />
                                                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <FileTextIcon className="h-3 w-3" />
                                                    {getFileHint('essay_file')}
                                                    {files.essay_file &&
                                                        !fileErrors.essay_file && (
                                                            <span className="ml-2 text-primary">
                                                                ✓{' '}
                                                                {
                                                                    files
                                                                        .essay_file
                                                                        .name
                                                                }
                                                            </span>
                                                        )}
                                                </p>
                                                {fileErrors.essay_file && (
                                                    <InputError
                                                        message={
                                                            fileErrors.essay_file
                                                        }
                                                    />
                                                )}
                                                <InputError
                                                    message={errors.essay_file}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Honeypot Field - Hidden from users, visible to bots */}
                                    <div className="hidden" aria-hidden="true">
                                        <Label htmlFor="website">Website</Label>
                                        <Input
                                            id="website"
                                            name="website"
                                            type="text"
                                            tabIndex={-1}
                                            autoComplete="off"
                                        />
                                    </div>

                                    {/* Auto-save Status Indicator */}
                                    {autoSaveStatus !== 'idle' && (
                                        <div className="flex items-center justify-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700">
                                            {autoSaveStatus === 'saving' && (
                                                <>
                                                    <Spinner className="h-4 w-4" />
                                                    Menyimpan draft...
                                                </>
                                            )}
                                            {autoSaveStatus === 'saved' && (
                                                <>
                                                    <span className="text-lg">
                                                        ✓
                                                    </span>
                                                    Draft tersimpan
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* Submit Buttons */}
                                    <div className="flex flex-col gap-3 pt-8 sm:flex-row sm:justify-center">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="lg"
                                            onClick={handleSaveDraft}
                                            className="order-2 sm:order-1"
                                        >
                                            <Save className="h-4 w-4" />
                                            Simpan sebagai Draft
                                        </Button>
                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="order-1 min-w-[200px] sm:order-2"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <>
                                                    <Spinner />
                                                    Memproses...
                                                </>
                                            ) : (
                                                <>
                                                    <UploadIcon className="h-4 w-4" />
                                                    Daftar Sekarang
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>

                        <TwibbonEditorModal
                            open={isTwibbonModalOpen}
                            onOpenChange={setIsTwibbonModalOpen}
                            onCopyCaption={handleCopyTwibbonCaption}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
