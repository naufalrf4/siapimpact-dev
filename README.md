# SIAP Impact / SAKINA

Platform pendaftaran digital untuk program SIAP Impact yang diinisiasi oleh Kementerian Kependudukan dan Pembangunan Keluarga (Kemendukbangga) melalui Superapps SAKINA.

> **Youth Innovation for Indonesia's Future**

## Tentang Proyek

SIAP Impact adalah gerakan nasional untuk memperkuat kualitas generasi muda Indonesia dengan fokus pada:
- Social empathy & responsibility
- Family resilience literacy
- Digital citizenship & innovation mindset
- Collaborative leadership for Indonesia's human development

Platform ini menyediakan:
- **Landing Page** - Informasi program, topik esai, dan panduan pendaftaran
- **Formulir Pendaftaran** - Pengumpulan data identitas, akademik, dan dokumen pendukung
- **Panel Admin** - Manajemen pendaftar, unduh dokumen, dan ekspor data

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Laravel 12 (PHP 8.3+) |
| Frontend | React 18 + TypeScript |
| Bridge | Inertia.js |
| UI Components | shadcn/ui + Radix UI |
| Styling | Tailwind CSS |
| Build Tool | Vite |
| Database | MySQL 8.0 |
| Container | Docker + Docker Compose |

## Persyaratan Sistem

- Docker & Docker Compose
- Node.js 18+ (untuk development lokal)
- PHP 8.3+ (jika tidak menggunakan Docker)
- Composer 2.x

## Instalasi & Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd siapimpact
```

### 2. Setup Environment

```bash
cp src/.env.example src/.env
```

### 3. Jalankan Docker

```bash
docker-compose up -d
```

Services yang tersedia:
- **App**: `http://localhost:8000` (Laravel)
- **Vite HMR**: `http://localhost:5173`
- **phpMyAdmin**: `http://localhost:8080`
- **MySQL**: `localhost:3306`

### 4. Install Dependencies

```bash
# PHP dependencies
docker exec docker-siapimpact-app-dev composer install

# Node dependencies
docker exec docker-siapimpact-app-dev npm install
```

### 5. Setup Database

```bash
# Generate app key
docker exec docker-siapimpact-app-dev php artisan key:generate

# Run migrations
docker exec docker-siapimpact-app-dev php artisan migrate

# Seed admin user
docker exec docker-siapimpact-app-dev php artisan db:seed
```

### 6. Jalankan Development Server

```bash
# Laravel server (dalam container)
docker exec docker-siapimpact-app-dev php artisan serve --host=0.0.0.0 --port=8000

# Vite dev server (dalam container)
docker exec docker-siapimpact-app-dev npm run dev -- --host
```

## Struktur Proyek

```
/
├── context/                    # Dokumentasi proyek
│   ├── overview.md            # Gambaran umum proyek
│   ├── architecture.md        # Arsitektur sistem
│   ├── requirements.yaml      # Spesifikasi kebutuhan
│   ├── tech-stack.yaml        # Stack teknologi
│   ├── security.yaml          # Kebijakan keamanan
│   └── workflow.yaml          # Alur pengembangan
├── docker/                     # Docker configuration
│   ├── php-dev.Dockerfile     # Development image
│   ├── php-prod.Dockerfile    # Production image
│   └── php.ini                # PHP configuration
├── src/                        # Laravel application
│   ├── app/
│   │   ├── Http/Controllers/  # Controllers
│   │   ├── Models/            # Eloquent models
│   │   └── Services/          # Business logic
│   ├── database/
│   │   ├── migrations/        # Database migrations
│   │   └── seeders/           # Database seeders
│   ├── resources/
│   │   └── js/
│   │       ├── components/    # React components
│   │       ├── layouts/       # Layout components
│   │       └── pages/         # Inertia pages
│   │           ├── Landing/   # Public landing
│   │           ├── Register/  # Registration form
│   │           └── Admin/     # Admin panel
│   ├── routes/
│   │   ├── web.php           # Public routes
│   │   └── admin.php         # Admin routes
│   └── storage/
│       └── app/siapimpact/   # Uploaded documents
│           ├── recommendation_letters/
│           ├── twibbon_images/
│           ├── twibbon_screenshots/
│           └── essays/
└── docker-compose.yml
```

## Routes

### Public Routes

| Method | Path | Deskripsi |
|--------|------|-----------|
| GET | `/` | Landing page |
| GET | `/register` | Formulir pendaftaran |
| POST | `/register` | Submit pendaftaran |
| GET | `/register/success` | Halaman sukses |

### Admin Routes

| Method | Path | Deskripsi |
|--------|------|-----------|
| GET | `/admin/login` | Halaman login admin |
| POST | `/admin/login` | Proses login |
| POST | `/admin/logout` | Logout |
| GET | `/admin/dashboard` | Dashboard statistik |
| GET | `/admin/applicants` | Daftar pendaftar |
| GET | `/admin/applicants/{id}` | Detail pendaftar |
| GET | `/admin/applicants/{id}/download/{type}` | Download dokumen |
| GET | `/admin/applicants/export` | Export data (CSV/Excel) |

## Formulir Pendaftaran

### Data Identitas
- Nama Lengkap
- NIK (Nomor Induk Kependudukan)
- Tempat & Tanggal Lahir
- Nomor Handphone
- Alamat Email
- Domisili

### Data Akademik
- Asal Universitas
- Program Studi
- Semester (1-14)
- IPK Terakhir (0.00-4.00)

### Dokumen Pendukung
| Dokumen | Format | Max Size |
|---------|--------|----------|
| Surat Rekomendasi Dosen | PDF | 2 MB |
| Twibbon (Hasil) | JPG/PNG | 2 MB |
| Screenshot Instagram Twibbon | JPG/PNG | 2 MB |
| Essay | PDF | 4 MB |

## Keamanan

Platform ini menerapkan beberapa mekanisme keamanan:

- **Rate Limiting** - Pembatasan request per IP pada endpoint pendaftaran
- **Unique Constraints** - Email dan NIK harus unik
- **IP Limits** - Pembatasan jumlah pendaftaran per IP per hari
- **Honeypot** - Field tersembunyi untuk deteksi bot
- **File Validation** - Validasi MIME type dan ukuran file
- **Secure Storage** - Dokumen disimpan di non-public disk
- **Admin Auth** - Semua route admin dilindungi middleware autentikasi

## Topik Esai

1. **Digital for Humanity** - Inovasi digital untuk meningkatkan kualitas hidup masyarakat
2. **Youth for Strong Families** - Peran generasi muda dalam memperkuat ketahanan keluarga
3. **Bridging the Generation Gap** - Solusi untuk memperkuat kolaborasi lintas generasi
4. **Human Development for the Future** - Ide untuk meningkatkan kualitas penduduk muda
5. **From Awareness to Population Action** - Gerakan konkret untuk isu kependudukan

### Ketentuan Teknis Esai
- Panjang: 700–1.000 kata (2–3 halaman)
- Format: A4, Calibri 12, spasi 1,5
- Bahasa: Indonesia yang komunikatif dan inspiratif
- File: PDF dengan format nama `NamaLengkap_AsalUniversitas_JudulEsai_SIAPImpact2026.pdf`

## Development Commands

```bash
# Masuk ke container
docker exec -it docker-siapimpact-app-dev bash

# Artisan commands
docker exec docker-siapimpact-app-dev php artisan <command>

# Composer
docker exec docker-siapimpact-app-dev composer <command>

# NPM
docker exec docker-siapimpact-app-dev npm <command>

# Run tests
docker exec docker-siapimpact-app-dev php artisan test

# Clear cache
docker exec docker-siapimpact-app-dev php artisan optimize:clear

# Build assets untuk production
docker exec docker-siapimpact-app-dev npm run build
```

## Environment Variables

Key environment variables yang perlu dikonfigurasi:

```env
APP_NAME="SIAP Impact"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=docker-siapimpact-db
DB_PORT=3306
DB_DATABASE=siapimpact
DB_USERNAME=siapimpact
DB_PASSWORD=siapimpact

# Registration window (optional)
REGISTRATION_OPEN_AT=
REGISTRATION_CLOSE_AT=

# Rate limiting
REGISTRATION_RATE_LIMIT=10
REGISTRATION_IP_DAILY_LIMIT=5
```

## Design System

Platform menggunakan design palette khusus SIAP Impact:

| Warna | Hex | Penggunaan |
|-------|-----|------------|
| Brand Blue | `#155EBB` | Primary / CTA buttons |
| Sky Blue | `#74C4F5` | Secondary elements |
| Impact Yellow | `#FCC900` | Accent / highlights |
| White | `#FFFFFF` | Backgrounds |

Lihat `context/design-palette.md` untuk detail lengkap.

## Production Deployment

```bash
# Build production image
docker build -f docker/php-prod.Dockerfile -t siapimpact-prod .

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Build frontend assets
npm run build
```

Checklist production:
- [ ] Set `APP_ENV=production` dan `APP_DEBUG=false`
- [ ] Konfigurasi HTTPS
- [ ] Setup backup database dan storage
- [ ] Konfigurasi rate limiting sesuai kebutuhan
- [ ] Review security headers di nginx

## Kontributor

Dikembangkan untuk Kementerian Kependudukan dan Pembangunan Keluarga (Kemendukbangga) melalui program SAKINA.

## Lisensi

Hak cipta dilindungi. Penggunaan terbatas untuk program SIAP Impact.
