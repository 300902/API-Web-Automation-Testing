#!/bin/bash

# GitHub Repository Setup Script
# This script helps you create and configure a GitHub repository for your automation project

echo "🚀 GitHub Repository Setup for API and Web UI Automation"
echo "======================================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "⚠️  GitHub CLI is not installed. You'll need to create the repository manually."
    echo "   Install GitHub CLI from: https://cli.github.com/"
    MANUAL_SETUP=true
else
    MANUAL_SETUP=false
fi

# Get repository information
echo ""
echo "📝 Please provide the following information:"
read -p "Repository name (default: api-web-automation): " REPO_NAME
REPO_NAME=${REPO_NAME:-api-web-automation}

read -p "Repository description (default: API and Web UI Automation Testing Suite): " REPO_DESC
REPO_DESC=${REPO_DESC:-"API and Web UI Automation Testing Suite"}

read -p "Make repository public? (y/N): " IS_PUBLIC
if [[ $IS_PUBLIC =~ ^[Yy]$ ]]; then
    VISIBILITY="public"
else
    VISIBILITY="private"
fi

echo ""
echo "📋 Repository Configuration:"
echo "   Name: $REPO_NAME"
echo "   Description: $REPO_DESC"
echo "   Visibility: $VISIBILITY"
echo ""

# Create repository if GitHub CLI is available
if [ "$MANUAL_SETUP" = false ]; then
    echo "🔨 Creating GitHub repository..."
    
    if [ "$VISIBILITY" = "public" ]; then
        gh repo create "$REPO_NAME" --description "$REPO_DESC" --public
    else
        gh repo create "$REPO_NAME" --description "$REPO_DESC" --private
    fi
    
    if [ $? -eq 0 ]; then
        echo "✅ Repository created successfully!"
        REPO_URL="https://github.com/$(gh api user --jq .login)/$REPO_NAME"
        
        # Add remote origin
        git remote add origin "$REPO_URL.git"
        
        # Push to repository
        echo "📤 Pushing code to repository..."
        git push -u origin main
        
        if [ $? -eq 0 ]; then
            echo "✅ Code pushed successfully!"
            echo ""
            echo "🎉 Setup Complete!"
            echo "Repository URL: $REPO_URL"
            echo ""
            echo "Next steps:"
            echo "1. Visit your repository: $REPO_URL"
            echo "2. Go to Settings > Secrets and Variables > Actions"
            echo "3. Add the following secrets if needed:"
            echo "   - DOCKER_USERNAME (for Docker Hub)"
            echo "   - DOCKER_PASSWORD (for Docker Hub)"
            echo "   - API_BASE_URL (your API endpoint)"
            echo "   - WEB_BASE_URL (your web application URL)"
            echo "4. Enable GitHub Actions in your repository"
            echo "5. Push a commit to trigger the first pipeline run"
        else
            echo "❌ Failed to push code. Please check your permissions."
        fi
    else
        echo "❌ Failed to create repository. Please check your GitHub CLI authentication."
        echo "   Run: gh auth login"
        MANUAL_SETUP=true
    fi
fi

# Manual setup instructions
if [ "$MANUAL_SETUP" = true ]; then
    echo ""
    echo "📋 Manual Setup Instructions:"
    echo "============================================"
    echo ""
    echo "1. Create a new repository on GitHub:"
    echo "   - Go to https://github.com/new"
    echo "   - Repository name: $REPO_NAME"
    echo "   - Description: $REPO_DESC"
    echo "   - Visibility: $VISIBILITY"
    echo "   - Initialize with README: No (we already have one)"
    echo "   - Click 'Create repository'"
    echo ""
    echo "2. Add remote origin and push:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/$REPO_NAME.git"
    echo "   git push -u origin main"
    echo ""
    echo "3. Configure GitHub Actions secrets:"
    echo "   - Go to Settings > Secrets and Variables > Actions"
    echo "   - Add these secrets:"
    echo "     • DOCKER_USERNAME (optional, for Docker Hub)"
    echo "     • DOCKER_PASSWORD (optional, for Docker Hub)"
    echo "     • API_BASE_URL (your API endpoint)"
    echo "     • WEB_BASE_URL (your web application URL)"
    echo ""
    echo "4. Enable GitHub Actions and push a commit to trigger the pipeline"
fi

echo ""
echo "📚 Additional Resources:"
echo "• GitHub Actions Documentation: https://docs.github.com/en/actions"
echo "• Playwright Documentation: https://playwright.dev/"
echo "• Jest Documentation: https://jestjs.io/"
echo "• OWASP ZAP Documentation: https://www.zaproxy.org/"
echo ""
echo "🎯 Your automation pipeline includes:"
echo "• API testing with Jest and Supertest"
echo "• Web UI testing with Playwright (Chrome, Firefox, Safari)"
echo "• Security testing with OWASP ZAP"
echo "• Performance testing with K6"
echo "• Docker containerization"
echo "• Comprehensive reporting with artifacts"
echo "• Cross-platform testing support"
echo ""
echo "Happy testing! 🧪"
