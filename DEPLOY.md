# Deploy

Panduan singkat untuk update `pomodoki` di VPS.

## Pull + Redeploy

Jalankan ini setiap ada update baru di GitHub:

```bash
cd /opt/pomodoki
git fetch origin
git checkout main
git pull --ff-only origin main
sudo docker compose build app
sudo docker compose up -d --force-recreate app nginx
sudo docker compose ps
curl -I https://pomodoki.toeanmuda.id
```

Kalau hasil `curl` menunjukkan `307` ke `/login` atau `200`, berarti app normal.

## One Command

Kalau mau lebih singkat, setelah repo terbaru ter-pull ke VPS kamu bisa langsung jalankan:

```bash
bash scripts/deploy-vps.sh
```

Script ini akan:

- `git fetch`
- `git pull --ff-only`
- `docker compose build app`
- `docker compose up -d --force-recreate app nginx`
- tampilkan status container
- cek URL app dari `.env`

## Cek Commit Terakhir

```bash
cd /opt/pomodoki
git log --oneline -3
```

## Status Service

```bash
sudo systemctl is-enabled docker
sudo systemctl is-active docker
cd /opt/pomodoki
sudo docker compose ps
```

## Catatan

- Tidak perlu PM2 karena app berjalan di Docker.
- Service `app`, `db`, dan `nginx` sudah memakai `restart: unless-stopped`.
- Selama Docker aktif, container akan otomatis hidup lagi setelah reboot VPS.
- Untuk setup awal atau troubleshooting yang lebih lengkap, lihat `DEPLOY_VPS.md`.
