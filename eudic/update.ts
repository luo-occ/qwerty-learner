import { getPhoneticData } from '../eudic/api/phonetics.js'
import type { Word } from '../eudic/types.js'
import fs from 'fs'
import path from 'path'

async function processWords() {
  try {
    // Read the archive file
    const archivePath = path.join(__dirname, '../eudic/dicts/archive_eudic.json')
    const archiveData = JSON.parse(fs.readFileSync(archivePath, 'utf-8'))

    // Take first 200 words
    const words = archiveData.slice(0, 200).map((item: any) => item.word)

    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, '../public/dicts')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // Process each word
    const results: Word[] = []
    for (const word of words) {
      try {
        const phoneticData = await getPhoneticData(word)
        results.push(phoneticData)
        console.log(`Processed: ${word}`)
      } catch (error) {
        console.error(`Error processing word ${word}:`, error)
      }
    }

    // Save results
    const outputPath = path.join(outputDir, 'eudic_phonetic.json')
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2))
    console.log(`Results saved to ${outputPath}`)
  } catch (error) {
    console.error('Error:', error)
  }
}

processWords()
