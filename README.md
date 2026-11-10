# Toko Online API

Backend aplikasi pengelolaan toko online (produk, kategori, pelanggan, pesanan, detail pesanan, dan pembayaran) menggunakan NestJS, TypeScript, TypeORM, dan PostgreSQL.

# Teknologi

- NestJS (TypeScript, ESM)
- TypeORM
- PostgreSQL 16 (Docker)
- class-validator dan class-transformer untuk validasi
- JWT dan bcrypt untuk autentikasi

# Prasyarat

- Node.js
- Docker Desktop
- Postman

# Instalasi dan Menjalankan

1. Clone repository dan masuk ke foldernya.

   ```bash
   git clone https://github.com/FatimatuzZahro-alt/uts_toko_online_smt5.git
   cd uts_toko_online
   ```

2. Install dependency.

   ```bash
   npm install
   ```

3. Buat file `.env` di root project (lihat bagian Konfigurasi Environment).

4. Jalankan database.

   ```bash
   docker compose up -d
   ```

5. Jalankan aplikasi.

   ```bash
   npm run start:dev
   ```

Aplikasi berjalan di `http://localhost:3000`. Tabel dibuat otomatis oleh TypeORM (`synchronize`) selama `NODE_ENV=development`.

# Konfigurasi Environment

Buat file `.env`. Nilai `DB_PASSWORD` dan `DB_DATABASE` harus sama dengan `POSTGRES_PASSWORD` dan `POSTGRES_DB` di `docker-compose.yml`.

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=12345
DB_DATABASE=uts_toko_online
JWT_SECRET=mn32qw56t1en&scnqiuqdh6e541r78%uqdscbzksjquyr873yr2evnvieh9t
JWT_EXPIRES_IN=86400
```

# Struktur Project

```
src/
├── auth/         register, login, JWT guard
├── categories/   kategori produk
├── customers/    data pelanggan
├── products/     produk dan stok
├── orders/       pesanan
├── order-items/  detail item pesanan
└── payments/     pembayaran
```

Setiap folder berisi module, controller, service, `dto/`, dan `entity/`.

# Dokumentasi API

Spesifikasi lengkap endpoint, request, response, dan error ada di [docs/API_SPECIFICATION.md](docs/API_SPECIFICATION.md).

# Pengujian dengan Postman

1. Import file `UTS_Toko_Online.postman_collection.json` (di folder `docs/`).
2. Pastikan variabel `baseUrl` bernilai `http://localhost:3000`.
3. Jalankan request dari folder paling atas (mulai dari `0.1 Register`), atau gunakan Collection Runner.
4. Hasil dapat diverifikasi di database (DBeaver, host `localhost`, port `5433`).

# Fitur Utama

- CRUD produk, kategori, pelanggan, pesanan, dan item pesanan
- Pembuatan pesanan dalam satu transaksi database (stok, total, dan harga saat transaksi dihitung server)
- Manajemen stok (pengurangan saat pesan, pengembalian saat batal)
- Pencatatan pembayaran
- Autentikasi JWT
- Soft delete untuk produk dan pelanggan