# CaseVault — E-Cell Tech Team Recruitment Task

A full-stack web app to showcase case competition slides. Built for the E-Cell IIT (BHU) Varanasi Tech Team Recruitment 2026.

## Tech Stack
- **Frontend:** React + Vite + TailwindCSS + React Router + Axios
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **File storage:** Cloudinary (signed-upload flow)
- **Auth:** JWT

## Project Structure
/backend

index.js          → all API routes

models.js         → Mongoose schemas

middleware.js     → JWT auth middleware

.env              → secrets (not committed)
/frontend

src/

api/            → axios calls (auth, slides, cloudinary)

components/     → Navbar, SlideCard, ProtectedRoute

pages/          → Home, Login, Register, Upload, SlideDetail

App.jsx         → routes

## Setup

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env   # then fill in your real values
node index.js
```
Runs on `http://localhost:3000`

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`

### Environment variables (backend/.env)
| Variable | Description |
|---|---|
| `MONGO_URL` | MongoDB connection string |
| `JWT_SECRET` | Any random secret string for signing tokens |
| `CLOUDINARY_CLOUD_NAME` | From your Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From your Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From your Cloudinary dashboard |

## API Routes

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create an account |
| POST | `/api/auth/login` | Public | Log in, returns JWT |
| POST | `/api/sign-url` | Protected | Get a signed Cloudinary upload signature |
| GET | `/api/slides` | Public | List slides — supports `page`, `limit`, `search`, `tags`, `sortBy`, `order` |
| GET | `/api/slides/:id` | Public | Get one slide |
| POST | `/api/slides` | Protected | Create a slide |
| PUT | `/api/slides/:id` | Protected | Edit a slide (only by uploader) |
| DELETE | `/api/slides/:id` | Protected | Delete a slide (only by uploader) |

## How file upload works
1. Frontend asks the backend for a signed Cloudinary signature (`POST /api/sign-url`) — this keeps the Cloudinary API secret server-side only.
2. Frontend uploads the file directly to Cloudinary using that signature.
3. Frontend sends the resulting Cloudinary URL to `POST /api/slides` to save it in MongoDB.
