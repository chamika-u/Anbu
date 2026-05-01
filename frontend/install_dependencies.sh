#!/bin/bash

# Anbu Frontend - Dependency Installation Script (Bash)
# This script installs all required npm packages for the frontend

echo "========================================"
echo "  Anbu Frontend - Installing Dependencies"
echo "========================================"
echo ""

# Check if Node.js is installed
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi
echo "Node.js version: $(node --version)"
echo ""

# Check if npm is installed
echo "Checking npm installation..."
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed!"
    exit 1
fi
echo "npm version: $(npm --version)"
echo ""

# Navigate to script directory
cd "$(dirname "$0")"

# Clean install
echo "Cleaning previous installations..."
if [ -d "node_modules" ]; then
    rm -rf node_modules
    echo "Removed node_modules directory"
fi
if [ -f "package-lock.json" ]; then
    rm -f package-lock.json
    echo "Removed package-lock.json"
fi
echo ""

# Install dependencies
echo "Installing npm packages..."
echo "This may take a few minutes..."
echo ""

npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Failed to install dependencies!"
    echo "Please check the error messages above."
    exit 1
fi

echo ""
echo "========================================"
echo "  Installation Complete!"
echo "========================================"
echo ""
echo "Installed packages:"
echo "  - React & React DOM"
echo "  - Vite (build tool)"
echo "  - TailwindCSS (styling)"
echo "  - Axios (HTTP client)"
echo "  - React Markdown (markdown rendering)"
echo "  - TypeScript"
echo ""
echo "Next steps:"
echo "  1. Create a .env file with: VITE_API_URL=http://localhost:5000"
echo "  2. Run 'npm run dev' to start the development server"
echo "  3. Open http://localhost:5173 in your browser"
echo ""
echo "Happy coding! 🚀"

# Made with Bob
