# CRM Web Application

A modern React-based CRM application with features like user authentication, data management, and role-based access control.

## Features

- User authentication and authorization
- Protected routes
- Modern UI with Mantine components
- Data fetching with React Query
- Form handling with Mantine Form
- State management with Zustand
- TypeScript support

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router DOM
- Mantine UI
- React Query
- Zustand
- Axios

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following content:
   ```
   VITE_API_BASE_URL=http://localhost:3000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── features/       # Feature-specific components and logic
  ├── pages/         # Page components
  ├── services/      # API services
  ├── store/         # State management
  ├── utils/         # Utility functions
  ├── hooks/         # Custom hooks
  ├── types/         # TypeScript types
  ├── layouts/       # Layout components
  └── assets/        # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
