import { getPhoneticData } from '../eudic/api/phonetics.js'
import type { Word } from '../eudic/types.js'
import { EudicWord } from './api/eudic.js'
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

processWords('Eudic.json')
