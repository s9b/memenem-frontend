# MemeNem Frontend 🚀

A production-ready Next.js frontend for the MemeNem viral meme generator. Create, discover, and share viral memes with AI-powered caption generation and trending templates.

## ✨ Features

- **🎭 Meme Generation**: Create viral memes with AI-powered captions and trending templates
- **🔥 Trending Discovery**: Browse the hottest memes going viral right now
- **📚 Collections**: Save and organize your favorite memes locally
- **🌙 Dark/Light Theme**: Beautiful theme switching with smooth transitions
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **⚡ Fast & Modern**: Built with Next.js 14, TypeScript, and TailwindCSS
- **🎨 Beautiful UI**: Attention-grabbing light-blue accents (#40CFFF) and smooth animations

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: TailwindCSS with custom design system
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode
- **API**: Axios for backend communication
- **State**: React hooks for local state management
- **Storage**: localStorage for collections

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MemeNem backend running on `http://localhost:8000`

### Installation

```bash
# Clone and navigate to directory
cd memenem-frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Environment Variables

Create a `.env.local` file:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── ThemeToggle.tsx # Dark/light theme toggle
│   │   ├── LoadingSpinner.tsx # Loading states
│   │   └── MemeCard.tsx    # Meme display component
│   └── layout/             # Layout components
│       ├── Navigation.tsx  # Main navigation
│       └── Layout.tsx      # Page layout wrapper
├── lib/
│   ├── api.ts             # API client and service
│   └── utils.ts           # Utility functions
├── pages/
│   ├── index.tsx          # Home/Generator page
│   ├── trending.tsx       # Trending memes page
│   ├── collections.tsx    # Saved memes page
│   └── _app.tsx          # App configuration
├── styles/
│   └── globals.css        # Global styles and utilities
└── types/
    └── index.ts           # TypeScript type definitions
```

## 🎨 Design System

### Theme Colors

- **Primary**: `#40CFFF` (Light blue accent)
- **Dark Mode**: Background `#0F111A`, Text `#E0E0E0`
- **Light Mode**: Background `#F5F8FF`, Text `#0F111A`

### Component Categories

- **UI Components**: Reusable interface elements
- **Layout Components**: Page structure and navigation
- **Page Components**: Full page implementations

## 🚀 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## 📱 Pages Overview

### 🏠 Home Page (`/`)
- **Meme Generation Form**: Topic input and humor style selection
- **Generated Meme Display**: Results with sharing and download options
- **How It Works**: Step-by-step process explanation
- **Topic Suggestions**: Inspiration for meme topics

### 🔥 Trending Page (`/trending`)
- **Trending Memes Grid**: Hot memes sorted by virality
- **Filtering & Sorting**: By virality score, upvotes, or recency
- **Real-time Updates**: Auto-refresh every 5 minutes
- **Load More**: Infinite scrolling for more content

### 📚 Collections Page (`/collections`)
- **Local Storage**: Saved memes stored in browser
- **Search & Filter**: Find memes by caption, template, or style
- **Bulk Operations**: Select and delete multiple memes
- **Collection Stats**: Overview of your saved content

## 🎭 Humor Styles

The application supports 5 distinct humor styles:

1. **😏 Sarcastic** - Witty, cynical humor
2. **💀 Gen Z Slang** - Modern internet terminology
3. **😊 Wholesome** - Positive, uplifting content
4. **🖤 Dark Humor** - Edgy but tasteful humor
5. **💼 Corporate Irony** - Business buzzword satire

## 🔧 Key Features

### 🎨 Interactive Meme Cards
- Upvoting with confetti animation
- Social sharing (Twitter, Instagram, LinkedIn)
- Download functionality
- Virality score display
- Template and timestamp information

### 🌙 Theme System
- Smooth theme transitions
- System preference detection
- Persistent theme selection
- Custom color variables

### 📱 Responsive Design
- Mobile-first approach
- Touch-friendly interactions
- Optimized layouts for all screen sizes
- Collapsible navigation menu

### ⚡ Performance
- Optimized images with Next.js Image
- Lazy loading for meme grids
- Efficient state management
- Minimal bundle size

## 🔌 API Integration

The frontend communicates with the MemeNem backend through:

- **Generate Meme**: `POST /api/v1/generate`
- **Get Trending**: `GET /api/v1/trending`
- **Upvote Meme**: `POST /api/v1/upvote`
- **Get Templates**: `GET /api/v1/templates`

### Error Handling
- Rate limit detection and user-friendly messages
- Network error recovery
- Backend unavailability handling
- Form validation and feedback

## 🎯 Production Deployment

### Build Configuration
```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

### Environment Setup
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_SITE_URL=https://your-site-domain.com
```

### Deployment Platforms
- **Vercel**: Optimal for Next.js (recommended)
- **Netlify**: Static site hosting
- **Docker**: Container deployment

## 🔍 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Next.js** - React framework
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **next-themes** - Theme management
- **Vercel** - Deployment platform