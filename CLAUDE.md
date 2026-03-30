# CLAUDE.md — Pomodoki Project Bible
File ini adalah referensi utama untuk semua AI agent yang bekerja
di project ini. Baca seluruh file ini sebelum mengerjakan task apapun.
---
## Project Overview
**Nama:** Pomodoki
**Deskripsi:** Pomodoro timer web app dengan fitur ambient sound,
pixel pet, AI task breakdown, statistik produktivitas, dan streak.
**Framework:** Next.js 14 (App Router)
**Language:** JavaScript (BUKAN TypeScript)
**Styling:** Tailwind CSS
---
## Tech Stack
| Layer | Teknologi |
|-------|-----------|
| Frontend | Next.js 14 App Router, React, Tailwind CSS |
| State Management | Zustand (global), React Context (auth, timer) |
| ORM | Drizzle ORM |
| Database | PostgreSQL 16 |
| Auth | Manual JWT (jose) + bcryptjs, httpOnly cookie |
| AI | OpenAI API |
| Audio | Howler.js |
| Deployment | Docker + Nginx |
---
## Architecture: Layered Architecture
Project ini menggunakan Layered Architecture dengan dependency
rule ketat: layer atas boleh depend ke bawah, layer bawah
TIDAK BOLEH tau layer atas.
Presentation Layer → /src/presentation, /src/app (pages) Application Layer → /src/application Domain Layer → /src/core Infrastructure Layer → /src/infrastructure



### Domain Layer (/src/core)
- Berisi entities, errors, constants
- TIDAK boleh import dari layer lain
- TIDAK boleh import library eksternal
- Murni definisi dan konstanta
### Application Layer (/src/application)
- Berisi use cases
- Boleh import dari: core layer, infrastructure layer
- TIDAK boleh import dari: presentation layer, Next.js, React
- Setiap use case adalah class dengan method execute()
### Infrastructure Layer (/src/infrastructure)
- Berisi repositories, services, database config, container
- Boleh import dari: core layer, library eksternal (drizzle, bcrypt, dll)
- TIDAK boleh import dari: application layer, presentation layer
### Presentation Layer (/src/presentation, /src/app)
- Berisi components, hooks, providers, pages
- Boleh import dari semua layer
- Logic bisnis TIDAK boleh ada di sini
- Pages hanya boleh memanggil API routes atau hooks
---
## Project Structure
/pomodoki ├── src/ │ ├── app/ # Next.js App Router │ │ ├── api/ # API route handlers │ │ │ ├── auth/ │ │ │ │ ├── register/route.js │ │ │ │ ├── login/route.js │ │ │ │ ├── logout/route.js │ │ │ │ └── me/route.js │ │ │ ├── tasks/ │ │ │ │ ├── route.js │ │ │ │ └── [id]/route.js │ │ │ ├── sessions/ │ │ │ │ ├── route.js │ │ │ │ └── stats/route.js │ │ │ ├── settings/route.js │ │ │ └── ai/breakdown/route.js │ │ ├── (auth)/ │ │ │ ├── login/page.jsx │ │ │ ├── register/page.jsx │ │ │ └── layout.jsx │ │ ├── (main)/ │ │ │ ├── page.jsx # Main timer page │ │ │ ├── stats/page.jsx │ │ │ └── settings/page.jsx │ │ ├── layout.js │ │ └── middleware.js │ │ │ ├── core/ # Domain Layer │ │ ├── entities/ │ │ │ ├── user.entity.js │ │ │ ├── task.entity.js │ │ │ ├── session.entity.js │ │ │ ├── settings.entity.js │ │ │ └── streak.entity.js │ │ ├── errors/ │ │ │ └── domain.errors.js │ │ └── constants/ │ │ └── index.js │ │ │ ├── application/ # Application Layer │ │ ├── auth/ │ │ │ ├── register.usecase.js │ │ │ ├── login.usecase.js │ │ │ └── get-current-user.usecase.js │ │ ├── tasks/ │ │ │ ├── create-task.usecase.js │ │ │ ├── get-tasks.usecase.js │ │ │ ├── update-task.usecase.js │ │ │ └── delete-task.usecase.js │ │ ├── sessions/ │ │ │ ├── create-session.usecase.js │ │ │ └── get-stats.usecase.js │ │ ├── settings/ │ │ │ ├── get-settings.usecase.js │ │ │ └── update-settings.usecase.js │ │ ├── streaks/ │ │ │ └── update-streak.usecase.js │ │ └── ai/ │ │ └── breakdown-task.usecase.js │ │ │ ├── infrastructure/ # Infrastructure Layer │ │ ├── database/ │ │ │ ├── drizzle.js │ │ │ ├── schema.js │ │ │ └── migrations/ │ │ ├── repositories/ │ │ │ ├── user.repository.js │ │ │ ├── task.repository.js │ │ │ ├── session.repository.js │ │ │ ├── settings.repository.js │ │ │ └── streak.repository.js │ │ ├── services/ │ │ │ ├── hash.service.js │ │ │ ├── jwt.service.js │ │ │ └── openai.service.js │ │ └── container/ │ │ └── index.js │ │ │ ├── presentation/ # Presentation Layer │ │ ├── components/ │ │ │ ├── timer/ │ │ │ │ ├── Timer.jsx │ │ │ │ ├── TimerControls.jsx │ │ │ │ └── TimerProgress.jsx │ │ │ ├── tasks/ │ │ │ │ ├── TaskList.jsx │ │ │ │ ├── TaskItem.jsx │ │ │ │ ├── TaskForm.jsx │ │ │ │ └── AIBreakdown.jsx │ │ │ ├── ambient/ │ │ │ │ ├── AmbientPlayer.jsx │ │ │ │ ├── SoundSelector.jsx │ │ │ │ └── VolumeControl.jsx │ │ │ ├── pet/ │ │ │ │ ├── PixelPet.jsx │ │ │ │ └── PetStatus.jsx │ │ │ ├── stats/ │ │ │ │ ├── StatsOverview.jsx │ │ │ │ ├── StreakDisplay.jsx │ │ │ │ └── ProductivityChart.jsx │ │ │ └── ui/ │ │ │ ├── Button.jsx │ │ │ ├── Input.jsx │ │ │ ├── Card.jsx │ │ │ └── Modal.jsx │ │ ├── hooks/ │ │ │ ├── useTimer.js │ │ │ ├── useAuth.js │ │ │ ├── useTasks.js │ │ │ ├── useAmbient.js │ │ │ └── useStats.js │ │ └── providers/ │ │ ├── AuthProvider.jsx │ │ └── TimerProvider.jsx │ │ │ ├── lib/ │ │ ├── utils.js │ │ ├── constants.js │ │ └── validations.js │ │ │ └── config/ │ └── env.js │ ├── public/ │ ├── sounds/ # Audio files (mp3) │ │ ├── rain.mp3 │ │ ├── brown_noise.mp3 │ │ ├── coffee_shop.mp3 │ │ ├── forest.mp3 │ │ ├── ocean.mp3 │ │ └── fireplace.mp3 │ └── pets/ # Pixel pet sprites (PNG) │ ├── cat-happy.png │ ├── cat-neutral.png │ ├── cat-sad.png │ ├── cat-sleeping.png │ ├── dog-happy.png │ ├── dog-neutral.png │ ├── dog-sad.png │ ├── dog-sleeping.png │ ├── bird-happy.png │ ├── bird-neutral.png │ ├── bird-sad.png │ ├── bird-sleeping.png │ ├── plant-happy.png │ ├── plant-neutral.png │ ├── plant-sad.png │ └── plant-sleeping.png │ ├── drizzle.config.js ├── docker-compose.yml ├── Dockerfile ├── nginx.conf ├── .env.example ├── .env.local # TIDAK di-commit (ada di .gitignore) └── CLAUDE.md # File ini



---
## Database Schema
### Table: users
| Column | Type | Constraint |
|--------|------|------------|
| id | uuid | PK, default random |
| username | text | unique, not null |
| password | text | not null, bcrypt hashed |
| created_at | timestamp | default now |
### Table: tasks
| Column | Type | Constraint |
|--------|------|------------|
| id | uuid | PK, default random |
| user_id | uuid | FK → users, on delete cascade |
| title | text | not null |
| completed | boolean | default false |
| pomodoro_count | integer | default 0 |
| created_at | timestamp | default now |
### Table: pomodoro_sessions
| Column | Type | Constraint |
|--------|------|------------|
| id | uuid | PK, default random |
| user_id | uuid | FK → users, on delete cascade |
| task_id | uuid | FK → tasks, nullable, on delete set null |
| duration | integer | not null (detik) |
| type | text | not null: focus/short_break/long_break |
| completed_at | timestamp | default now |
### Table: user_settings
| Column | Type | Constraint |
|--------|------|------------|
| user_id | uuid | PK, FK → users, on delete cascade |
| focus_duration | integer | default 1500 (25 min) |
| short_break_duration | integer | default 300 (5 min) |
| long_break_duration | integer | default 900 (15 min) |
| pet_type | text | default 'cat' |
| ambient_sound | text | default 'rain' |
### Table: streaks
| Column | Type | Constraint |
|--------|------|------------|
| user_id | uuid | PK, FK → users, on delete cascade |
| current_streak | integer | default 0 |
| longest_streak | integer | default 0 |
| last_active_date | date | nullable |
---
## API Endpoints
### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register user baru |
| POST | /api/auth/login | No | Login |
| POST | /api/auth/logout | No | Logout, clear cookie |
| GET | /api/auth/me | Yes | Get current user |
### Tasks
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/tasks | Yes | Get semua task user |
| POST | /api/tasks | Yes | Create task baru |
| PATCH | /api/tasks/[id] | Yes | Update task |
| DELETE | /api/tasks/[id] | Yes | Delete task |
### Sessions
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/sessions | Yes | Log completed session |
| GET | /api/sessions/stats | Yes | Get statistik user |
### Settings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/settings | Yes | Get user settings |
| PATCH | /api/settings | Yes | Update settings |
### AI
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/ai/breakdown | Yes | Breakdown task jadi subtasks |
---
## Auth Flow
- Auth menggunakan JWT disimpan di httpOnly cookie
- Cookie name: `pomodoki_token`
- Expiry: 7 hari
- JWT payload: `{ userId, username }`
- Protected routes dijaga oleh middleware di src/middleware.js
- Public routes: /login, /register
- Setelah register/login otomatis redirect ke /
---
## Timer Logic
State:

mode: 'focus' | 'short_break' | 'long_break'
timeLeft: number (detik)
isRunning: boolean
currentTaskId: string | null
pomodoroCount: number
Config dari user_settings:

focusDuration: default 1500
shortBreakDuration: default 300
longBreakDuration: default 900
On session complete:

Log session ke POST /api/sessions
Update streak
Jika mode focus:
pomodoroCount++
pomodoroCount % 4 === 0 → next: long_break
else → next: short_break
Jika mode break → next: focus
Update pet state


---
## Streak Logic
Trigger: setiap kali session focus selesai

Get streak record user
Compare lastActiveDate dengan hari ini:
Hari yang sama → skip (sudah dihitung)
Kemarin → currentStreak + 1
Lebih lama → reset currentStreak = 1
Update longestStreak jika currentStreak > longestStreak
Set lastActiveDate = today


---
## AI Breakdown
Endpoint: POST /api/ai/breakdown Input: { taskTitle: string } Output: { subtasks: string[] }

Prompt template: "Breakdown task berikut menjadi 3-5 subtask yang masing-masing bisa diselesaikan dalam 1 sesi Pomodoro (25 menit). Task: {taskTitle} Balas HANYA dalam format JSON array string: ["subtask 1", "subtask 2", ...]"



---
## Pixel Pet
Pet types: cat, dog, bird, plant States: happy, neutral, sad, sleeping

State logic:

happy: baru selesai session focus ATAU current_streak >= 3
sad: current_streak === 0 ATAU tidak aktif > 2 hari
sleeping: timer tidak running DAN mode break
neutral: default
Sprite files: /public/pets/{type}-{state}.png



---
## Ambient Sounds
Available: rain, brown_noise, coffee_shop, forest, ocean, fireplace Files: /public/sounds/{name}.mp3 Library: Howler.js Features: loop, volume control, persist ke user_settings



---
## Environment Variables
DATABASE_URL - PostgreSQL connection string JWT_SECRET - Min 32 karakter, untuk sign JWT OPENAI_API_KEY - OpenAI API key untuk AI breakdown NEXT_PUBLIC_APP_URL - App URL (public) NODE_ENV - development | production



---
## Domain Constants
COOKIE_NAME = 'pomodoki_token' JWT_EXPIRY = '7d' BCRYPT_ROUNDS = 10 LONG_BREAK_INTERVAL = 4 MAX_USERNAME_LENGTH = 30 MIN_USERNAME_LENGTH = 3 MIN_PASSWORD_LENGTH = 6



---
## Domain Errors
| Class | Code | HTTP Status |
|-------|------|-------------|
| ValidationError | VALIDATION_ERROR | 400 |
| AuthenticationError | AUTH_ERROR | 401 |
| ForbiddenError | FORBIDDEN | 403 |
| NotFoundError | NOT_FOUND | 404 |
| ConflictError | CONFLICT | 409 |
---
## Coding Rules
1. **JavaScript only** — tidak ada TypeScript, tidak ada .ts atau .tsx
2. **File extension** — pages/components = .jsx, logic = .js
3. **Import alias** — selalu gunakan @/ bukan relative path ../
4. **Layer boundary** — jangan skip layer, ikuti dependency rule
5. **No business logic** di route handlers dan components —
   delegasikan ke use case
6. **Error handling** — selalu gunakan domain errors,
   jangan expose stack trace ke client
7. **Use case pattern** — setiap use case adalah class dengan
   method execute()
8. **Repository pattern** — semua database access lewat repository,
   tidak ada direct db query di luar /infrastructure/repositories/
9. **Cookie** — JWT hanya di httpOnly cookie, TIDAK di localStorage
10. **Drizzle** — selalu gunakan Drizzle ORM, tidak ada raw SQL
---
## Implementation Phases
### Phase 1 — Foundation ✅
- Project setup, folder structure
- Environment config
- Database schema + Drizzle config
- Docker setup
### Phase 2 — Auth ✅
- Domain layer (entities, errors, constants)
- Hash service, JWT service
- User repository
- Auth use cases (register, login, get-current-user)
- Auth API routes
- Middleware
- Login/Register pages
- AuthProvider + useAuth hook
- Dependency container
### Phase 3 — Core Timer ✅
- Settings repository + use cases
- Session repository
- Streak repository + use case
- Timer components (Timer, TimerControls, TimerProgress)
- TimerProvider + useTimer hook
- Session API route
- Settings API route
- Main page layout
- UI primitives (Button, Card)
### Phase 4 — Tasks ✅
- Task repository
- Task use cases (CRUD)
- Task API routes
- Task components (TaskList, TaskItem, TaskForm)
- UI primitives (Input, Modal)
- useTasks hook
- Integrasi ke main page
### Phase 5 — Gamification ✅
- Pet state logic (pet-helpers.js, pure functions)
- PixelPet component dengan streak integration
- PetStatus component dengan dynamic messages
- Placeholder SVG images (16 files)
- Integrasi ke main page
### Phase 6 — Ambient ✅
- ambient-helpers.js (pure functions)
- useAmbient hook dengan Howler.js dynamic import
- AmbientPlayer, SoundSelector, VolumeControl components
- Placeholder public/sounds/ folder
- Integrasi ke main page
- Settings page (/settings)
### Phase 7 — AI & Stats (TODO)
- OpenAI service
- AI breakdown use case + API route
- AIBreakdown component
- Stats use case
- Stats page + components (StatsOverview, StreakDisplay, Chart)
- useStats hook
### Phase 8 — Polish (TODO)
- Error handling UI
- Loading states
- Responsive design
- Final QA
---
## Notes untuk AI Agent
- Selalu baca CLAUDE.md sebelum mulai task
- Scope setiap task sudah ditentukan di prompt — jangan keluar dari scope
- Jangan buat file di luar yang diminta
- Jangan modifikasi file yang tidak disebut di prompt
- Jika ada konflik atau ambiguitas, tanya dulu jangan assume
- Pastikan setiap file baru konsisten dengan file yang sudah ada
- Cek apakah file yang akan dimodifikasi sudah ada sebelum membuat baru
---
