import { addUserPurchase } from "../utils/addUserPurchase.js"
import { generateGoldPrice } from "../utils/generateGoldPrice.js"
import { parseJSONBody } from "../utils/parseJSONBody.js"
import { sendResponse } from "../utils/sendResponse.js"

export async function handlePriceUpdate(req, res) {
  res.statusCode = 200

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const id = setInterval(() => {
    const price = generateGoldPrice()
    res.write(
      `data: ${JSON.stringify({ event: 'price-update', price })}\n\n`
    )
  }, 5000)

  req.on('close', () => clearInterval(id))
}

export async function handlePDF(req, res) {
  try {
    const parsedBody = await parseJSONBody(req)
    const pdfBytes = await addUserPurchase(parsedBody)
    
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename="receipt.pdf"')

    res.end(Buffer.from(pdfBytes))
  } catch (err) {
    sendResponse(res, 400, 'application/json', JSON.stringify({ error: err }))
  }
}