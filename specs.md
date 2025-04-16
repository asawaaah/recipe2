# Recipe2 Technical Specification

## Project Overview

Recipe2 is a web application designed for managing, sharing, and discovering recipes. The platform allows users to create accounts, add their own recipes, browse recipes from others, and organize their personal cookbook. The target audience includes cooking enthusiasts, home chefs, and anyone interested in discovering and saving recipes.

## Tech Stack

- **Programming Languages**:
  - TypeScript: Core programming language for both frontend and backend
  - JavaScript: Supplementary to TypeScript

- **Frameworks**:
  - Next.js 14.1.0: React framework for building the frontend application with server-side rendering capabilities
  - React 18.2.0: Frontend library for building user interfaces

- **Styling**:
  - Tailwind CSS 3.4.1: Utility-first CSS framework for styling
  - CSS Modules: For component-specific styling

- **Database**:
  - Supabase: PostgreSQL database with built-in authentication and storage features

- **Authentication**:
  - Supabase Auth: Authentication system with Google OAuth integration

- **State Management**:
  - React Query (@tanstack/react-query): For server state management
  - React Context API: For client-side state management

- **UI Components**:
  - Radix UI: Headless UI component library
  - Shadcn UI: Component collection built on top of Radix UI

## Dependencies

### Frontend

- **@supabase/auth-helpers-nextjs (v0.9.0)**: Authentication utilities for Next.js
- **@supabase/ssr (v0.6.1)**: Server-side rendering support for Supabase
- **@supabase/supabase-js (v2.39.7)**: JavaScript client for Supabase
- **@tanstack/react-query (v5.24.1)**: Data fetching and caching library
- **@tanstack/react-query-devtools (v5.24.1)**: Development tools for React Query
- **class-variance-authority (v0.7.1)**: For creating variant styles
- **clsx (v2.1.1)**: Utility for conditionally joining class names
- **date-fns (v3.6.0)**: Date utility library
- **embla-carousel-react (v8.6.0)**: Carousel/slider component
- **framer-motion (v12.7.2)**: Animation library
- **lucide-react (v0.341.0)**: Icon library
- **next-themes (v0.4.6)**: Theme management for Next.js
- **react-day-picker (v8.10.1)**: Date picker component
- **react-hook-form (v7.55.0)**: Form management library
- **sonner (v2.0.3)**: Toast notification library
- **tailwind-merge (v2.6.0)**: Utility for merging Tailwind CSS classes
- **zod (v3.24.2)**: Schema validation library

### Development

- **@tailwindcss/typography (v0.5.10)**: Typography plugin for Tailwind CSS
- **eslint (v8.57.0)**: Linting tool
- **eslint-config-next (v14.1.0)**: ESLint configuration for Next.js
- **prettier (v3.2.5)**: Code formatter
- **prettier-plugin-tailwindcss (v0.5.11)**: Prettier plugin for Tailwind CSS

## Database Architecture & Structure

The database is built on Supabase (PostgreSQL) with the following tables:

- **users**:
  - Fields: id, email, username, avatar_url, created_at, updated_at
  - Purpose: Stores user account information

- **recipes**:
  - Fields: id, title, description, user_id, handle, created_at, updated_at, image_url, cooking_time, servings
  - Purpose: Stores recipe information
  - Relationships: One-to-many with ingredients, instructions, and comments

- **ingredients**:
  - Fields: id, recipe_id, name, amount, unit, created_at, updated_at
  - Purpose: Stores ingredient information for recipes
  - Relationships: Many-to-one with recipes

- **instructions**:
  - Fields: id, recipe_id, step_number, description, created_at, updated_at
  - Purpose: Stores step-by-step instructions for recipes
  - Relationships: Many-to-one with recipes

- **tags**:
  - Fields: id, name, created_at, updated_at
  - Purpose: Categorizes recipes
  - Relationships: Many-to-many with recipes through recipe_tags

- **recipe_tags**:
  - Fields: recipe_id, tag_id, created_at
  - Purpose: Junction table for many-to-many relationship between recipes and tags

- **comments**:
  - Fields: id, recipe_id, user_id, content, created_at, updated_at
  - Purpose: Stores user comments on recipes
  - Relationships: Many-to-one with recipes and users

## Application Architecture

The application follows a modern React application architecture with Next.js:

- **App Router**: Using Next.js 14 app router for routing and navigation
- **Server Components**: Leveraging Next.js server components for improved performance
- **API Routes**: For server-side operations
- **Authentication Flow**: User authentication handled by Supabase with OAuth integration

### Architecture Layers:

1. **Presentation Layer**:
   - React components in `src/components`
   - Page components in `src/app`

2. **Application Layer**:
   - Hooks in `src/hooks`
   - Providers in `src/app/providers.tsx`
   - Form handling with react-hook-form

3. **Domain Layer**:
   - Services in `src/services`
   - Type definitions in `src/types`

4. **Data Access Layer**:
   - Supabase client in `src/lib/supabase.ts`
   - Data fetching and mutation through React Query

5. **Infrastructure Layer**:
   - Next.js configuration
   - Supabase integration
   - Tailwind CSS configuration

## Features and Components

### Core Features:

#### Currently Implemented:

- **User Authentication**: Login/signup via Google OAuth integration
- **Basic Recipe Viewing**: Ability to view existing recipes
- **User Profiles**: Basic user profile functionality with username customization
- **Theme Support**: Light/dark mode switching
- **Responsive UI**: Mobile and desktop responsive interface
- **Navigation**: Basic application navigation with sidebar layout

#### In Development:

- **Recipe Creation & Management** (Partially Implemented):
  - Implemented: Basic recipe data structure and database schema
  - Pending: Complete UI for recipe creation, editing, and deletion workflows

- **Recipe Discovery** (Partially Implemented):
  - Implemented: Basic "All Recipes" page with simple listing
  - Pending: Advanced search functionality, filtering by tags, sorting options

- **Image Upload** (Partially Implemented):
  - Implemented: Basic component for image upload in `ImageUpload.tsx`
  - Pending: Integration with recipe creation flow, image optimization, multiple image support

- **Commenting System** (Planned):
  - Database schema defined
  - Pending: UI components, comment submission, moderation features

- **Tagging System** (Partially Implemented):
  - Implemented: Database schema for tags and recipe-tag relationships
  - Pending: Tag selection UI, tag-based filtering, tag management

- **Personal Cookbook** (Partially Implemented):
  - Implemented: Basic "My Cookbook" route and page structure
  - Pending: Recipe saving functionality, collection organization, favorites

- **Social Sharing** (Planned):
  - Pending: Share buttons, social media integration, link generation

### Key Components:

- **UI Components**: Reusable UI components in `src/components/ui`
- **Layouts**: Page layouts including SidebarLayout in `src/components/layouts`
- **Blocks**: Reusable content blocks in `src/components/blocks`
- **Providers**: React context providers for theme, toast notifications, etc.
- **Image Upload**: Component for handling image uploads in `src/components/ImageUpload.tsx`

## Frontend Details

### Structure:

- **Next.js App Router**: Used for routing and page structure
- **Server Components**: For static parts of the UI
- **Client Components**: For interactive elements
- **Responsive Design**: Using Tailwind CSS for responsive layouts

### User Interface:

- **Theme System**: Light/dark mode with next-themes
- **Component Library**: Shadcn UI built on Radix UI
- **Styling**: Tailwind CSS with custom configuration
- **Animation**: Framer Motion for UI animations
- **Toast Notifications**: Using Sonner for feedback messages
- **Form Handling**: React Hook Form with Zod validation

## Backend Details

### API Structure:

- **Supabase Client**: `createClient()` function for Supabase interactions
- **Server Actions**: Next.js server actions for server-side operations
- **Data Fetching**: React Query for data fetching and caching

### Authentication:

- **OAuth Integration**: Google OAuth for authentication
- **Callback Flow**: Authentication callback handling in `src/app/auth/callback/page.tsx`
- **Session Management**: Supabase session management

### Storage:

- **Image Storage**: Supabase Storage for storing recipe images
- **CDN Integration**: Images served through Supabase CDN (jnuakxuatxrajimebowt.supabase.co)

## Additional Notes

### Code Organization:

- **Folder Structure**: Well-organized folder structure following domain-driven design
- **Type Safety**: Strong TypeScript typing throughout the application
- **Component Architecture**: Follows component-based architecture principles

### Future Considerations:

- **Mobile App**: Potential for developing a mobile application
- **Advanced Search**: Implementing more advanced search and filtering capabilities
- **Social Features**: Expanding social features for recipe sharing 