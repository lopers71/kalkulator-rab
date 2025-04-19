# Kalkulator RAB (Rencana Anggaran Biaya)

Aplikasi web untuk mengelola dan menghitung rencana anggaran biaya konstruksi.

## Fitur

- Manajemen material konstruksi
- Riwayat perubahan harga
- Grafik tren harga material
- Import/export data dari Excel
- Responsive design

## Teknologi

- Frontend: Vue.js 3 + Vite
- Backend: Express + JSON Server
- UI: Tailwind CSS
- Charts: Chart.js

## Cara Menjalankan Aplikasi

1. Clone repository
```bash
git clone [URL_REPOSITORY]
cd kalkulator-rab
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env
```

4. Jalankan server
```bash
npm run server
```

5. Jalankan aplikasi (di terminal terpisah)
```bash
npm run dev
```

6. Buka browser dan akses `http://localhost:5173`

## Struktur Project

```
kalkulator-rab/
├── src/                    # Source files frontend
│   ├── components/         # Komponen Vue
│   ├── views/             # Halaman Vue
│   └── services/          # Service API
├── server/                # Backend files
│   ├── server.js          # Express server
│   └── db.json           # Database JSON
└── public/               # Static files
```

## Deployment

Aplikasi ini dapat di-deploy menggunakan:
- Render.com (recommended)
- Vercel + Railway
- Netlify + Heroku

## Kontribusi

Silakan buat issue atau pull request untuk kontribusi.

## Lisensi

MIT License 