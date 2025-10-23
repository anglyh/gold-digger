import fs from 'node:fs/promises'
import path from "node:path"

export async function getPurchases() {
  try {
    const csvPath = path.join('data', 'purchases.csv')
    const content = await fs.readFile(csvPath, 'utf8')

    const [headerline, ...lines] = content.trim().split('\n')
    const headers = headerline.split(',')

    const data = lines.map(line => {
      const values = line.split(',')
      return headers.reduce((obj, key, i) => {
        obj[key] = values[i]
        return obj
      }, {})
    })
    
    const parsedPurchases = JSON.parse(content)
    return parsedPurchases
  } catch (err) {
    console.log(err)
    return []
  } 
}