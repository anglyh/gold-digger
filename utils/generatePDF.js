import fs from 'node:fs/promises'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export async function generatePDF(
  data,
) {
  const { date, amount, pricePerOz, goldSold } = data

  const formatMoney = (n) =>
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(Number(n || 0))
  const formatNumber = (n) =>
    new Intl.NumberFormat('en-GB', { maximumFractionDigits: 4 }).format(Number(n || 0))
  const dateStr = (() => {
    const t = Date.parse(date)
    return Number.isNaN(t)
      ? String(date ?? '')
      : new Date(t).toLocaleString('en-GB', { hour12: true })
  })()

  const computedTotal = Number(pricePerOz || 0) * Number(goldSold || 0)
  const totalsMatch = Math.abs(Number(amount || 0) - computedTotal) < 0.01

  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // A4 page
  const page = pdfDoc.addPage([595, 842])
  const { width, height } = page.getSize()
  const margin = 50
  let y = height - margin

  // Header
  page.drawText('TRANSACTION RECEIPT', {
    x: margin,
    y,
    size: 20,
    font: bold,
    color: rgb(0, 0.35, 0.75),
  })
  y -= 28

  // Subtitle
  page.drawText('Gold Purchase Confirmation', {
    x: margin,
    y,
    size: 12,
    font,
    color: rgb(0.25, 0.25, 0.25),
  })
  y -= 14

  // Divider
  page.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.85),
  })
  y -= 28

  // Meta info
  drawRow('Date', dateStr)
  drawRow('Gold sold (oz)', formatNumber(goldSold))
  drawRow('Price per oz', formatMoney(pricePerOz))
  drawRow('Amount paid', formatMoney(amount))

  y -= 14
  page.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.85),
  })
  y -= 22

  // Calculation box
  const calcLabel = 'Calculated total'
  drawRow(calcLabel, formatMoney(computedTotal))

  if (!totalsMatch) {
    y -= 10
    page.drawText(
      'Note: Amount paid differs from calculated total. Taxes/fees or rounding may apply.',
      { x: margin, y, size: 10, font, color: rgb(0.6, 0.2, 0.2) }
    )
    y -= 18
  }

  // Footer
  y -= 8
  page.drawText('Thank you for your purchase.', {
    x: margin,
    y,
    size: 12,
    font: bold,
    color: rgb(0, 0.5, 0.25),
  })
  y -= 14
  page.drawText(
    'This document is an electronic confirmation of your transaction.',
    { x: margin, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) }
  )

  return await pdfDoc.save()
  // await fs.writeFile(outputPath, pdfBytes)
  // return outputPath

  // ---- helpers ----
  function drawRow(label, value) {
    page.drawText(label + ':', {
      x: margin,
      y,
      size: 12,
      font: bold,
      color: rgb(0, 0, 0),
    })
    page.drawText(String(value ?? ''), {
      x: margin + 190,
      y,
      size: 12,
      font,
      color: rgb(0.2, 0.2, 0.2),
    })
    y -= 18
  }
}
