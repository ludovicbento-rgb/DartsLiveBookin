Add-Type -AssemblyName System.Drawing

$sourcePath = Resolve-Path "public/branding/logos/dartslive-bookin.png"
$outputDir = "public/icons"

New-Item -ItemType Directory -Force $outputDir | Out-Null

$source = [System.Drawing.Image]::FromFile($sourcePath)

function New-PwaIcon {

    param (
        [int]$Size,
        [string]$OutputPath,
        [double]$Scale = 0.82
    )

    $bitmap = New-Object System.Drawing.Bitmap($Size, $Size)

    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)

    $graphics.Clear(
        [System.Drawing.Color]::White
    )

    $graphics.InterpolationMode =
        [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    $graphics.SmoothingMode =
        [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

    $graphics.PixelOffsetMode =
        [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $maxWidth =
        [int]($Size * $Scale)

    $maxHeight =
        [int]($Size * $Scale)

    $ratio =
        [Math]::Min(
            $maxWidth / $source.Width,
            $maxHeight / $source.Height
        )

    $width =
        [int]($source.Width * $ratio)

    $height =
        [int]($source.Height * $ratio)

    $x =
        [int](($Size - $width) / 2)

    $y =
        [int](($Size - $height) / 2)

    $graphics.DrawImage(
        $source,
        $x,
        $y,
        $width,
        $height
    )

    $bitmap.Save(
        $OutputPath,
        [System.Drawing.Imaging.ImageFormat]::Png
    )

    $graphics.Dispose()
    $bitmap.Dispose()
}

New-PwaIcon `
    -Size 192 `
    -OutputPath "$outputDir/pwa-192x192.png" `
    -Scale 0.82

New-PwaIcon `
    -Size 512 `
    -OutputPath "$outputDir/pwa-512x512.png" `
    -Scale 0.82

New-PwaIcon `
    -Size 512 `
    -OutputPath "$outputDir/pwa-maskable-512x512.png" `
    -Scale 0.65

New-PwaIcon `
    -Size 180 `
    -OutputPath "$outputDir/apple-touch-icon.png" `
    -Scale 0.82

$source.Dispose()

Write-Host "PWA icons generated successfully."