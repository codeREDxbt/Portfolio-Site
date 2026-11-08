# Deploy the Next.js portfolio to Vercel through the connected Git repository.

$ErrorActionPreference = 'Stop'

if (-not (Test-Path .git)) {
  Write-Host 'Error: run this script from the repository root.' -ForegroundColor Red
  exit 1
}

Write-Host 'Running validation before deployment...' -ForegroundColor Cyan
npm run lint
npm run typecheck
npm test
npm run build

Write-Host ''
Write-Host 'Validation passed. Current changes:' -ForegroundColor Green
git status --short

$confirm = Read-Host 'Commit and push these changes to deploy? (y/n)'
if ($confirm -ne 'y') {
  Write-Host 'Deployment cancelled.' -ForegroundColor Yellow
  exit 0
}

$message = Read-Host 'Commit message'
if ([string]::IsNullOrWhiteSpace($message)) {
  $message = 'Deploy portfolio update'
}

git add .
git commit -m $message
git push origin main

Write-Host 'Deployment pushed. Vercel will build the connected project.' -ForegroundColor Green
