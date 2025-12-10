import { ApplicantDetailModal } from '@/components/Admin/ApplicantDetailModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { Head, router } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Download,
    Search,
    X,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface Applicant {
    id: number;
    full_name: string;
    email: string;
    university: string;
    domicile: string;
    semester: number;
    gpa: number;
    created_at: string;
}

interface PaginatedApplicants {
    data: Applicant[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface Filters {
    search: string | null;
    university: string | null;
    domicile: string | null;
    sort_by: string;
    sort_direction: string;
}

interface ApplicantsIndexProps {
    applicants: PaginatedApplicants;
    filters: Filters;
    universities: string[];
    domiciles: string[];
}

/**
 * Admin Applicants List Page
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 9.1
 */
export default function ApplicantsIndex({
    applicants,
    filters,
    universities,
    domiciles,
}: ApplicantsIndexProps) {
    const breadcrumbs = [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Pendaftar', href: '/admin/applicants' },
    ];

    const [searchValue, setSearchValue] = useState(filters.search || '');
    const [selectedApplicantId, setSelectedApplicantId] = useState<
        number | null
    >(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const updateFilters = useCallback(
        (newFilters: Partial<Filters>) => {
            router.get(
                '/admin/applicants',
                {
                    ...filters,
                    ...newFilters,
                    page: newFilters.search !== undefined ? 1 : undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        },
        [filters],
    );

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchValue !== (filters.search || '')) {
                updateFilters({ search: searchValue || null });
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchValue, updateFilters, filters.search]);

    const handleSort = (column: string) => {
        const newDirection =
            filters.sort_by === column && filters.sort_direction === 'asc'
                ? 'desc'
                : 'asc';
        updateFilters({ sort_by: column, sort_direction: newDirection });
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/admin/applicants',
            { ...filters, page },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleRowClick = (applicantId: number) => {
        setSelectedApplicantId(applicantId);
        setIsModalOpen(true);
    };

    const handleExport = (format: 'csv' | 'xlsx') => {
        const params = new URLSearchParams();
        params.append('format', format);
        if (filters.search) params.append('search', filters.search);
        if (filters.university) params.append('university', filters.university);
        if (filters.domicile) params.append('domicile', filters.domicile);
        window.location.href = `/admin/applicants/export?${params.toString()}`;
    };

    const clearFilters = () => {
        setSearchValue('');
        router.get('/admin/applicants', {}, { preserveState: true });
    };

    const hasActiveFilters =
        filters.search || filters.university || filters.domicile;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    const getSortIcon = (column: string) => {
        if (filters.sort_by !== column) {
            return (
                <ArrowUpDown className="ml-1 h-4 w-4 text-muted-foreground" />
            );
        }
        return filters.sort_direction === 'asc' ? (
            <ArrowUp className="ml-1 h-4 w-4" />
        ) : (
            <ArrowDown className="ml-1 h-4 w-4" />
        );
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Pendaftar - SIAP Impact Admin">
                <meta
                    name="description"
                    content="Kelola daftar pendaftar program SIAP Impact, lihat detail aplikasi, dan unduh dokumen pendukung."
                />
                <meta
                    property="og:title"
                    content="Daftar Pendaftar - SIAP Impact Admin"
                />
                <meta
                    property="og:description"
                    content="Kelola daftar pendaftar program SIAP Impact, lihat detail aplikasi, dan unduh dokumen pendukung."
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

            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Daftar Pendaftar
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola dan tinjau semua pendaftar program SIAP Impact
                    </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
                    <Button
                        variant="outline"
                        onClick={() => handleExport('csv')}
                        className="w-full sm:w-auto"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Unduh CSV
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => handleExport('xlsx')}
                        className="w-full sm:w-auto"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Unduh Excel
                    </Button>
                </div>

                {/* Filters Section */}
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1 md:max-w-sm">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari nama, email, universitas..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="h-10 pl-9"
                        />
                    </div>

                    {/* Universitas Filter */}
                    <Select
                        value={filters.university || 'all'}
                        onValueChange={(value) =>
                            updateFilters({
                                university: value === 'all' ? null : value,
                            })
                        }
                    >
                        <SelectTrigger className="h-10 w-full md:w-[200px]">
                            <SelectValue placeholder="Semua Universitas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Semua Universitas
                            </SelectItem>
                            {universities.map((uni) => (
                                <SelectItem key={uni} value={uni}>
                                    {uni}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Domisili Filter */}
                    <Select
                        value={filters.domicile || 'all'}
                        onValueChange={(value) =>
                            updateFilters({
                                domicile: value === 'all' ? null : value,
                            })
                        }
                    >
                        <SelectTrigger className="h-10 w-full md:w-[200px]">
                            <SelectValue placeholder="Semua Domisili" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Domisili</SelectItem>
                            {domiciles.map((dom) => (
                                <SelectItem key={dom} value={dom}>
                                    {dom}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearFilters}
                            className="h-10 w-full md:w-auto"
                        >
                            <X className="mr-1 h-4 w-4" />
                            Hapus Filter
                        </Button>
                    )}
                </div>

                {/* Data Table */}
                <div className="overflow-hidden rounded-lg border border-border">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead
                                        className="cursor-pointer font-semibold text-foreground select-none"
                                        onClick={() => handleSort('full_name')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Nama
                                            {getSortIcon('full_name')}
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer font-semibold text-foreground select-none"
                                        onClick={() => handleSort('email')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Email
                                            {getSortIcon('email')}
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer font-semibold text-foreground select-none"
                                        onClick={() => handleSort('university')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Universitas
                                            {getSortIcon('university')}
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer font-semibold text-foreground select-none"
                                        onClick={() => handleSort('domicile')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Domisili
                                            {getSortIcon('domicile')}
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer text-center font-semibold text-foreground select-none"
                                        onClick={() => handleSort('semester')}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            Semester
                                            {getSortIcon('semester')}
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer text-center font-semibold text-foreground select-none"
                                        onClick={() => handleSort('gpa')}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            IPK
                                            {getSortIcon('gpa')}
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer font-semibold text-foreground select-none"
                                        onClick={() => handleSort('created_at')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Terdaftar
                                            {getSortIcon('created_at')}
                                        </div>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {applicants.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            Tidak ada pendaftar yang ditemukan.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    applicants.data.map((applicant) => (
                                        <TableRow
                                            key={applicant.id}
                                            className="cursor-pointer transition-colors hover:bg-muted/50"
                                            onClick={() =>
                                                handleRowClick(applicant.id)
                                            }
                                        >
                                            <TableCell className="font-medium text-foreground">
                                                {applicant.full_name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {applicant.email}
                                            </TableCell>
                                            <TableCell
                                                className="max-w-[200px] truncate text-muted-foreground"
                                                title={applicant.university}
                                            >
                                                {applicant.university}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {applicant.domicile}
                                            </TableCell>
                                            <TableCell className="text-center text-muted-foreground">
                                                {applicant.semester}
                                            </TableCell>
                                            <TableCell className="text-center font-medium text-foreground">
                                                {Number(applicant.gpa).toFixed(
                                                    2,
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(
                                                    applicant.created_at,
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Pagination Controls */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-muted-foreground">
                        {applicants.from && applicants.to ? (
                            <>
                                Showing{' '}
                                <span className="font-semibold text-foreground">
                                    {applicants.from}
                                </span>{' '}
                                to{' '}
                                <span className="font-semibold text-foreground">
                                    {applicants.to}
                                </span>{' '}
                                of{' '}
                                <span className="font-semibold text-foreground">
                                    {applicants.total}
                                </span>{' '}
                                results
                            </>
                        ) : (
                            'No results'
                        )}
                    </div>
                    <div className="flex items-center justify-end gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(1)}
                            disabled={applicants.current_page === 1}
                            title="First page"
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                                handlePageChange(applicants.current_page - 1)
                            }
                            disabled={applicants.current_page === 1}
                            title="Previous page"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="px-3 py-2 text-sm font-medium">
                            Page {applicants.current_page} of{' '}
                            {applicants.last_page}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                                handlePageChange(applicants.current_page + 1)
                            }
                            disabled={
                                applicants.current_page === applicants.last_page
                            }
                            title="Next page"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                                handlePageChange(applicants.last_page)
                            }
                            disabled={
                                applicants.current_page === applicants.last_page
                            }
                            title="Last page"
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Applicant Detail Modal - Requirement 9.1 */}
            <ApplicantDetailModal
                applicantId={selectedApplicantId}
                open={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedApplicantId(null);
                }}
            />
        </AdminLayout>
    );
}
