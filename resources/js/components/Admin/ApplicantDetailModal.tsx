import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
    AlertCircle,
    ArrowLeft,
    BookOpen,
    Building2,
    Calendar,
    CheckCircle2,
    Download,
    Eye,
    FileText,
    Globe,
    GraduationCap,
    Hash,
    Image,
    Mail,
    MapPin,
    Phone,
    RefreshCw,
    User,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface ApplicantDetail {
    id: number;
    full_name: string;
    national_id: string;
    birth_place: string;
    birth_date: string;
    phone: string;
    email: string;
    domicile: string;
    university: string;
    study_program: string;
    semester: number;
    gpa: number;
    has_recommendation_letter: boolean;
    has_instagram_follow_proof: boolean;
    has_twibbon_screenshot: boolean;
    has_essay_file: boolean;
    created_at: string;
    ip_address: string | null;
}

interface ApplicantDetailModalProps {
    applicantId: number | null;
    open: boolean;
    onClose: () => void;
}

type PreviewType =
    | 'recommendation_letter'
    | 'twibbon_image'
    | 'twibbon_screenshot'
    | 'essay'
    | null;

export function ApplicantDetailModal({
    applicantId,
    open,
    onClose,
}: ApplicantDetailModalProps) {
    const [applicant, setApplicant] = useState<ApplicantDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewMode, setPreviewMode] = useState<PreviewType>(null);
    const [previewError, setPreviewError] = useState<string | null>(null);
    const [imageLoading, setImageLoading] = useState(false);

    useEffect(() => {
        if (open && applicantId) {
            fetchApplicant(applicantId);
            setPreviewMode(null);
            setPreviewError(null);
        } else {
            setApplicant(null);
            setError(null);
            setPreviewMode(null);
            setPreviewError(null);
        }
    }, [open, applicantId]);

    useEffect(() => {
        if (previewMode) {
            setPreviewError(null);
            setImageLoading(true);
        }
    }, [previewMode]);

    const fetchApplicant = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/admin/applicants/${id}`, {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            if (!response.ok) {
                throw new Error('Gagal memuat data pendaftar');
            }
            const data = await response.json();
            setApplicant(data.applicant);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (type: string) => {
        if (applicantId) {
            window.location.href = `/admin/applicants/${applicantId}/download/${type}`;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    // Count current required documents for new registrations.
    const getDocumentCount = () => {
        if (!applicant) return { available: 0, total: 4 };

        const available = [
            applicant.has_recommendation_letter,
            applicant.has_instagram_follow_proof,
            applicant.has_twibbon_screenshot,
            applicant.has_essay_file,
        ].filter(Boolean).length;

        return { available, total: 4 };
    };

    const getFileLabel = (type: PreviewType): string => {
        const labels = {
            recommendation_letter: 'Surat Rekomendasi',
            twibbon_image: 'Bukti Follow Instagram',
            twibbon_screenshot: 'Screenshot Twibbon',
            essay: 'Essay',
        };
        return type ? labels[type] : '';
    };

    const isImageType = (type: PreviewType): boolean => {
        return type === 'twibbon_image' || type === 'twibbon_screenshot';
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent
                className={cn(
                    'max-h-[90vh] !max-w-6xl overflow-y-auto',
                    'sm:!max-w-6xl',
                    'data-[state=closed]:animate-out data-[state=open]:animate-in',
                    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                    'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                    'duration-200',
                )}
            >
                <DialogHeader className="space-y-3 border-b pb-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            {previewMode && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setPreviewMode(null)}
                                    className="shrink-0"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            )}
                            <div className="space-y-1.5">
                                <DialogTitle className="text-xl font-semibold tracking-tight">
                                    {previewMode
                                        ? getFileLabel(previewMode)
                                        : 'Detail Pendaftar'}
                                </DialogTitle>
                                <DialogDescription className="text-sm text-muted-foreground">
                                    {previewMode
                                        ? 'Preview dan unduh dokumen'
                                        : 'Informasi lengkap pendaftar SIAP Impact'}
                                </DialogDescription>
                            </div>
                        </div>
                        {applicant && !previewMode && (
                            <Badge
                                variant="outline"
                                className="shrink-0 font-mono text-xs"
                            >
                                ID: {applicant.id}
                            </Badge>
                        )}
                    </div>
                </DialogHeader>

                {loading && <LoadingSkeleton />}

                {error && (
                    <ErrorState
                        error={error}
                        onRetry={() =>
                            applicantId && fetchApplicant(applicantId)
                        }
                    />
                )}

                {previewMode && applicant && (
                    <div className="space-y-4 pt-2">
                        {/* Preview Container */}
                        <Card className="border-2">
                            <CardContent className="p-6">
                                {previewError ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                                            <AlertCircle className="h-8 w-8 text-destructive" />
                                        </div>
                                        <h3 className="mb-2 text-lg font-semibold">
                                            File Tidak Ditemukan
                                        </h3>
                                        <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
                                            {previewError}
                                        </p>
                                        <Button
                                            variant="outline"
                                            onClick={() => setPreviewMode(null)}
                                        >
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Kembali ke Detail
                                        </Button>
                                    </div>
                                ) : isImageType(previewMode) ? (
                                    <div className="flex flex-col items-center justify-center">
                                        {imageLoading && (
                                            <div className="flex flex-col items-center py-12">
                                                <RefreshCw className="mb-4 h-8 w-8 animate-spin text-primary" />
                                                <p className="text-sm text-muted-foreground">
                                                    Memuat gambar...
                                                </p>
                                            </div>
                                        )}
                                        <img
                                            src={`/admin/applicants/${applicantId}/download/${previewMode}`}
                                            alt={getFileLabel(previewMode)}
                                            className={cn(
                                                'max-h-[60vh] w-auto rounded-lg border object-contain shadow-lg transition-opacity',
                                                imageLoading
                                                    ? 'h-0 opacity-0'
                                                    : 'opacity-100',
                                            )}
                                            onLoad={() =>
                                                setImageLoading(false)
                                            }
                                            onError={(e) => {
                                                setImageLoading(false);
                                                setPreviewError(
                                                    'Gagal memuat file. File mungkin tidak tersedia atau rusak.',
                                                );
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                                            <FileText className="h-10 w-10 text-primary" />
                                        </div>
                                        <h3 className="mb-2 text-lg font-semibold">
                                            Dokumen PDF
                                        </h3>
                                        <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
                                            Preview PDF tidak tersedia. Silakan
                                            unduh dokumen untuk melihat isinya.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        {!previewError && (
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setPreviewMode(null)}
                                    className="flex-1"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Kembali
                                </Button>
                                <Button
                                    onClick={() => handleDownload(previewMode)}
                                    className="flex-1"
                                    disabled={imageLoading}
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Unduh Dokumen
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {applicant && !loading && !error && !previewMode && (
                    <div className="space-y-6 pt-2">
                        {/* Identity Section */}
                        <Section
                            icon={<User className="h-4 w-4" />}
                            title="Informasi Identitas"
                            description="Data pribadi pendaftar"
                        >
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <InfoItem
                                    icon={
                                        <User className="h-4 w-4 text-primary" />
                                    }
                                    label="Nama Lengkap"
                                    value={applicant.full_name}
                                    highlight
                                />
                                <InfoItem
                                    icon={
                                        <Hash className="h-4 w-4 text-muted-foreground" />
                                    }
                                    label="NIK"
                                    value={applicant.national_id}
                                    mono
                                />
                                <InfoItem
                                    icon={
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                    }
                                    label="Tempat Lahir"
                                    value={applicant.birth_place}
                                />
                                <InfoItem
                                    icon={
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                    }
                                    label="Tanggal Lahir"
                                    value={formatDate(applicant.birth_date)}
                                />
                            </div>
                        </Section>

                        {/* Contact Section */}
                        <Section
                            icon={<Phone className="h-4 w-4" />}
                            title="Informasi Kontak"
                            description="Alamat dan kontak pendaftar"
                        >
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <InfoItem
                                    icon={
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                    }
                                    label="Nomor Telepon"
                                    value={applicant.phone}
                                />
                                <InfoItem
                                    icon={
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                    }
                                    label="Email"
                                    value={applicant.email}
                                />
                                <InfoItem
                                    icon={
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                    }
                                    label="Domisili"
                                    value={applicant.domicile}
                                    className="sm:col-span-2"
                                />
                            </div>
                        </Section>

                        {/* Academic Section */}
                        <Section
                            icon={<GraduationCap className="h-4 w-4" />}
                            title="Informasi Akademik"
                            description="Data pendidikan pendaftar"
                        >
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <InfoItem
                                    icon={
                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                    }
                                    label="Universitas"
                                    value={applicant.university}
                                    className="sm:col-span-2"
                                />
                                <InfoItem
                                    icon={
                                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                                    }
                                    label="Program Studi"
                                    value={applicant.study_program}
                                    className="sm:col-span-2"
                                />
                                <InfoItem
                                    icon={
                                        <Hash className="h-4 w-4 text-muted-foreground" />
                                    }
                                    label="Semester"
                                    value={`Semester ${applicant.semester}`}
                                />
                                <InfoItem
                                    icon={
                                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                    }
                                    label="IPK"
                                    value={Number(applicant.gpa).toFixed(2)}
                                    highlight
                                />
                            </div>
                        </Section>

                        {/* Documents Section */}
                        <Section
                            icon={<FileText className="h-4 w-4" />}
                            title="Dokumen Pendukung"
                            description={`${getDocumentCount().available} dari ${getDocumentCount().total} dokumen wajib tersedia`}
                        >
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <DocumentButton
                                    label="Surat Rekomendasi"
                                    description="PDF dokumen rekomendasi"
                                    icon={<FileText className="h-5 w-5" />}
                                    available={
                                        applicant.has_recommendation_letter
                                    }
                                    onPreview={() =>
                                        setPreviewMode('recommendation_letter')
                                    }
                                    onDownload={() =>
                                        handleDownload('recommendation_letter')
                                    }
                                />
                                <DocumentButton
                                    label="Bukti Follow Instagram"
                                    description="Bukti follow @sakina.kemendukbangga"
                                    icon={<Image className="h-5 w-5" />}
                                    available={
                                        applicant.has_instagram_follow_proof
                                    }
                                    onPreview={() =>
                                        setPreviewMode('twibbon_image')
                                    }
                                    onDownload={() =>
                                        handleDownload('twibbon_image')
                                    }
                                />
                                <DocumentButton
                                    label="Screenshot Twibbon"
                                    description="Bukti posting twibbon"
                                    icon={<Image className="h-5 w-5" />}
                                    available={applicant.has_twibbon_screenshot}
                                    onPreview={() =>
                                        setPreviewMode('twibbon_screenshot')
                                    }
                                    onDownload={() =>
                                        handleDownload('twibbon_screenshot')
                                    }
                                />
                                <DocumentButton
                                    label="Essay"
                                    description="PDF essay pendaftar"
                                    icon={<FileText className="h-5 w-5" />}
                                    available={applicant.has_essay_file}
                                    onPreview={() => setPreviewMode('essay')}
                                    onDownload={() => handleDownload('essay')}
                                />
                            </div>
                        </Section>

                        {/* Metadata Section */}
                        <Section
                            icon={<Globe className="h-4 w-4" />}
                            title="Metadata Pendaftaran"
                            description="Informasi teknis pendaftaran"
                            muted
                        >
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <InfoItem
                                    icon={
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                    }
                                    label="Waktu Pendaftaran"
                                    value={formatDateTime(applicant.created_at)}
                                />
                                <InfoItem
                                    icon={
                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                    }
                                    label="Alamat IP"
                                    value={
                                        applicant.ip_address || 'Tidak tercatat'
                                    }
                                    mono
                                />
                            </div>
                        </Section>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

// Section component with icon header
function Section({
    icon,
    title,
    description,
    children,
    muted = false,
}: {
    icon: React.ReactNode;
    title: string;
    description?: string;
    children: React.ReactNode;
    muted?: boolean;
}) {
    return (
        <Card
            className={cn(
                'border shadow-sm transition-colors',
                muted && 'bg-muted/30',
            )}
        >
            <CardContent className="p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-3">
                    <div
                        className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-lg',
                            muted
                                ? 'bg-muted text-muted-foreground'
                                : 'bg-primary/10 text-primary',
                        )}
                    >
                        {icon}
                    </div>
                    <div className="space-y-0.5">
                        <h3 className="text-sm font-semibold tracking-tight">
                            {title}
                        </h3>
                        {description && (
                            <p className="text-xs text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
                {children}
            </CardContent>
        </Card>
    );
}

// Info item with improved styling
function InfoItem({
    icon,
    label,
    value,
    className = '',
    highlight = false,
    mono = false,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    className?: string;
    highlight?: boolean;
    mono?: boolean;
}) {
    return (
        <div className={cn('space-y-1.5', className)}>
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                {icon}
                <span>{label}</span>
            </div>
            <p
                className={cn(
                    'text-sm leading-relaxed',
                    highlight && 'font-semibold text-foreground',
                    mono && 'font-mono text-xs',
                    !highlight && !mono && 'font-medium',
                )}
            >
                {value}
            </p>
        </div>
    );
}

// Document button with preview and download actions
function DocumentButton({
    label,
    description,
    icon,
    available,
    onPreview,
    onDownload,
}: {
    label: string;
    description: string;
    icon: React.ReactNode;
    available: boolean;
    onPreview: () => void;
    onDownload: () => void;
}) {
    if (!available) {
        return (
            <div
                className={cn(
                    'flex h-auto items-center gap-3 rounded-lg border bg-muted/30 p-4 opacity-50',
                )}
            >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    {icon}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-muted-foreground">
                            {label}
                        </span>
                        <XCircle className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    </div>
                    <span className="block truncate text-xs text-muted-foreground">
                        {description}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <Card className="group overflow-hidden transition-all duration-200 hover:border-primary/30 hover:shadow-sm">
            <CardContent className="p-0">
                <div className="flex items-center gap-3 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                        {icon}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-medium">
                                {label}
                            </span>
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-600" />
                        </div>
                        <span className="block truncate text-xs text-muted-foreground">
                            {description}
                        </span>
                    </div>
                </div>
                <div className="flex border-t">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onPreview}
                        className="flex-1 rounded-none hover:bg-primary/5"
                    >
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        <span className="text-xs">Preview</span>
                    </Button>
                    <div className="w-px bg-border" />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDownload}
                        className="flex-1 rounded-none hover:bg-primary/5"
                    >
                        <Download className="mr-1.5 h-3.5 w-3.5" />
                        <span className="text-xs">Unduh</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// Error state component
function ErrorState({
    error,
    onRetry,
}: {
    error: string;
    onRetry: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="mb-1 text-sm font-semibold">Gagal Memuat Data</h3>
            <p className="mb-4 max-w-xs text-sm text-muted-foreground">
                {error}
            </p>
            <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="gap-2"
            >
                <RefreshCw className="h-4 w-4" />
                Coba Lagi
            </Button>
        </div>
    );
}

// Loading skeleton with improved animation
function LoadingSkeleton() {
    return (
        <div className="animate-in space-y-6 pt-2 duration-300 fade-in-50">
            {/* Identity Section Skeleton */}
            <Card className="border shadow-sm">
                <CardContent className="p-4 sm:p-5">
                    <div className="mb-4 flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <div className="space-y-1.5">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="space-y-1.5">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-5 w-full" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Contact Section Skeleton */}
            <Card className="border shadow-sm">
                <CardContent className="p-4 sm:p-5">
                    <div className="mb-4 flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <div className="space-y-1.5">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    'space-y-1.5',
                                    i === 2 && 'col-span-2',
                                )}
                            >
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-5 w-full" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Academic Section Skeleton */}
            <Card className="border shadow-sm">
                <CardContent className="p-4 sm:p-5">
                    <div className="mb-4 flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <div className="space-y-1.5">
                            <Skeleton className="h-4 w-36" />
                            <Skeleton className="h-3 w-28" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    'space-y-1.5',
                                    i < 2 && 'col-span-2',
                                )}
                            >
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-5 w-full" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Documents Section Skeleton */}
            <Card className="border shadow-sm">
                <CardContent className="p-4 sm:p-5">
                    <div className="mb-4 flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <div className="space-y-1.5">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-40" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton
                                key={i}
                                className="h-[72px] w-full rounded-md"
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
