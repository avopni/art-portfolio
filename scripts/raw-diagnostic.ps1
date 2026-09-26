param(
  [Parameter(Mandatory = $true)][string]$InputImage,
  [Parameter(Mandatory = $true)][string]$OutputImage,
  [int]$LongEdge = 1800,
  [int]$CropX = -1,
  [int]$CropY = -1,
  [int]$CropSize = 1000
)

Add-Type -AssemblyName System.Drawing
$source = [System.Drawing.Image]::FromFile((Resolve-Path $InputImage))
try {
  if ($CropX -ge 0 -and $CropY -ge 0) {
    $rectangle = New-Object System.Drawing.Rectangle($CropX, $CropY, $CropSize, $CropSize)
  } else {
    $rectangle = New-Object System.Drawing.Rectangle(0, 0, $source.Width, $source.Height)
  }
  $scale = [Math]::Min(1.0, [double]$LongEdge / [Math]::Max($rectangle.Width, $rectangle.Height))
  $width = [int][Math]::Round($rectangle.Width * $scale)
  $height = [int][Math]::Round($rectangle.Height * $scale)
  $bitmap = New-Object System.Drawing.Bitmap($width, $height)
  try {
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    try {
      $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $graphics.DrawImage($source, (New-Object System.Drawing.Rectangle(0, 0, $width, $height)), $rectangle, [System.Drawing.GraphicsUnit]::Pixel)
    } finally { $graphics.Dispose() }
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg' | Select-Object -First 1
    $parameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $parameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]92)
    try { $bitmap.Save($OutputImage, $codec, $parameters) } finally { $parameters.Dispose() }
  } finally { $bitmap.Dispose() }
} finally { $source.Dispose() }
