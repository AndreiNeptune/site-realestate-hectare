# HectarExpert — Platformă Premium de Investiții în Hectare

HectarExpert este o platformă modernă și performantă dedicată tranzacționării de terenuri de mari dimensiuni în România. Proiectul oferă o experiență utilizator premium, cu un design minimalist și funcționalități avansate de filtrare și management.

![HectarExpert Preview](https://via.placeholder.com/1200x600/101827/FFFFFF?text=HectarExpert+Real+Estate+Platform)

## ✨ Caracteristici (Features)

- **Sistem de Clasificare Inteligent**: Terenurile sunt organizate în 4 categorii principale: **Rezidențial**, **Industrial**, **Agricol** și **Pășune**.
- **Filtrare Avansată**: Motor de căutare performant cu filtre după locație (județ), buget, suprafață și tip de hectar.
- **Admin Dashboard**: Panou de control securizat pentru gestionarea listărilor și a lead-urilor.
- **Lead Management**: Sistem integrat de colectare și monitorizare a cererilor de contact de la potențiali cumpărători.
- **Design Premium & Responsive**: Interfață ultra-modernă, optimizată pentru orice dispozitiv (mobile-first), cu micro-animații fluide.
- **Optimizare SEO**: Metadate dinamice, structură semantică și viteză de încărcare optimizată pentru indexare superioară.
- **Management Media**: Galerie de imagini optimizată pentru fiecare proprietate.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15+ (App Router)](https://nextjs.org/)
- **Limbaj**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animații**: Framer Motion / CSS Transitions
- **Iconițe**: [Lucide React](https://lucide.dev/)

### Backend & Database
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via Supabase)
- **Backend-as-a-Service**: [Supabase](https://supabase.com/) (Auth, Database, Storage)
- **Validare**: [Zod](https://zod.dev/) & React Hook Form

## 🚀 Cum se rulează local (How to run locally)

### Pre-cerințe
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) sau [yarn](https://yarnpkg.com/)
- Un cont [Supabase](https://supabase.com/) activ

### Pași pentru instalare

1. **Clonează depozitul:**
   ```bash
   git clone https://github.com/AndreiNeptune/site-realestate-hectare.git
   cd site-realestate-hectare
   ```

2. **Instalează dependențele:**
   ```bash
   cd app
   npm install
   ```

3. **Configurează variabilele de mediu:**
   Creează un fișier `.env.local` în folderul `app/` și adaugă cheile tale Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Pregătește baza de date:**
   Execută scriptul SQL din `supabase/schema.sql` în SQL Editor-ul din dashboard-ul Supabase pentru a crea tabelele și tipurile necesare.

5. **Pornește serverul de dezvoltare:**
   ```bash
   npm run dev
   ```
   Aplicația va fi disponibilă la adresa `http://localhost:3000`.

## 📂 Structura Proiectului

- `/app/src/app`: Rutele Next.js și logica paginilor.
- `/app/src/components`: Componente UI reutilizabile.
- `/app/src/lib`: Utilitare, constante și configurări Supabase.
- `/app/supabase`: Scripturi de migrare a bazei de date.

---

Creat cu ❤️ de [Andrei](https://github.com/AndreiNeptune).
