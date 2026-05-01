#!/bin/bash

# Anbu Backend Dependencies Installation Script
# This script installs all required Python packages for the Anbu backend

echo "========================================"
echo "Anbu Backend Dependencies Installation"
echo "========================================"
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Virtual environment not found. Creating one..."
    python3 -m venv venv
    echo "Virtual environment created successfully!"
else
    echo "Virtual environment found."
fi

echo ""
echo "Activating virtual environment..."
source venv/bin/activate

echo ""
echo "Upgrading pip..."
python -m pip install --upgrade pip

echo ""
echo "Installing dependencies from requirements.txt..."
echo "This may take a few minutes..."

# Install with trusted hosts to avoid SSL issues
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org -r requirements.txt

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "Installation completed successfully!"
    echo "========================================"
    echo ""
    echo "Next steps:"
    echo "1. Copy config_template.txt to .env"
    echo "2. Add your IBM Cloud credentials to .env"
    echo "3. Run: python run.py"
else
    echo ""
    echo "========================================"
    echo "Installation failed!"
    echo "========================================"
    echo ""
    echo "Please check the error messages above."
fi

# Made with Bob
