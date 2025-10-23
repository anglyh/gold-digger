const $priceDisplay = document.querySelector('#price-display')
const $form = document.querySelector('form')
const $submitBtn = $form.querySelector('button')
const $dialog = document.querySelector('dialog')
const $closeDialogBtn = $dialog.querySelector('button')

const eventSource = new EventSource('/api/prices')

$submitBtn.disabled = true;
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data)
  const price = data.price
  
  if (price) {
    $priceDisplay.textContent = price
    $submitBtn.disabled = false
  }
}

eventSource.onerror = () => {
  console.log("Connection lost. Attempting to reconnect...")
}

$form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const form = new FormData(event.target);
  const amount = form.get('invested-amount')

  const $amountSpan = $dialog.querySelector('.invested-amount')
  $amountSpan.textContent = amount

  const $ouncesBought = $dialog.querySelector('.ounces')
  const pricePerOz = $priceDisplay.textContent
  const ouncesBought = (amount / Number(pricePerOz)).toFixed(2)
  $ouncesBought.textContent = ouncesBought

  await sendReport({
    date: new Date().toISOString(),
    amount,
    pricePerOz,
    goldSold: ouncesBought
  })

  $form.reset()
  

  $dialog.showModal();
})

$closeDialogBtn.addEventListener('click', () => $dialog.close())


async function sendReport(purchaseData) {

  try {
    const response = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(purchaseData)
    })

    if (!response.ok) throw new Error(`Error in req ${response.status}`)
    
    await downloadPDF(response)
  } catch (err) {
    console.error('Error sending the report', err)
  }
  
}

async function downloadPDF(response) {
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)

  const cd = response.headers.get('Content-Disposition')
  const match = cd && cd.match(/filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i)
  const filename = match ? decodeURIComponent(match[1]) : 'document.pdf'

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}