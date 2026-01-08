# Quick Deployment Script for Vercel
# Run this script to deploy security updates to your live site

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deploying Security Updates to Vercel" -ForegroundColor Cyan
Write-Host "  Site: coderedxbt.vercel.app" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "Error: Not a git repository!" -ForegroundColor Red
    Write-Host "Please run 'git init' first." -ForegroundColor Yellow
    exit 1
}

# Show status
Write-Host "Checking git status..." -ForegroundColor Yellow
git status --short

Write-Host ""
Write-Host "Files to be committed:" -ForegroundColor Green
Write-Host "  - api/ (5 serverless functions)" -ForegroundColor White
Write-Host "  - vercel.json (Vercel configuration)" -ForegroundColor White
Write-Host "  - script.js (updated API calls)" -ForegroundColor White
Write-Host "  - Documentation files" -ForegroundColor White
Write-Host ""

# Confirm deployment
$confirm = Read-Host "Deploy these changes to Vercel? (y/n)"
if ($confirm -ne "y") {
    Write-Host "Deployment cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Step 1: Adding files to git..." -ForegroundColor Yellow
git add .

Write-Host "Step 2: Committing changes..." -ForegroundColor Yellow
git commit -m "Add security: rate limiting, input validation, serverless API protection"

Write-Host "Step 3: Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Deployment Initiated!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Vercel will automatically deploy your changes." -ForegroundColor White
Write-Host "This usually takes 30-60 seconds." -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Wait for deployment to complete" -ForegroundColor White
Write-Host "  2. Check Vercel dashboard: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "  3. Test your site: https://coderedxbt.vercel.app" -ForegroundColor White
Write-Host ""
Write-Host "Test commands:" -ForegroundColor Cyan
Write-Host '  curl https://coderedxbt.vercel.app/api/health' -ForegroundColor Gray
Write-Host '  curl "https://coderedxbt.vercel.app/api/github-contributions?username=codeREDxbt"' -ForegroundColor Gray
Write-Host ""
Write-Host "Need help? Read VERCEL_DEPLOYMENT.md" -ForegroundColor Yellow
Write-Host ""
