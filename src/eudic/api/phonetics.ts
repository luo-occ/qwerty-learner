import type { Word } from '../types.ts'
import type { EudicWord } from './eudic.ts'

interface Phonetic {
  text: string
  sourceUrl?: string
}

interface Definition {
  definition: string
  example?: string
}

interface Meaning {
  partOfSpeech: string
  definitions: Definition[]
}

interface DictionaryEntry {
  phonetics: Phonetic[]
  meanings: Meaning[]
}

export async function getPhoneticData(word: EudicWord): Promise<Word> {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.word)}`)

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`No definition found for word: ${word}`)
      }
      throw new Error(`Failed to fetch data for ${word}: ${response.statusText}`)
    }

    const data = await response.json()
    const firstEntry = data[0] as DictionaryEntry

    // Get phonetics
    let usphone = ''
    let ukphone = ''

    if (firstEntry.phonetics && Array.isArray(firstEntry.phonetics)) {
      // Try to find US and UK pronunciations
      const usPhonetic = firstEntry.phonetics.find((p: Phonetic) => p.sourceUrl?.includes('us'))
      const ukPhonetic = firstEntry.phonetics.find((p: Phonetic) => p.sourceUrl?.includes('uk'))

      usphone = usPhonetic?.text || firstEntry.phonetics[0]?.text || ''
      ukphone = ukPhonetic?.text || firstEntry.phonetics[0]?.text || ''
    }

    // Format meanings
    const meanings: string[] = []
    if (firstEntry.meanings && Array.isArray(firstEntry.meanings)) {
      firstEntry.meanings.forEach((partOfSpeech: Meaning) => {
        meanings.push(`${partOfSpeech.partOfSpeech}:\n`)

        if (partOfSpeech.definitions && Array.isArray(partOfSpeech.definitions)) {
          partOfSpeech.definitions.forEach((def: Definition, index: number) => {
            meanings.push(`${index + 1}. ${def.definition}\n`)

            // if (def.example) {
            //   meanings.push(`   Example: ${def.example}\n`)
            // }
          })
        }
      })
    }

    return {
      name: word.word,
      trans: meanings,
      usphone: usphone.replace(/[\[\]]/g, ''), // Remove brackets from phonetic notation
      ukphone: ukphone.replace(/[\[\]]/g, ''),
    }
  } catch (error) {
    console.error(`Error fetching data for ${word}:`, error)
    return eudicToDict(word)
  }
}

function eudicToDict(eudicWord: EudicWord): Word {
  return {
    name: eudicWord.word,
    trans: eudicWord.exp.split(';'),
    usphone: '',
    ukphone: '',
  }
}
