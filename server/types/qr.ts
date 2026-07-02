export interface QRStyleConfig {
  dotsType: string
  cornersSquareType: string
  cornersDotType: string
  foregroundColor: string
  backgroundColor: string
  useGradient: boolean
  gradientType?: string
  gradientColor1?: string
  gradientColor2?: string
  gradientRotation?: number
  frameStyle: string
  frameText?: string
  showBranding: boolean
}

export interface QRCode {
  id: string
  userId: string
  shortCode: string
  name: string | null
  destinationUrl: string
  title: string | null
  // JSON config
  styleConfig: QRStyleConfig
  logoUrl: string | null
  // Stats
  scanCount: number
  createdAt: string
  updatedAt: string
  expiresAt: string | null
  isActive: boolean
}

export interface QRScan {
  id: number
  qrCodeId: string
  scannedAt: string
  ip: string | null
  userAgent: string | null
  country: string | null
  city: string | null
  deviceType: string | null
  referer: string | null
}

export interface CreateQRCodeInput {
  name?: string
  destinationUrl: string
  title?: string
  styleConfig?: Partial<QRStyleConfig>
  logoUrl?: string
  showBranding?: boolean
  expiresAt?: string
}

export interface UpdateQRCodeInput {
  name?: string
  destinationUrl?: string
  title?: string
  styleConfig?: Partial<QRStyleConfig>
  logoUrl?: string
  expiresAt?: string
  isActive?: boolean
}
