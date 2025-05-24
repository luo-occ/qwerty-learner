import type { EudicWord } from './api/eudic.js'
import { getStudyListWords } from './api/eudic.js'
import { getPhoneticData } from './api/phonetics.js'
import { dictDB } from './db.js'
import type { Word } from './types.ts'

export async function processWords() {
  try {
    // Fetch words from the study list
    // Note: You'll need to replace 'YOUR_LIST_ID' with your actual list ID
    const rawData = await getStudyListWords()
    console.log('rawEudicData', rawData)
    // Filter out words that contain Chinese characters
    const eudicWords = rawData.filter((word) => !containsChinese(word.word))

    const existingWords: Word[] = await dictDB.getTimedDicts()

    // Get list of existing word names
    const existingWordNames = new Set(existingWords.map((w) => w.name))

    // Find new words that aren't in the existing list
    const newWords = eudicWords.filter((word: EudicWord) => !existingWordNames.has(word.word))
    console.log(`Found ${newWords.length} new words to process`)
    const deletedWords = existingWords.filter((word) => !eudicWords.some((w) => w.word === word.name)).map((word) => word.name)

    // Process new words
    const resultsPromise: Promise<string | void>[] = []
    for (const word of newWords) {
      try {
        resultsPromise.push(getPhoneticData(word).then((data) => dictDB.dicts.add(data)))
      } catch (error) {
        console.error(`Error processing word ${word}:`, error)
      }
    }
    for (const word of deletedWords) {
      resultsPromise.push(dictDB.dicts.delete(word))
    }
    await Promise.all(resultsPromise)
  } catch (error) {
    console.error('Error:', error)
  }
}

// Function to check if a string contains Chinese characters
function containsChinese(str: string): boolean {
  return /[\u4e00-\u9fa5]/.test(str)
}
