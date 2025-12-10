import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Building2, Clock, MapPin, TrendingUp, Users, GraduationCap, Award } from 'lucide-react';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    Area,
    AreaChart,
} from 'recharts';


interface DashboardStatistics {
    total_applicants: number;
    latest_submission: string | null;
    by_university: Array<{ university: string; count: number }>;
    by_domicile: Array<{ domicile: string; count: number }>;
    by_semester: Array<{ semester: number; count: number }>;
    gpa_distribution: Array<{ range: string; count: number }>;
    daily_registrations: Array<{ date: string; count: number }>;
    avg_gpa: number;
}

interface DashboardProps {
    statistics: DashboardStatistics;
}

const COLORS = [
    '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B',
    '#10B981', '#06B6D4', '#EF4444', '#F97316',
    '#6366F1', '#14B8A6', '#D946EF', '#0891B2',
];

export default function Dashboard({ statistics }: DashboardProps) {
    const breadcrumbs = [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Dashboard', href: '/admin/dashboard' },
    ];

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Belum ada pendaftaran';
        return new Date(dateString).toLocaleString('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    const topUniversities = statistics.by_university.slice(0, 8);
    const topDomiciles = statistics.by_domicile.slice(0, 8);

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - SIAP Impact Admin">
                <meta
                    name="description"
                    content="Dashboard administratif SIAP Impact untuk mengelola pendaftar dan melihat statistik program."
                />
                <meta
                    property="og:title"
                    content="Dashboard - SIAP Impact Admin"
                />
                <meta
                    property="og:description"
                    content="Dashboard administratif SIAP Impact untuk mengelola pendaftar dan melihat statistik program."
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
                <div className="flex flex-col gap-3">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Dashboard Admin
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Pantau statistik dan kelola pendaftar program SIAP Impact
                    </p>
                </div>

                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm">
                        Total Pendaftar:{' '}
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            {statistics.total_applicants}
                        </span>
                    </div>
                    <Button asChild className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/90">
                        <Link href="/admin/applicants">
                            Lihat Semua Pendaftar
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Total Applicants */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-semibold text-muted-foreground">
                                Total Pendaftar
                            </CardTitle>
                            <Users className="h-5 w-5 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">
                                {statistics.total_applicants}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Peserta terdaftar
                            </p>
                        </CardContent>
                    </Card>

                    {/* Average GPA */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-semibold text-muted-foreground">
                                IPK Rata-rata
                            </CardTitle>
                            <Award className="h-5 w-5 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">
                                {statistics.avg_gpa ? statistics.avg_gpa.toFixed(2) : '0.00'}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Dari semua pendaftar
                            </p>
                        </CardContent>
                    </Card>

                    {/* Universities */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-semibold text-muted-foreground">
                                Universitas
                            </CardTitle>
                            <Building2 className="h-5 w-5 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">
                                {statistics.by_university.length}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Institusi berbeda
                            </p>
                        </CardContent>
                    </Card>

                    {/* Latest Submission */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-semibold text-muted-foreground">
                                Pendaftaran Terbaru
                            </CardTitle>
                            <Clock className="h-5 w-5 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm font-bold text-foreground">
                                {formatDate(statistics.latest_submission)}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Pendaftaran terakhir
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* University Distribution Bar Chart */}
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-bold">
                                        Distribusi per Universitas
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        Top {topUniversities.length} institusi dengan pendaftar terbanyak
                                    </CardDescription>
                                </div>
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            {topUniversities.length === 0 ? (
                                <p className="py-12 text-center text-sm text-muted-foreground">
                                    Belum ada data universitas
                                </p>
                            ) : (
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart
                                        data={topUniversities}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                                        <XAxis 
                                            dataKey="university" 
                                            angle={-45}
                                            textAnchor="end"
                                            height={120}
                                            tick={{ fontSize: 11 }}
                                            interval={0}
                                        />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip 
                                            contentStyle={{
                                                backgroundColor: 'var(--background)',
                                                border: '1px solid var(--border)',
                                                borderRadius: '8px',
                                            }}
                                            formatter={(value) => [`${value} pendaftar`, 'Jumlah']}
                                            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                        />
                                        <Legend />
                                        <Bar 
                                            dataKey="count" 
                                            fill="#3B82F6" 
                                            radius={[8, 8, 0, 0]}
                                            name="Jumlah Pendaftar"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>

                    {/* Domicile Distribution Pie Chart */}
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-bold">
                                        Distribusi per Domisili
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        Top {topDomiciles.length} lokasi dengan pendaftar terbanyak
                                    </CardDescription>
                                </div>
                                <MapPin className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            {topDomiciles.length === 0 ? (
                                <p className="py-12 text-center text-sm text-muted-foreground">
                                    Belum ada data domisili
                                </p>
                            ) : (
                                <ResponsiveContainer width="100%" height={400}>
                                    <PieChart>
                                        <Pie
                                            data={topDomiciles}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={true}
                                            label={(props: { payload?: { domicile?: string; count?: number } }) => {
                                                const { payload } = props;
                                                return payload ? `${payload.domicile} (${payload.count})` : '';
                                            }}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="count"
                                        >
                                            {topDomiciles.map((_, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{
                                                backgroundColor: 'var(--background)',
                                                border: '1px solid var(--border)',
                                                borderRadius: '8px',
                                            }}
                                            formatter={(value) => [`${value} pendaftar`, 'Jumlah']}
                                        />
                                        <Legend 
                                            layout="vertical"
                                            align="right"
                                            verticalAlign="middle"
                                            formatter={(_, entry) => {
                                                const payload = entry.payload as { domicile?: string; count?: number } | undefined;
                                                return payload ? `${payload.domicile} (${payload.count})` : '';
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>

                    {/* GPA Distribution */}
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-bold">
                                        Distribusi IPK
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        Sebaran nilai IPK pendaftar
                                    </CardDescription>
                                </div>
                                <Award className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            {!statistics.gpa_distribution || statistics.gpa_distribution.length === 0 ? (
                                <p className="py-12 text-center text-sm text-muted-foreground">
                                    Belum ada data IPK
                                </p>
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart
                                        data={statistics.gpa_distribution}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                                        <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip 
                                            contentStyle={{
                                                backgroundColor: 'var(--background)',
                                                border: '1px solid var(--border)',
                                                borderRadius: '8px',
                                            }}
                                            formatter={(value) => [`${value} pendaftar`, 'Jumlah']}
                                        />
                                        <Legend />
                                        <Bar 
                                            dataKey="count" 
                                            fill="#10B981" 
                                            radius={[8, 8, 0, 0]}
                                            name="Jumlah Pendaftar"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>

                    {/* Semester Distribution */}
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-bold">
                                        Distribusi per Semester
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        Sebaran semester pendaftar
                                    </CardDescription>
                                </div>
                                <GraduationCap className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            {!statistics.by_semester || statistics.by_semester.length === 0 ? (
                                <p className="py-12 text-center text-sm text-muted-foreground">
                                    Belum ada data semester
                                </p>
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart
                                        data={statistics.by_semester}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                    >
                                        <defs>
                                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                                        <XAxis 
                                            dataKey="semester" 
                                            tick={{ fontSize: 12 }}
                                            label={{ value: 'Semester', position: 'insideBottom', offset: -10 }}
                                        />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip 
                                            contentStyle={{
                                                backgroundColor: 'var(--background)',
                                                border: '1px solid var(--border)',
                                                borderRadius: '8px',
                                            }}
                                            formatter={(value) => [`${value} pendaftar`, 'Jumlah']}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="count" 
                                            stroke="#8B5CF6" 
                                            fillOpacity={1} 
                                            fill="url(#colorCount)"
                                            name="Jumlah Pendaftar"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Daily Registrations Trend */}
                {statistics.daily_registrations && statistics.daily_registrations.length > 0 && (
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-bold">
                                        Tren Pendaftaran Harian
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        Grafik pendaftaran 30 hari terakhir
                                    </CardDescription>
                                </div>
                                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart
                                    data={statistics.daily_registrations}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                                    <XAxis 
                                        dataKey="date" 
                                        tick={{ fontSize: 10 }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                    />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: 'var(--background)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '8px',
                                        }}
                                        formatter={(value) => [`${value} pendaftar`, 'Jumlah']}
                                        labelFormatter={(label) => `Tanggal: ${label}`}
                                    />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="count" 
                                        stroke="#F59E0B" 
                                        strokeWidth={2}
                                        dot={{ fill: '#F59E0B', r: 4 }}
                                        activeDot={{ r: 6 }}
                                        name="Jumlah Pendaftar"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}
