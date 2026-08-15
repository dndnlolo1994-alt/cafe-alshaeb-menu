/**
 * Derives the web assets used by the app from the untouched originals in /pic.
 *
 * Source files in /pic are only ever read, never written or replaced.
 *
 * Run with: npm run images
 */
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC_LOGO = join(root, 'pic', 'logo.jpeg')
const OUT_BRAND = join(root, 'public', 'brand')

/** Badge bounding box inside pic/logo.jpeg (1200x1600), measured visually. */
const BADGE = { left: 40, top: 245, width: 1090, height: 1100 }

/** Brand palette, sampled from the logo. */
const BRAND_RED = { r: 155, g: 30, b: 32 }

/**
 * Clears the scanned paper background by flood-filling inward from the border.
 *
 * A global "light pixels are background" threshold would also punch out the
 * white Arabic lettering in the middle of the badge, so connectivity from the
 * edge is what makes this safe: interior white is never reached.
 */
function floodFillBackground(data, width, height, channels, tolerance = 92) {
  const seen = new Uint8Array(width * height)
  const stack = []

  const sample = (x, y) => {
    const i = (y * width + x) * channels
    return [data[i], data[i + 1], data[i + 2]]
  }

  // Average the four corners to characterise the paper colour.
  const corners = [
    sample(0, 0),
    sample(width - 1, 0),
    sample(0, height - 1),
    sample(width - 1, height - 1),
  ]
  const bg = [0, 1, 2].map((c) => corners.reduce((sum, px) => sum + px[c], 0) / corners.length)

  // The scan is unevenly lit, so proximity to the corner colour alone leaves
  // shadowed paper behind. Any pale, near-grey pixel counts as paper too; the
  // badge itself is saturated red/gold or near-black, so it never qualifies.
  const isPaper = (i) => {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    if (Math.hypot(r - bg[0], g - bg[1], b - bg[2]) <= tolerance) return true
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    return max >= 165 && max - min <= 34
  }

  for (let x = 0; x < width; x++) {
    stack.push([x, 0], [x, height - 1])
  }
  for (let y = 0; y < height; y++) {
    stack.push([0, y], [width - 1, y])
  }

  while (stack.length) {
    const [x, y] = stack.pop()
    if (x < 0 || y < 0 || x >= width || y >= height) continue
    const flat = y * width + x
    if (seen[flat]) continue
    if (!isPaper(flat * channels)) continue

    seen[flat] = 1
    data[flat * channels + 3] = 0
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
  }

  // Soften the one-pixel halo the hard threshold leaves behind.
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const flat = y * width + x
      if (seen[flat]) continue
      const i = flat * channels
      if (data[i + 3] === 0) continue
      const neighbours =
        seen[flat - 1] + seen[flat + 1] + seen[flat - width] + seen[flat + width]
      if (neighbours >= 3) data[i + 3] = 90
      else if (neighbours === 2) data[i + 3] = 170
    }
  }
}

async function buildLogo() {
  const { data, info } = await sharp(SRC_LOGO)
    .extract(BADGE)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  floodFillBackground(data, info.width, info.height, info.channels)

  const cut = sharp(data, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  })

  // Trim the now-transparent margin so the badge is centred in its own box,
  // then pad back to a square so circular masks in the UI never clip a point.
  const trimmed = await cut.trim({ threshold: 1 }).png().toBuffer()
  const meta = await sharp(trimmed).metadata()
  const side = Math.max(meta.width ?? 0, meta.height ?? 0)
  const pad = Math.round(side * 0.06)
  const box = side + pad * 2

  const square = await sharp({
    create: {
      width: box,
      height: box,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: trimmed, gravity: 'center' }])
    .png()
    .toBuffer()

  return square
}

async function main() {
  await mkdir(OUT_BRAND, { recursive: true })
  const logo = await buildLogo()

  // Transparent master, used in the header and on the book cover.
  await sharp(logo)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 92 })
    .toFile(join(OUT_BRAND, 'logo.webp'))

  await sharp(logo)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(join(OUT_BRAND, 'logo.png'))

  // Favicons and PWA icons: flattened onto brand red so the badge stays legible
  // at 32px, where a transparent scalloped edge would disappear.
  const iconSizes = [
    ['favicon-32.png', 32],
    ['favicon-192.png', 192],
    ['favicon-512.png', 512],
    ['apple-touch-icon.png', 180],
  ]
  for (const [name, size] of iconSizes) {
    const inner = Math.round(size * 0.92)
    await sharp({
      create: { width: size, height: size, channels: 4, background: BRAND_RED },
    })
      .composite([
        {
          input: await sharp(logo)
            .resize(inner, inner, {
              fit: 'contain',
              background: { r: 0, g: 0, b: 0, alpha: 0 },
            })
            .png()
            .toBuffer(),
          gravity: 'center',
        },
      ])
      .png({ compressionLevel: 9 })
      .toFile(join(OUT_BRAND, name))
  }

  // Open Graph card: brand colours plus the untouched logo, no invented imagery.
  await sharp({
    create: { width: 1200, height: 630, channels: 4, background: BRAND_RED },
  })
    .composite([
      {
        input: await sharp(logo)
          .resize(430, 430, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toBuffer(),
        gravity: 'center',
      },
    ])
    .jpeg({ quality: 88 })
    .toFile(join(OUT_BRAND, 'og-image.jpg'))

  console.log('Brand assets written to public/brand/ (originals in /pic untouched)')
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
