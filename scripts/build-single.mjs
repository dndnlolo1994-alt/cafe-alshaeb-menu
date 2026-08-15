/**
 * Packs the production build into ONE self-contained .html file.
 *
 * Everything is inlined — stylesheet, script, logo and the Cairo webfont — so
 * the file opens by double-click, works with no network, and can be hosted
 * anywhere that serves a single page. The normal `npm run build` output in
 * dist/ stays the deployment artefact; this is the portable copy.
 *
 * Run with: npm run build:single   (after npm run build)
 */
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(root, 'dist')
const OUT_DIR = join(root, 'dist-single')
const OUT_FILE = join(OUT_DIR, 'cafe-alshaeb-menu.html')

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'

/** Only the ranges this menu actually uses; skips cyrillic/latin-ext bulk. */
const WANTED_SUBSETS = ['arabic', 'latin']

async function embedCairo() {
  const url =
    'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap'
  const css = await fetch(url, { headers: { 'User-Agent': UA } }).then((r) => {
    if (!r.ok) throw new Error(`font css ${r.status}`)
    return r.text()
  })

  // Google's CSS is a run of "/* subset */ @font-face {...}" blocks.
  const blocks = css.split('/*').slice(1)
  const out = []

  for (const block of blocks) {
    const subset = block.slice(0, block.indexOf('*/')).trim()
    if (!WANTED_SUBSETS.includes(subset)) continue

    const face = block.slice(block.indexOf('*/') + 2)
    const src = face.match(/url\((https:[^)]+\.woff2)\)/)
    if (!src) continue

    const bytes = await fetch(src[1], { headers: { 'User-Agent': UA } }).then((r) => {
      if (!r.ok) throw new Error(`font file ${r.status}`)
      return r.arrayBuffer()
    })
    const dataUri = `data:font/woff2;base64,${Buffer.from(bytes).toString('base64')}`
    out.push(face.replace(src[0], `url(${dataUri})`).trim())
  }

  if (out.length === 0) throw new Error('no font faces embedded')
  return out.join('\n')
}

async function main() {
  const assets = await readdir(join(DIST, 'assets'))
  const cssName = assets.find((f) => f.endsWith('.css'))
  const jsName = assets.find((f) => f.endsWith('.js'))
  if (!cssName || !jsName) throw new Error('run `npm run build` first')

  let html = await readFile(join(DIST, 'index.html'), 'utf8')
  const css = await readFile(join(DIST, 'assets', cssName), 'utf8')
  let js = await readFile(join(DIST, 'assets', jsName), 'utf8')

  const asDataUri = async (file, mime) =>
    `data:${mime};base64,${(await readFile(join(DIST, file))).toString('base64')}`

  const logo = await asDataUri('brand/logo.webp', 'image/webp')
  const favicon = await asDataUri('brand/favicon-32.png', 'image/png')

  // The bundle references the logo by relative path; point it at the payload.
  js = js.replaceAll('"brand/logo.webp"', JSON.stringify(logo))

  let fontCss = ''
  try {
    fontCss = await embedCairo()
    console.log('Cairo embedded (arabic + latin, weights 400/600/700)')
  } catch (err) {
    console.warn(`Could not embed Cairo (${err.message}) — falling back to system fonts.`)
  }

  // Strip every external reference: no CDN, no manifest, no separate assets.
  // Payloads go in as placeholders so the "nothing external survived" check can
  // read a small skeleton — base64 blobs happen to contain substrings like
  // "assets/" and would otherwise trip it.
  const JS_SLOT = '@@INLINE_JS@@'
  const CSS_SLOT = '@@INLINE_CSS@@'
  const ICON_SLOT = '@@INLINE_ICON@@'

  html = html
    .replace(/<link rel="preconnect"[^>]*>\s*/g, '')
    .replace(/<link[^>]+fonts\.googleapis\.com[^>]*>\s*/g, '')
    .replace(/<link rel="manifest"[^>]*>\s*/g, '')
    .replace(/<link rel="icon"[^>]*>\s*/g, '')
    .replace(/<link rel="apple-touch-icon"[^>]*>\s*/g, '')
    .replace(
      /<script type="module"[^>]*src="[^"]*"><\/script>/,
      `<script type="module">${JS_SLOT}</script>`,
    )
    .replace(/<link rel="stylesheet"[^>]*href="[^"]*"[^>]*>/, `<style>${CSS_SLOT}</style>`)
    .replace('</head>', `  <link rel="icon" type="image/png" href="${ICON_SLOT}" />\n  </head>`)
    // The share card cannot travel inside a single file; drop the reference
    // rather than point it at a path that will 404.
    .replace(/\s*<meta property="og:image[^>]*>/g, '')

  for (const slot of [JS_SLOT, CSS_SLOT, ICON_SLOT]) {
    if (!html.includes(slot)) throw new Error(`inlining failed: ${slot} was never placed`)
  }
  if (/(?:src|href)="(?!@@)[^"]*(?:assets\/|https?:)/.test(html)) {
    throw new Error('an external reference survived inlining')
  }

  html = html
    .replace(JS_SLOT, () => js)
    .replace(CSS_SLOT, () => `${fontCss}\n${css}`)
    .replace(ICON_SLOT, () => favicon)

  await mkdir(OUT_DIR, { recursive: true })
  await writeFile(OUT_FILE, html, 'utf8')

  const kb = (Buffer.byteLength(html) / 1024).toFixed(0)
  console.log(`Wrote dist-single/cafe-alshaeb-menu.html (${kb} kB, fully offline)`)

  // Same payload as a body fragment, for hosts that supply their own
  // doctype/head/body wrapper. Title first so a host scanning only the opening
  // bytes still finds it ahead of the inlined bundle.
  const fragment = [
    '<title>كافيه الشعب — المنيو | Cafe AlShaeb Menu</title>',
    `<style>${fontCss}\n${css}</style>`,
    '<div id="root"></div>',
    `<script type="module">${js}</script>`,
  ].join('\n')

  await writeFile(join(OUT_DIR, 'artifact.html'), fragment, 'utf8')
  console.log(
    `Wrote dist-single/artifact.html (${(Buffer.byteLength(fragment) / 1024).toFixed(0)} kB fragment)`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
