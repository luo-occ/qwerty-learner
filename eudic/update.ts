import { getPhoneticData } from '../eudic/api/phonetics.js'
import type { Word } from '../eudic/types.js'
import { EudicWord, getStudyListWords } from './api/eudic.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function processWords(jsonName: string) {
  try {
    // Read the archive file
    const eudicPath = path.join(__dirname, '../eudic/dicts/', jsonName)
    const eudicData: EudicWord[] = JSON.parse(fs.readFileSync(eudicPath, 'utf-8'))

    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, '../public/dicts')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // Read existing processed words
    const outputPath = path.join(outputDir, jsonName)
    let existingWords: Word[] = []
    if (fs.existsSync(outputPath)) {
      existingWords = JSON.parse(fs.readFileSync(outputPath, 'utf-8'))
    }

    // Get list of existing word names
    const existingWordNames = new Set(existingWords.map((w) => w.name))

    // Get list of current words from archive
    const eudicWords = eudicData.map((item) => item.word)
    const currentWordSet = new Set(eudicWords)

    // Find new words that aren't in the existing list
    const newWords = eudicWords.filter((word: string) => !existingWordNames.has(word))
    console.log(`Found ${newWords.length} new words to process`)

    // Process new words
    const results: Word[] = []
    for (const word of newWords) {
      try {
        const phoneticData = await getPhoneticData(word)
        results.push(phoneticData)
        console.log(`Processed: ${word}`)
      } catch (error) {
        console.error(`Error processing word ${word}:`, error)
      }
    }

    // Combine existing and new words
    const allWords = [...existingWords, ...results]

    // Filter out any words that don't exist in the current word list
    const finalWords = allWords.filter((word) => currentWordSet.has(word.name))

    // Save results
    fs.writeFileSync(outputPath, JSON.stringify(finalWords, null, 2))
    console.log(`Saved ${finalWords.length} total words to ${outputPath}`)
  } catch (error) {
    console.error('Error:', error)
  }
}

// Function to check if a string contains Chinese characters
function containsChinese(str: string): boolean {
  return /[\u4e00-\u9fa5]/.test(str)
}

const EUDIC_LIST_ID = '0'

export async function fetchAndProcessDailyWords() {
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
