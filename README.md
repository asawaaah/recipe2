# Recipe2 - Modern Recipe Sharing Platform

A sophisticated recipe sharing platform built with cutting-edge web technologies. This application provides a seamless experience for users to create, share, and discover recipes while leveraging modern web development practices and tools.

## 🌟 Features

### User Management
- Secure authentication with email/password and Google OAuth
- User profiles with customizable avatars and preferences
- Role-based access control
- Personal recipe collections and favorites

### Recipe Management
- Create, edit, and delete recipes with rich text formatting
- Structured recipe information:
  - Ingredients with precise measurements
  - Step-by-step cooking instructions
  - Cooking time and difficulty level
  - Serving size calculator
  - Nutritional information
- Recipe categorization with tags
- Search and filter recipes by various criteria
- Recipe sharing and social features

### UI/UX Features
- Responsive design that works on all devices
- Dark/Light theme support
- Modern and clean interface using shadcn/ui components
- Real-time updates for collaborative features
- Toast notifications for user feedback
- Intuitive navigation with sidebar and dropdown menus
- Loading states and error handling
- Accessibility compliance

### Technical Features
- Server-side rendering with Next.js 14
- Type-safe development with TypeScript
- Real-time data synchronization
- Form validation with Zod
- Optimistic updates for better UX
- Image upload and processing
- API rate limiting and security measures

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:**
  - Tailwind CSS for utility-first styling
  - CSS Modules for component-specific styles
  - CSS Variables for theming
- **State Management:**
  - React Query for server state
  - React Context for global state
- **UI Components:**
  - shadcn/ui component library
  - Radix UI for accessible primitives
  - Lucide React for icons
- **Forms and Validation:**
  - React Hook Form
  - Zod schema validation
- **Date Handling:** date-fns
- **Notifications:** Sonner

### Backend (Supabase)
- **Database:** PostgreSQL
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **Real-time:** Supabase Realtime
- **Security:** Row Level Security (RLS)

### Development Tools
- **Linting:** ESLint
- **Formatting:** Prettier
- **Type Checking:** TypeScript
- **Package Management:** npm

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages and layouts
│   ├── (auth)/            # Authentication related pages
│   ├── my-cookbook/       # User's personal recipe collection
│   ├── recipes/           # Recipe related pages
│   └── layout.tsx         # Root layout with providers
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   │   ├── sidebar/      # Navigation sidebar components
│   │   └── ...          # Other UI components
│   ├── forms/            # Form-related components
│   ├── recipes/          # Recipe-specific components
│   └── shared/           # Shared components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries and configurations
│   ├── supabase/        # Supabase client and utilities
│   └── validators/      # Zod schemas and validators
├── services/            # API and external service integrations
├── styles/              # Global styles and Tailwind config
├── types/               # TypeScript type definitions
└── utils/               # Helper functions and utilities
```

## 🗄️ Database Schema

### Core Tables
- **users**
  - id (UUID, primary key)
  - email (string, unique)
  - full_name (string)
  - avatar_url (string)
  - created_at (timestamp)

- **recipes**
  - id (UUID, primary key)
  - title (string)
  - description (text)
  - user_id (UUID, foreign key)
  - cooking_time (integer)
  - difficulty (enum)
  - servings (integer)
  - created_at (timestamp)
  - updated_at (timestamp)

- **ingredients**
  - id (UUID, primary key)
  - recipe_id (UUID, foreign key)
  - name (string)
  - amount (decimal)
  - unit (string)
  - order (integer)

- **instructions**
  - id (UUID, primary key)
  - recipe_id (UUID, foreign key)
  - step_number (integer)
  - content (text)

### Supporting Tables
- **tags**
- **recipe_tags**
- **comments**
- **favorites**
- **user_settings**

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or later
- npm 9.0 or later
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/recipe2.git
   cd recipe2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🚢 Deployment

The application is configured for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

## 🔒 Security

- All database access is controlled through RLS policies
- Authentication tokens are handled securely
- API rate limiting is implemented
- Input validation on both client and server
- Secure password hashing
- CORS policies are properly configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/) 