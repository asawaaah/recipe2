# Recipe App

A modern recipe sharing platform built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- User authentication (email/password and Google OAuth)
- Create, read, update, and delete recipes
- Add ingredients and instructions to recipes
- Tag recipes for easy categorization
- Comment on recipes
- Modern, responsive UI with dark mode support
- Real-time updates using Supabase

## Tech Stack

- **Frontend:**
  - Next.js 14 (React)
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components
  - React Query for data fetching
  - React Hook Form for form handling
  - Zod for validation

- **Backend:**
  - Supabase (Backend-as-a-Service)
  - PostgreSQL Database
  - Row Level Security (RLS) policies
  - Real-time subscriptions
  - File storage for images

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your Supabase credentials
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/             # Next.js app router pages and layouts
├── components/      # React components
│   └── ui/         # Reusable UI components
├── lib/            # Utility libraries and configurations
├── hooks/          # Custom React hooks
├── styles/         # Global styles and Tailwind configuration
├── types/          # TypeScript type definitions
└── utils/          # Helper functions and utilities
```

## Database Schema

- **users:** User profiles and authentication
- **recipes:** Recipe details and metadata
- **ingredients:** Recipe ingredients with amounts and units
- **instructions:** Step-by-step recipe instructions
- **tags:** Recipe categories and tags
- **recipe_tags:** Junction table for recipe-tag relationships
- **comments:** User comments on recipes

## Deployment

The application is configured for deployment on Vercel with automatic CI/CD. 