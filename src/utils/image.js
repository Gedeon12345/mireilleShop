// Redimensionne et compresse une photo côté navigateur (JPEG, 900 px max) avant envoi.
export async function compressImage(file, max = 900, quality = 0.82) {
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise((res, rej) => {
      const i = new Image()
      i.onload = () => res(i)
      i.onerror = rej
      i.src = url
    })
    const r = Math.min(1, max / Math.max(img.width, img.height))
    const c = document.createElement('canvas')
    c.width = Math.round(img.width * r)
    c.height = Math.round(img.height * r)
    const ctx = c.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, c.width, c.height)
    ctx.drawImage(img, 0, 0, c.width, c.height)
    const blob = await new Promise((res) => c.toBlob(res, 'image/jpeg', quality))
    return { file: blob, preview: c.toDataURL('image/jpeg', quality) }
  } finally {
    URL.revokeObjectURL(url)
  }
}
