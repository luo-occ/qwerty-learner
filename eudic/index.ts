import { getStudyListWords } from './api/eudic.js'
import { processWords } from './update.js'
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const EUDIC_LIST_ID = '0'

// Function to check if a string contains Chinese characters
function containsChinese(str: string): boolean {
  return /[\u4e00-\u9fa5]/.test(str)
}

async function fetchAndProcessDailyWords() {
  try {
    const fileName = `Eudic.json`

    // Create dicts directory if it doesn't exist
    const dictsDir = path.join(__dirname, 'dicts')
    if (!fs.existsSync(dictsDir)) {
      fs.mkdirSync(dictsDir, { recursive: true })
    }

    // Fetch words from the study list
    // Note: You'll need to replace 'YOUR_LIST_ID' with your actual list ID
    const words = await getStudyListWords(EUDIC_LIST_ID, 'en')

    // Filter out words that contain Chinese characters
    const filteredWords = words.filter((word) => !containsChinese(word.word))

    // Save raw words to dated JSON file
    const filePath = path.join(dictsDir, fileName)
    fs.writeFileSync(filePath, JSON.stringify(filteredWords, null, 2))
    console.log(`Saved ${filteredWords.length} filtered words to ${filePath}`)

    // Process the words using the existing processWords function
    await processWords(fileName)

    console.log('Daily word processing completed successfully')
  } catch (error) {
    console.error('Error in fetchAndProcessDailyWords:', error)
  }
}

// Execute the function
fetchAndProcessDailyWords()
