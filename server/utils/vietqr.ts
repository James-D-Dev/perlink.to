/**
 * VietQR Generator - TypeScript implementation
 * Based on EMVCo QR standards for Vietnam bank transfers
 */

// Bank data from bank-data.txt
export interface Bank {
  BIN: string
  Name: string
  ShortName: string
  Code: string
  SWIFTCode: string
  AndroidBundle: string
}

// VNBankM map - Vietnamese banks by BIN
export const VNBankM: Record<string, Bank> = {
  '970400': { BIN: '970400', Name: 'TMCP Sài Gòn Công thương', ShortName: 'SaigonBank', Code: 'SGICB', SWIFTCode: 'SBITVNVX', AndroidBundle: '' },
  '970403': { BIN: '970403', Name: 'TMCP Sài Gòn Thương tín', ShortName: 'Sacombank', Code: 'STP', SWIFTCode: 'SGTTVNVX', AndroidBundle: '' },
  '970405': { BIN: '970405', Name: 'Nông nghiệp và Phát triển Nông thôn Việt Nam', ShortName: 'Agribank', Code: 'VBA', SWIFTCode: 'VBAAVNVX', AndroidBundle: '' },
  '970406': { BIN: '970406', Name: 'TMCP Đông Á', ShortName: 'DongABank', Code: 'DOB', SWIFTCode: 'EACBVNVX', AndroidBundle: '' },
  '970407': { BIN: '970407', Name: 'TMCP Kỹ thương', ShortName: 'Techcombank', Code: 'TCB', SWIFTCode: 'VTCBVNVX', AndroidBundle: '' },
  '970408': { BIN: '970408', Name: 'Thương mại TNHH MTV Dầu Khí Toàn Cầu', ShortName: 'GPBank', Code: 'GPB', SWIFTCode: 'GBNKVNVX', AndroidBundle: '' },
  '970409': { BIN: '970409', Name: 'TMCP Bắc Á', ShortName: 'BacABank', Code: 'BAB', SWIFTCode: 'NASCVNVX', AndroidBundle: '' },
  '970410': { BIN: '970410', Name: 'TNHH MTV Standard Chartered', ShortName: 'StandardChartered', Code: 'SCVN', SWIFTCode: 'SCBLVNVX', AndroidBundle: '' },
  '970412': { BIN: '970412', Name: 'TMCP Đại chúng Việt Nam', ShortName: 'PVcomBank', Code: 'PVCB', SWIFTCode: 'WBVNVNVX', AndroidBundle: '' },
  '970414': { BIN: '970414', Name: 'TNHH MTV Đại Dương', ShortName: 'Oceanbank', Code: 'Oceanbank', SWIFTCode: 'OCBKUS3M', AndroidBundle: '' },
  '970415': { BIN: '970415', Name: 'TMCP Công thương Việt Nam', ShortName: 'VietinBank', Code: 'ICB', SWIFTCode: 'ICBVVNVX', AndroidBundle: '' },
  '970416': { BIN: '970416', Name: 'TMCP Á Châu', ShortName: 'ACB', Code: 'ACB', SWIFTCode: 'ASCBVNVX', AndroidBundle: '' },
  '970418': { BIN: '970418', Name: 'Đầu tư và Phát triển Việt Nam', ShortName: 'BIDV', Code: 'BIDV', SWIFTCode: 'BIDVVNVX', AndroidBundle: 'com.vnpay.bidv' },
  '970419': { BIN: '970419', Name: 'TMCP Quốc dân', ShortName: 'NCB', Code: 'NCB', SWIFTCode: 'NVBAVNVX', AndroidBundle: '' },
  '970421': { BIN: '970421', Name: 'liên doanh Việt Nga', ShortName: 'VRBank', Code: 'VRB', SWIFTCode: 'VRBAVNVX', AndroidBundle: '' },
  '970422': { BIN: '970422', Name: 'TMCP Quân Đội', ShortName: 'MBBank', Code: 'MB', SWIFTCode: 'MSCBVNVX', AndroidBundle: '' },
  '970423': { BIN: '970423', Name: 'TMCP Tiên Phong', ShortName: 'TPBank', Code: 'TPB', SWIFTCode: 'TPBVVNVX', AndroidBundle: 'com.tpb.mb.gprsandroid' },
  '970424': { BIN: '970424', Name: 'TNHH MTV Shinhan Việt Nam', ShortName: 'ShinhanBank', Code: 'SHBVN', SWIFTCode: 'SHBKVNVX', AndroidBundle: '' },
  '970425': { BIN: '970425', Name: 'TMCP An Bình', ShortName: 'ABBank', Code: 'ABB', SWIFTCode: 'ABBKVNVX', AndroidBundle: '' },
  '970426': { BIN: '970426', Name: 'TMCP Hàng Hải', ShortName: 'MSB', Code: 'MSB', SWIFTCode: 'MCOBVNVX', AndroidBundle: '' },
  '970427': { BIN: '970427', Name: 'TMCP Việt Á', ShortName: 'VietABank', Code: 'VAB', SWIFTCode: 'VNACVNVX', AndroidBundle: '' },
  '970428': { BIN: '970428', Name: 'TMCP Nam Á', ShortName: 'NamABank', Code: 'NAB', SWIFTCode: 'NAMAVNVX', AndroidBundle: '' },
  '970429': { BIN: '970429', Name: 'TMCP Sài Gòn', ShortName: 'SCB', Code: 'SCB', SWIFTCode: 'SACLVNVX', AndroidBundle: '' },
  '970430': { BIN: '970430', Name: 'TMCP Xăng dầu Petrolimex', ShortName: 'PGBank', Code: 'PGB', SWIFTCode: 'PGBLVNVX', AndroidBundle: '' },
  '970431': { BIN: '970431', Name: 'TMCP Xuất Nhập khẩu Việt Nam', ShortName: 'Eximbank', Code: 'EIB', SWIFTCode: 'EBVIVNVX', AndroidBundle: '' },
  '970432': { BIN: '970432', Name: 'TMCP Việt Nam Thịnh Vượng', ShortName: 'VPBank', Code: 'VPB', SWIFTCode: 'VPBKVNVX', AndroidBundle: '' },
  '970433': { BIN: '970433', Name: 'TMCP Việt Nam Thương Tín', ShortName: 'VietBank', Code: 'VIETBANK', SWIFTCode: 'VNTTVNVX', AndroidBundle: '' },
  '970434': { BIN: '970434', Name: 'TNHH Indovina', ShortName: 'IndovinaBank', Code: 'IVB', SWIFTCode: 'IABBVNVX', AndroidBundle: '' },
  '970436': { BIN: '970436', Name: 'TMCP Ngoại thương Việt Nam', ShortName: 'Vietcombank', Code: 'VCB', SWIFTCode: 'BFTVVNVX', AndroidBundle: '' },
  '970437': { BIN: '970437', Name: 'TMCP Phát triển TP.HCM', ShortName: 'HDBank', Code: 'HDB', SWIFTCode: 'HDBCVNVX', AndroidBundle: '' },
  '970438': { BIN: '970438', Name: 'TMCP Bảo Việt', ShortName: 'BaoVietBank', Code: 'BVB', SWIFTCode: 'BVBVVNVX', AndroidBundle: '' },
  '970439': { BIN: '970439', Name: 'liên doanh VID PUBLIC BANK', ShortName: 'PublicBank', Code: 'PBVN', SWIFTCode: 'VIDPVNVX', AndroidBundle: '' },
  '970440': { BIN: '970440', Name: 'TMCP Đông Nam Á', ShortName: 'SeABank', Code: 'SEAB', SWIFTCode: 'SEAVVNVX', AndroidBundle: '' },
  '970441': { BIN: '970441', Name: 'TMCP Quốc Tế Việt Nam', ShortName: 'VIB', Code: 'VIB', SWIFTCode: 'VNIBVNVX', AndroidBundle: '' },
  '970442': { BIN: '970442', Name: 'TNHH MTV Hong Leong Việt Nam', ShortName: 'HongLeong', Code: 'HLBVN', SWIFTCode: 'HLBBVNVX', AndroidBundle: '' },
  '970443': { BIN: '970443', Name: 'TMCP Sài Gòn – Hà Nội', ShortName: 'SHB', Code: 'SHB', SWIFTCode: 'SHBAVNVX', AndroidBundle: '' },
  '970444': { BIN: '970444', Name: 'Thương mại TNHH MTV Xây dựng Việt Nam', ShortName: 'CBBank', Code: 'CBB', SWIFTCode: 'GTBAVNVX', AndroidBundle: '' },
  '970446': { BIN: '970446', Name: 'Hợp tác xã Việt Nam', ShortName: 'COOPBANK', Code: 'COOPBANK', SWIFTCode: '', AndroidBundle: '' },
  '970448': { BIN: '970448', Name: 'TMCP Phương Đông', ShortName: 'OCB', Code: 'OCB', SWIFTCode: 'ORCOVNVX', AndroidBundle: '' },
  '970449': { BIN: '970449', Name: 'TMCP Bưu điện Liên Việt (Ngân hàng TMCP Lộc Phát Việt Nam)', ShortName: 'LPBank', Code: 'LPB', SWIFTCode: 'LVBKVNVX', AndroidBundle: '' },
  '970452': { BIN: '970452', Name: 'TMCP Kiên Long', ShortName: 'KienLongBank', Code: 'KLB', SWIFTCode: 'KLBKVNVX', AndroidBundle: '' },
  '970454': { BIN: '970454', Name: 'TMCP Bản Việt', ShortName: 'VietCapitalBank', Code: 'VCCB', SWIFTCode: 'VCBCVNVX', AndroidBundle: '' },
  '970455': { BIN: '970455', Name: 'Công nghiệp Hàn Quốc - Chi nhánh Hà Nội', ShortName: 'IBKHN', Code: 'IBKHN', SWIFTCode: 'IBKOVNVX', AndroidBundle: '' },
  '970456': { BIN: '970456', Name: 'Industrial Bank of Korea - Chi nhánh Hồ Chí Minh', ShortName: 'IBKHCM', Code: 'IBKHCM', SWIFTCode: 'IBKOVNVX', AndroidBundle: '' },
  '970457': { BIN: '970457', Name: 'Ngân hàng TNHH Một Thành Viên Woori Bank Việt Nam', ShortName: 'Woori', Code: 'WVN', SWIFTCode: 'HVBKVNVX', AndroidBundle: '' },
  '970458': { BIN: '970458', Name: 'Ngân hàng TNHH Một Thành Viên UOB Việt Nam', ShortName: 'UnitedOverseas', Code: 'UOB', SWIFTCode: 'UOVBVNVX', AndroidBundle: '' },
  '970459': { BIN: '970459', Name: 'Ngân hàng TNHH Một Thành Viên CIMB Việt Nam', ShortName: 'CIMBBank', Code: 'CIMB', SWIFTCode: 'CIBBVNVN', AndroidBundle: '' },
  '970460': { BIN: '970460', Name: 'Công ty Tài chính cổ phần Xi Măng', ShortName: 'Vietcredit', Code: 'Vietcredit', SWIFTCode: '', AndroidBundle: '' },
  '970462': { BIN: '970462', Name: 'Ngân hàng Kookmin - Chi nhánh Hà Nội', ShortName: 'KookminHN', Code: 'KBHN', SWIFTCode: 'CZNBVN2X', AndroidBundle: '' },
  '970463': { BIN: '970463', Name: 'Ngân hàng Kookmin - Chi nhánh Tp. Hồ Chí Minh', ShortName: 'KookminHCM', Code: 'KBHCM', SWIFTCode: 'CZNBVNVX', AndroidBundle: '' },
  '970464': { BIN: '970464', Name: 'Công ty Tài chính TNHH MTV CỘNG ĐỒNG (TNHH MTV TNEX)', ShortName: 'TNEXFinance', Code: 'FCCOM', SWIFTCode: '', AndroidBundle: '' },
  '970465': { BIN: '970465', Name: 'Ngân hàng SINOPAC - Chi nhánh Tp. Hồ Chí Minh', ShortName: 'SINOPAC', Code: 'SINOPAC', SWIFTCode: 'SINOVNVX', AndroidBundle: '' },
  '970466': { BIN: '970466', Name: 'Ngân hàng KEB HANA - Chi nhánh Tp. Hồ Chí Minh', ShortName: 'KEBHanaHCM', Code: 'KEBHANAHCM', SWIFTCode: 'KOEXVN2X', AndroidBundle: '' },
  '970467': { BIN: '970467', Name: 'Ngân hàng KEB HANA - Chi nhánh Hà Nội', ShortName: 'KEBHANAHN', Code: 'KEBHANAHN', SWIFTCode: 'KOEXVNVX', AndroidBundle: '' },
  '970468': { BIN: '970468', Name: 'Công ty Tài chính TNHH MTV Mirae Asset (Việt Nam)', ShortName: 'MAFC', Code: 'MAFC', SWIFTCode: '', AndroidBundle: '' },
  '970470': { BIN: '970470', Name: 'Công ty Tài chính TNHH MB SHINSEI', ShortName: 'MCredit', Code: 'MCredit', SWIFTCode: '', AndroidBundle: '' },
}

// Country codes
const CountryCodeM: Record<string, string> = {
  VN: 'Viet Nam',
  JP: 'Japan',
  KR: 'Korea',
  MY: 'Malaysia',
  RC: 'China',
  RI: 'Indonesia',
  RP: 'Philippines',
  SG: 'Singapore',
  TH: 'Thailand',
}

// Currency codes
const CurrencyM: Record<string, string> = {
  VND: '704',
  JPY: '392',
  KRW: '410',
  MYR: '458',
  CNY: '156',
  IDR: '360',
  PHP: '608',
  SGD: '702',
  THB: '764',
}

// Vietnamese character mapping
const VNMAP: Record<string, string> = {
  'ạ': 'a', 'ả': 'a', 'ã': 'a', 'à': 'a', 'á': 'a', 'â': 'a', 'ậ': 'a', 'ầ': 'a', 'ấ': 'a',
  'ẩ': 'a', 'ẫ': 'a', 'ă': 'a', 'ắ': 'a', 'ằ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
  'ó': 'o', 'ò': 'o', 'ọ': 'o', 'õ': 'o', 'ỏ': 'o', 'ô': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o',
  'ồ': 'o', 'ố': 'o', 'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
  'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẹ': 'e', 'ẽ': 'e', 'ê': 'e', 'ế': 'e', 'ề': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
  'ú': 'u', 'ù': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u', 'ư': 'u', 'ự': 'u', 'ữ': 'u', 'ử': 'u', 'ừ': 'u', 'ứ': 'u',
  'í': 'i', 'ì': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
  'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỵ': 'y', 'ỹ': 'y',
  'đ': 'd',
  'Ạ': 'A', 'Ả': 'A', 'Ã': 'A', 'À': 'A', 'Á': 'A', 'Â': 'A', 'Ậ': 'A', 'Ầ': 'A', 'Ấ': 'A',
  'Ẩ': 'A', 'Ẫ': 'A', 'Ă': 'A', 'Ắ': 'A', 'Ằ': 'A', 'Ặ': 'A', 'Ẳ': 'A', 'Ẵ': 'A',
  'Ó': 'O', 'Ò': 'O', 'Ọ': 'O', 'Õ': 'O', 'Ỏ': 'O', 'Ô': 'O', 'Ộ': 'O', 'Ổ': 'O', 'Ỗ': 'O',
  'Ồ': 'O', 'Ố': 'O', 'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ở': 'O', 'Ỡ': 'O',
  'É': 'E', 'È': 'E', 'Ẻ': 'E', 'Ẹ': 'E', 'Ẽ': 'E', 'Ê': 'E', 'Ế': 'E', 'Ề': 'E', 'Ệ': 'E', 'Ể': 'E', 'Ễ': 'E',
  'Ú': 'U', 'Ù': 'U', 'Ụ': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ư': 'U', 'Ự': 'U', 'Ữ': 'U', 'Ử': 'U', 'Ừ': 'U', 'Ứ': 'U',
  'Í': 'I', 'Ì': 'I', 'Ị': 'I', 'Ỉ': 'I', 'Ĩ': 'I',
  'Ý': 'Y', 'Ỳ': 'Y', 'Ỷ': 'Y', 'Ỵ': 'Y', 'Ỹ': 'Y',
  'Đ': 'D',
}

// Convert text to ASCII, removing Vietnamese diacritics
function toAscii(text: string): string {
  return text
    .split('')
    .map((char) => {
      if (char.charCodeAt(0) <= 127) return char
      return VNMAP[char] || ''
    })
    .join('')
}

// CRC table initialization
const CRC_TABLE: number[] = []
const CRC_INIT = 0xFFFF
const CRC_POLY = 0x1021

function initCrcTable(): void {
  if (CRC_TABLE.length > 0) return
  for (let n = 0; n < 256; n++) {
    let crc = n << 8
    for (let i = 0; i < 8; i++) {
      const bit = (crc & 0x8000) !== 0
      crc <<= 1
      if (bit) crc ^= CRC_POLY
    }
    CRC_TABLE[n] = crc & 0xFFFF
  }
}

// Calculate CRC checksum
function crcChecksum(str: string): string {
  initCrcTable()
  const data = new TextEncoder().encode(str)
  let crc = CRC_INIT
  for (const byte of data) {
    const tableIndex = ((crc >> 8) ^ byte) & 0xFF
    crc = ((crc << 8) ^ (CRC_TABLE[tableIndex] || 0)) & 0xFFFF
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

// Generate data object content
function generateObject(
  defs: Array<{ ID: string; Len?: number; MaxLen?: number; Sub?: any[] }>,
  prefixId: string,
  id: string,
  contents: Record<string, string>
): string {
  const def = defs?.find((d) => d.ID === id)

  if (!def) {
    if (defs?.length === 0 || !defs) {
      const content = toAscii(contents[prefixId + id] || '')
      if (!content) return ''
      const length = Math.min(content.length, 99)
      return `${id}${length.toString().padStart(2, '0')}${content.slice(0, length)}`
    }
    return ''
  }

  // Compound object with sub-fields
  if (def.Sub && def.Sub.length > 0) {
    let content = ''
    for (const sub of def.Sub) {
      content += generateObject(def.Sub, prefixId + id, sub.ID, contents)
    }
    if (content) {
      return `${id}${content.length.toString().padStart(2, '0')}${content}`
    }
    return ''
  }

  // Simple field
  const content = toAscii(contents[prefixId + id] || '')
  if (!content) return ''
  const length = Math.min(content.length, def.MaxLen || 99)
  return `${id}${length.toString().padStart(2, '0')}${content.slice(0, length)}`
}

// Default field definitions
const Defaults = [
  { ID: '00', Len: 2 }, // Payload Format Indicator
  { ID: '01', Len: 2 }, // Point of Initiation Method
  {
    ID: '38',
    Sub: [
      { ID: '00', Len: 0, MaxLen: 32 }, // GUID
      {
        ID: '01',
        Sub: [
          { ID: '00', Len: 6 }, // Acquier ID/BNB ID
          { ID: '01', Len: 0, MaxLen: 19 }, // Merchant/Consumer ID
        ],
      },
      { ID: '02', Len: 0, MaxLen: 10 }, // Service Type
    ],
  }, // Merchant Account Information
  { ID: '52', Len: 4 }, // Merchant Category Code
  { ID: '53', Len: 3 }, // Transaction Currency
  { ID: '54', Len: 0, MaxLen: 13 }, // Transaction Amount
  { ID: '55', Len: 2 }, // Tip or Convenience Indicator
  { ID: '56', Len: 0, MaxLen: 13 }, // Value of Convenience Fee Fixed
  { ID: '57', Len: 0, MaxLen: 5 }, // Value of Convenience Fee
  { ID: '58', Len: 2 }, // Country Code
  { ID: '59', Len: 0, MaxLen: 25 }, // Merchant Name
  { ID: '60', Len: 0, MaxLen: 15 }, // Merchant City
  { ID: '51', Len: 0, MaxLen: 10 }, // Postal Code
  {
    ID: '62',
    Sub: [
      { ID: '01', Len: 0, MaxLen: 25 }, // Bill Number
      { ID: '02', Len: 0, MaxLen: 25 }, // Mobile Number
      { ID: '03', Len: 0, MaxLen: 25 }, // Store Label
      { ID: '04', Len: 0, MaxLen: 25 }, // Loyalty Number
      { ID: '05', Len: 0, MaxLen: 25 }, // Reference Label
      { ID: '06', Len: 0, MaxLen: 25 }, // Customer Label
      { ID: '07', Len: 0, MaxLen: 25 }, // Terminal Label
      { ID: '08', Len: 0, MaxLen: 25 }, // Purpose of Transaction
    ],
  }, // Additional Data Field Template
  { ID: '64', Len: 0, MaxLen: 99 }, // Merchant Information
]

export interface VietQRParams {
  bankBIN: string
  accountNumber: string
  amount?: number
  note?: string
  oneTime?: boolean
  serviceType?: 'QRIBFTTC' | 'QRIBFTTA' // QR to Card or QR to Account
  currency?: string
  countryCode?: string
}

// Generate VietQR string
export function generateVietQR(params: VietQRParams): string {
  const {
    bankBIN,
    accountNumber,
    amount = 0,
    note = '',
    oneTime = true,
    serviceType = 'QRIBFTTA',
    currency = 'VND',
    countryCode = 'VN',
  } = params

  const contents: Record<string, string> = {}

  // Payload Format Indicator
  contents['00'] = '01'

  // Point of Initiation Method
  // 11 = Static QR (multiple uses)
  // 12 = Dynamic QR (one-time use)
  contents['01'] = oneTime ? '12' : '11'

  // Merchant Account Information (ID 38)
  // A000000727 = VietQR GUID
  contents['3800'] = 'A000000727'
  contents['380100'] = bankBIN // Bank BIN
  contents['380101'] = accountNumber // Account number
  contents['3802'] = serviceType

  // Transaction Currency
  const currencyCode = CurrencyM[currency]
  if (currencyCode) {
    contents['53'] = currencyCode
  }

  // Country Code
  if (CountryCodeM[countryCode]) {
    contents['58'] = countryCode
  }

  // Transaction Amount
  if (amount > 0) {
    if (currencyCode === '704') {
      // VND - no decimal
      contents['54'] = Math.floor(amount).toString()
    } else {
      // Other currencies - with decimal
      contents['54'] = amount.toFixed(2).toString()
    }
  }

  // Merchant Category Code (required by EMVCo)
  contents['52'] = '0000'

  // Merchant Name (required by EMVCo)
  contents['59'] = 'PERLINK'

  // Merchant City (required by EMVCo)
  contents['60'] = 'HANOI'

  // Purpose of Transaction (note)
  const trimmedNote = note.trim()
  if (trimmedNote) {
    contents['6208'] = trimmedNote.slice(0, 25)
  }

  // Generate QR content - fields must be in ID ascending order
  const fieldOrder = ['00', '01', '38', '52', '53', '54', '58', '59', '60', '62']
  let result = ''
  for (const fieldId of fieldOrder) {
    result += generateObject(Defaults, '', fieldId, contents)
  }

  // Add CRC placeholder and calculate
  result += '6304'
  const crc = crcChecksum(result)
  return result + crc
}

// Get all banks list
export function getAllBanks(): Bank[] {
  return Object.values(VNBankM)
}

// Get bank by BIN
export function getBankByBIN(bin: string): Bank | undefined {
  return VNBankM[bin]
}

// Search banks by name
export function searchBanks(query: string): Bank[] {
  const lowerQuery = query.toLowerCase()
  return Object.values(VNBankM).filter(
    (bank) =>
      bank.Name.toLowerCase().includes(lowerQuery) ||
      bank.ShortName.toLowerCase().includes(lowerQuery) ||
      bank.Code.toLowerCase().includes(lowerQuery)
  )
}
