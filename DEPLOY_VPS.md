# VPS Deploy

Project ini aman dipasang di VPS yang sudah ramai aplikasi karena hanya web yang dipublish ke host. `app` dan `db` tetap di network Docker internal, jadi tidak bentrok dengan port host lain.

## Port yang Perlu Dicek di VPS

- Semua port yang sedang listen:

```bash
sudo ss -tulpn
```

- Port web yang ingin dipakai app ini:

```bash
sudo ss -tulpn | grep ':8080 '
```

- Kalau host sudah punya reverse proxy di `80/443`, pilih port web lain misalnya `8087` lalu set `WEB_HOST_PORT=8087`.

- PostgreSQL container tidak dipublish ke host di setup ini, jadi tidak perlu host port khusus untuk DB dan tidak akan bentrok dengan PostgreSQL lain di server.

## File Env Produksi

Buat `.env` di server minimal berisi:

```env
DB_PASSWORD=replace-with-strong-password
JWT_SECRET=replace-with-min-32-chars
OPENAI_API_KEY=sk-xxx
NEXT_PUBLIC_APP_URL=http://YOUR_SERVER_IP_OR_DOMAIN:8080
NODE_ENV=production
WEB_HOST_PORT=8080
```

Kalau pakai domain + reverse proxy host, `NEXT_PUBLIC_APP_URL` isi dengan URL final domain kamu.

## Deploy

```bash
git clone <repo-url> pomodoki
cd pomodoki
cp .env.example .env
docker compose build
docker compose up -d db
docker compose run --rm migrate
docker compose up -d
```

## Verifikasi

```bash
docker compose ps
docker compose logs --tail=100 app
docker compose logs --tail=100 nginx
curl http://127.0.0.1:${WEB_HOST_PORT}
```
