# CareerPathO Pro — 100% Free Indian Career Discovery (395+ Careers)

A production-ready Next.js 15 career discovery portal for Indian students and parents after Class 10, Class 12, and Graduation. Built with **zero login, zero ads, zero phone calls, 7 Indian languages** (English, Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati), **395+ career roadmaps across 10 Parent Sections**, a **25-Question Career Assessment Calculator**, and live Google Sheets feedback sync.

---

## ✨ What Was Fixed & Optimized for Vercel Production

1. **Removed 9.5 MB of AI Studio Cache & Nested Zip Bloat**:
   - Stripped `.aistudio/` (~2.5 MB of temporary preview PNGs) and `public/assets/aistudio/` (~7 MB of leftover nested `.zip` archives) so your GitHub push and Vercel deployment are fast and lightweight.
2. **Synced `public/data/careers250.json` with `src/data/careers250.json` (395 Careers)**:
   - Updated `public/data/careers250.json` (which previously had 373 entries) to match all 395 verified/audited careers including the 22 Agriculture, Food Tech & Green Sustainability careers.
3. **UI Alignment & Responsive Fixes (Preserving Monochrome Aesthetic)**:
   - **Desktop Navbar Single-Row Alignment (`src/components/Navbar.tsx`)**: Refined desktop navigation link spacing and 7-language pill button sizing (`max-w-[1440px] lg:flex-nowrap`) so the Brand, 7 Navigation Links, `Search ⌘K` button, 7-Language Selector, and Theme Toggle sit cleanly on a single horizontal row without wrapping onto an uneven second line.
   - **3-Column Career Directory Card Header (`src/components/CareersListPage.tsx`)**: Placed the `"Market Estimate (Unverified)"` / `"Govt Source Cited"` badge and `"11 Nov 2026"` audit tag on a dedicated aligned badge row below the title so career titles in the 3-column grid always have full horizontal width and never get crushed to 5 characters.
   - **Balanced 4-Column Salary Grid & Canvas Text Bounds (`src/components/RealityCheckCard.tsx`)**: Balanced the 4-column Salary Reality Check cards (`items-stretch flex-col justify-between`) and bounded HTML5 Canvas `ctx.fillText` width so exported WhatsApp PNG cards never overflow their border frame.
   - **Mobile SVG Radar & Salary Growth Stage Buttons (`src/components/SkillRadarSection.tsx`, `src/components/SalaryGrowthChart.tsx`)**: Expanded the SVG radar `viewBox` (`-20 0 360 310`) so left/right axis labels never clip on mobile screens, and updated the 5-stage selector grid to `grid-cols-2 sm:grid-cols-5` so mobile buttons never truncate salary figures.
4. **Runtime & State Bug Fixes**:
   - **Command Palette (`Cmd+K`) Navigation (`src/components/CommandPaletteModal.tsx`)**: Fixed event propagation inside the modal where `onClick={(e) => e.stopPropagation()}` previously blocked `hashRouter`'s document click listener, wiring both mouse clicks and `Enter` key selection directly to `navigateToHash(...)`.
   - **Career Switch State Isolation (`src/App.tsx`, `src/components/RoadmapProgressTracker.tsx`)**: Added route `key` props to `ChildCareerView`, `ParentCareerView`, and `CategoryView` and isolated `RoadmapProgressTracker` state by `storageKey` so switching between careers never overwrites another career's saved progress in `localStorage`.
   - **Vercel Build Configuration (`tsconfig.json`, `next.config.ts`)**: Excluded `**/*.test.ts` and `src/main.tsx` from Next.js production typechecking and preserved exact `package.json` + `bun.lock` alignment.

---

## 🚀 Step-by-Step GitHub & Vercel Deployment

### Step 1: Extract and Open Terminal Inside the Folder
1. Download and extract `careerpatho-pro-production-ready.zip`.
2. Open **Command Prompt** or **PowerShell** directly inside the extracted folder (where `package.json`, `app/`, and `src/` are located).

### Step 2: Commit and Push to GitHub
Run these commands one by one:
```bash
git init
git branch -M main
git add .
git commit -m "feat: production-ready CareerPathO Pro with UI alignment and Vercel build fixes"
git remote add origin https://github.com/<your-github-username>/<your-repo-name>.git
git push -u origin main --force
```

### Step 3: Deploy on Vercel
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard) and click **Add New... → Project**.
2. Import your GitHub repository.
3. Keep **Framework Preset** as **Next.js** (auto-detected by Vercel).
4. Click **Deploy** — no environment variables are required!
