import { EventEmitter } from 'node:events'
import { generateGoldPrice } from "../utils/generateGoldPrice.js"

export const priceEvents = new EventEmitter()

priceEvents.on('price-update', console.log('New price', generateGoldPrice))