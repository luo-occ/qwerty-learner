import fetch from 'node-fetch'

export interface WordData {
  word: string
  usphone: string
  ukphone: string
  meanings: string
}

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

export async function getPhoneticData(word: string): Promise<WordData> {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
      timeout: 5000,
    })

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
    let meanings = ''
    if (firstEntry.meanings && Array.isArray(firstEntry.meanings)) {
      firstEntry.meanings.forEach((partOfSpeech: Meaning) => {
        meanings += `${partOfSpeech.partOfSpeech}:\n`

        if (partOfSpeech.definitions && Array.isArray(partOfSpeech.definitions)) {
          partOfSpeech.definitions.forEach((def: Definition, index: number) => {
            meanings += `${index + 1}. ${def.definition}\n`

            if (def.example) {
              meanings += `   Example: ${def.example}\n`
            }
          })
        }

        meanings += '\n'
      })
    }

    return {
      word,
      usphone: usphone.replace(/[\[\]]/g, ''), // Remove brackets from phonetic notation
      ukphone: ukphone.replace(/[\[\]]/g, ''),
      meanings: meanings.trim(),
    }
  } catch (error) {
    console.error(`Error fetching data for ${word}:`, error)
    throw error
  }
}

export { getPhoneticData, WordData }
