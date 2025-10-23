import fs from 'node:fs/promises'
import { generatePDF } from "./generatePDF.js"

export async function addUserPurchase(newPurchase) {
  try {
    const line = `${newPurchase.date}, amount paid: £${newPurchase.amount}, price per Oz: ${newPurchase.pricePerOz}, gold sold: ${newPurchase.goldSold}\n`
    
    await fs.appendFile('data/purchases.csv', line, 'utf8')
    console.log('New purchase added')

    return await generatePDF(newPurchase)
  } catch (err) {
    throw new Error(err)
  }
}