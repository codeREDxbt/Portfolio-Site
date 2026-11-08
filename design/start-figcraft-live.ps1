$ErrorActionPreference = 'Stop'

$figcraft = 'X:\craft\FigCraft\figcraft.exe'
$port = 7979
$root = 'D:\Portfolio-Site-main'

$existing = Get-Process -Name 'figcraft' -ErrorAction SilentlyContinue
if ($existing) {
  Write-Host "FigCraft is already running (PID $($existing.Id -join ', '))."
  Write-Host "If live control does not respond, close FigCraft and run this script again."
  exit 0
}

Start-Process -FilePath $figcraft -ArgumentList @(
  '--control', "$port",
  '--automation-read-root', $root,
  '--automation-write-root', $root
)

Write-Host "FigCraft live control started on 127.0.0.1:$port"
Write-Host 'Keep the FigCraft window open while the agent designs.'
