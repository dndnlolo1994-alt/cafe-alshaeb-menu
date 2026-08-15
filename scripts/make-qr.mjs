/**
 * Generates the print-ready QR code that points at the live menu.
 *
 * Reads the URL from src/config/site.ts so the code can never drift from
 * wherever the menu is actually deployed.
 *
 * Run with: npm run qr
 */
import QRCode from 'qrcode'
import sharp from 'sharp'
import { readFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(root, 'public', 'qr')

const INK = '#85161A' // --red-800
const PAPER = '#FFFCF6' // --paper-100

async function readSiteUrl() {
  const source = await readFile(join(root, 'src', 'config', 'site.ts'), 'utf8')
  const match = source.match(/siteUrl:\s*'([^']*)'/)
  const url = match?.[1]?.trim()
  if (!url) {
    throw new Error('siteUrl is empty in src/config/site.ts — deploy first, then run this')
  }
  return url
}

async function main() {
  const url = await readSiteUrl()
  await mkdir(OUT, { recursive: true })

  // High error correction so the code still scans through a scuff, a laminate
  // glare or a coffee ring on a table stand.
  const options = {
    errorCorrectionLevel: 'H',
    margin: 2,
    color: { dark: INK, light: PAPER },
  }

  await QRCode.toFile(join(OUT, 'menu-qr.png'), url, { ...options, width: 1200 })
  await QRCode.toFile(join(OUT, 'menu-qr.svg'), url, { ...options, type: 'svg' })

  // A ready-to-print card: QR plus the venue name, so a printed stand needs no
  // extra layout work. Text is drawn as SVG to keep it crisp at any size.
  const qrPng = await QRCode.toBuffer(url, { ...options, width: 900 })
  const W = 1200
  const H = 1600

  const card = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="${PAPER}"/>
    <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none"
          stroke="#C39B45" stroke-width="4" rx="18"/>
    <text x="${W / 2}" y="190" text-anchor="middle"
          font-family="Segoe UI, Tahoma, sans-serif" font-size="86"
          font-weight="700" fill="${INK}">كافيه الشعب</text>
    <text x="${W / 2}" y="272" text-anchor="middle"
          font-family="Segoe UI, sans-serif" font-size="44"
          letter-spacing="6" fill="#8A6A24">CAFE ALSHAEB</text>
    <text x="${W / 2}" y="1345" text-anchor="middle"
          font-family="Segoe UI, Tahoma, sans-serif" font-size="52"
          font-weight="600" fill="#3A322E">امسح الرمز لعرض المنيو</text>
    <text x="${W / 2}" y="1420" text-anchor="middle"
          font-family="Segoe UI, sans-serif" font-size="44" fill="#5E534D">Scan for the menu</text>
  </svg>`)

  await sharp(card)
    .composite([{ input: qrPng, top: 350, left: Math.round((W - 900) / 2) }])
    .png({ compressionLevel: 9 })
    .toFile(join(OUT, 'menu-qr-card.png'))

  console.log(`QR codes for ${url}`)
  console.log('  public/qr/menu-qr.png        1200px, plain')
  console.log('  public/qr/menu-qr.svg       vector, scales to any print size')
  console.log('  public/qr/menu-qr-card.png  printable card with the venue name')
}

main().catch((err) => {
  console.error(err.message)
  process.exitCode = 1
})
