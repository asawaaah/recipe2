# Create main directories
New-Item -ItemType Directory -Force -Path src/app
New-Item -ItemType Directory -Force -Path src/components
New-Item -ItemType Directory -Force -Path src/components/ui
New-Item -ItemType Directory -Force -Path src/lib
New-Item -ItemType Directory -Force -Path src/hooks
New-Item -ItemType Directory -Force -Path src/styles
New-Item -ItemType Directory -Force -Path src/types
New-Item -ItemType Directory -Force -Path src/utils
New-Item -ItemType Directory -Force -Path src/services
New-Item -ItemType Directory -Force -Path public
New-Item -ItemType Directory -Force -Path public/images

# Create necessary configuration files
New-Item -ItemType File -Force -Path tsconfig.json
New-Item -ItemType File -Force -Path next.config.js
New-Item -ItemType File -Force -Path postcss.config.js
New-Item -ItemType File -Force -Path tailwind.config.js
New-Item -ItemType File -Force -Path .env.local
New-Item -ItemType File -Force -Path src/app/layout.tsx
New-Item -ItemType File -Force -Path src/app/page.tsx
New-Item -ItemType File -Force -Path src/lib/supabase.ts
New-Item -ItemType File -Force -Path src/styles/globals.css 