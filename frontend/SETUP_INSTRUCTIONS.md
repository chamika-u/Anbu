# Anbu Frontend Setup Instructions

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies

```bash
cd frontend
npm install
```

This will install all required dependencies including:
- React & React DOM
- Vite (build tool)
- TailwindCSS (styling)
- Axios (HTTP client)
- React Markdown (markdown rendering)
- TypeScript

### 2. Configure Environment Variables

Create a `.env` file in the `frontend` directory:

```bash
# Create .env file
touch .env
```

Add the following configuration:

```env
VITE_API_URL=http://localhost:5000
```

**Note:** Update `VITE_API_URL` to point to your backend API URL. For production, this should be your deployed backend URL.

### 3. Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### 5. Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── RepositoryInput.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── DocumentationViewer.tsx
│   ├── services/        # API services
│   │   └── api.ts
│   ├── App.tsx          # Main application component
│   ├── App.css          # Application styles
│   ├── index.css        # Global styles with Tailwind
│   └── main.tsx         # Application entry point
├── index.html           # HTML template
├── package.json         # Dependencies
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features

### 1. Repository Analysis
- Input GitHub repository URL
- Validate URL format
- Submit for AI analysis

### 2. Documentation Viewer
- Render Markdown documentation
- Display repository metadata
- Show tech stack badges
- Download documentation as .md file
- Share documentation via URL

### 3. Loading States
- Progress indicators during analysis
- Real-time status messages
- Smooth animations

### 4. Error Handling
- User-friendly error messages
- Input validation
- Network error handling

### 5. Responsive Design
- Mobile-friendly interface
- Tablet optimization
- Desktop layout

## Styling

The application uses:
- **TailwindCSS** for utility-first styling
- **IBM Design Colors** for branding
- **Custom CSS** for animations and special effects

### Color Palette

- Primary (IBM Blue): `#0f62fe`
- Secondary (Teal): `#00bfa5`
- Accent (Purple): `#8a3ffc`
- Text (Dark Gray): `#161616`
- Background (Light Gray): `#f4f4f4`

## API Integration

The frontend communicates with the backend via REST API:

### Endpoints Used

1. **POST /api/analyze**
   - Analyze GitHub repository
   - Generate documentation

2. **GET /api/health**
   - Check backend health status

3. **POST /api/chat** (optional)
   - Chat with AI assistant

4. **POST /api/documents/upload** (optional)
   - Upload documents

## Troubleshooting

### Port Already in Use

If port 5173 is already in use:

```bash
# Kill the process using the port (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- --port 3000
```

### Dependencies Installation Issues

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Build Errors

```bash
# Clear build cache
rm -rf dist
npm run build
```

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel --prod
```

3. Set environment variables in Vercel dashboard:
   - `VITE_API_URL` = Your backend API URL

### Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to Netlify

3. Set environment variables:
   - `VITE_API_URL` = Your backend API URL

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Upload the `dist` folder to your web server

3. Configure your web server to serve the `index.html` for all routes (SPA routing)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- Code splitting with Vite
- Lazy loading of components
- Optimized images
- Minified CSS and JS
- Tree shaking

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators
- Screen reader support

## Contributing

1. Follow the existing code style
2. Use TypeScript for type safety
3. Write meaningful component names
4. Add comments for complex logic
5. Test on multiple browsers

## License

MIT License - See LICENSE file for details

---

**Built with ❤️ (Anbu) for developers, by developers**