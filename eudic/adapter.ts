import type { EudicWord } from './api.js'
import type { Word } from './types.js'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Type definitions for Dictionary API response
interface Phonetic {
  text?: string
  audio?: string
  sourceUrl?: string
  license?: {
    name: string
    url: string
  }
}

interface DictionaryApiResponse {
  word: string
  phonetics: Phonetic[]
  meanings: any[]
  license: any
  sourceUrls: string[]
}

/**
 * Fetch phonetic symbols for a word from the Free Dictionary API
 * @param word The word to get phonetic data for
 */
async function getPhoneticData(word: string): Promise<{ usphone: string; ukphone: string }> {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)

    if (!response.ok) {
      return { usphone: '', ukphone: '' }
    }

    const data = (await response.json()) as DictionaryApiResponse[]

    if (Array.isArray(data) && data.length > 0) {
      // Extract phonetics
      const phonetics = data[0].phonetics || []

      // Find US pronunciation (usually no locale or 'us' locale)
      const usPhonetic = phonetics.find((p: Phonetic) => p.audio?.includes('us.mp3') || (!p.audio?.includes('uk') && p.text))

      // Find UK pronunciation
      const ukPhonetic = phonetics.find((p: Phonetic) => p.audio?.includes('uk.mp3') || p.text)

      return {
        usphone: usPhonetic?.text || '',
        ukphone: ukPhonetic?.text || '',
      }
    }

    return { usphone: '', ukphone: '' }
  } catch (error) {
    console.error(`Error fetching phonetic data for ${word}:`, error)
    return { usphone: '', ukphone: '' }
  }
}

/**
 * Enhanced adapter function with phonetic data
 */
export async function adaptEudicWordWithPhonetics(words: EudicWord[]): Promise<Word[]> {
  const filteredWords = filterEnglishWord(words)
  const result: Word[] = []

  for (const word of filteredWords) {
    const { usphone, ukphone } = await getPhoneticData(word.word)
    result.push({
      name: word.word,
      trans: [word.exp],
      usphone,
      ukphone,
    })
  }

  return result
}

export function adaptEudicWord(word: EudicWord[]): Word[] {
  return filterEnglishWord(word).map((w) => ({
    name: w.word,
    trans: [w.exp],
    usphone: '',
    ukphone: '',
  }))
}

export function filterEnglishWord(words: EudicWord[]): EudicWord[] {
  return words.filter((w) => {
    // Check if the word contains only English letters
    return /^[a-zA-Z]+$/.test(w.word) && w.word.length > 1
  })
}

export async function adaptEudicWordToJson() {
  const eudicWords = await fs.readFile(path.join(__dirname, 'dicts/archive_eudic.json'), 'utf-8')
  const wordList = JSON.parse(eudicWords)

  // Use the enhanced adapter with phonetics
  const words = await adaptEudicWordWithPhonetics(wordList)

  await fs.writeFile(path.join(__dirname, 'dicts/archive.json'), JSON.stringify(words, null, 2))
}
