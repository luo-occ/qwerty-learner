const fs = require('fs').promises
const path = require('path')
const { getStudyListWords, addWordsToStudyList } = require('./dist/api.js')

/**
 * Fetch word meanings from Free Dictionary API
 * @param {string} word - The word to look up
 * @returns {Promise<Array>} - Array of meanings
 */
async function fetchWordMeanings(word) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)
    if (!response.ok) {
      if (response.status === 404) {
        console.log(`No definition found for word: ${word}`)
        return null
      }
      throw new Error(`Failed to fetch meanings for ${word}: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching meanings for ${word}:`, error)
    return null
  }
}

/**
 * Format meanings into a readable string
 * @param {Array} meanings - The meanings from the API
 * @returns {string} - Formatted meanings string
 */
function formatMeanings(meanings) {
  if (!meanings || !Array.isArray(meanings)) return ''

  let result = ''

  meanings.forEach((meaning) => {
    if (meaning.meanings && Array.isArray(meaning.meanings)) {
      meaning.meanings.forEach((partOfSpeech) => {
        result += `${partOfSpeech.partOfSpeech}:\n`

        if (partOfSpeech.definitions && Array.isArray(partOfSpeech.definitions)) {
          partOfSpeech.definitions.forEach((def, index) => {
            result += `${index + 1}. ${def.definition}\n`

            if (def.example) {
              result += `   Example: ${def.example}\n`
            }
          })
        }

        result += '\n'
      })
    }
  })

  return result.trim()
}

/**
 * Process words and update their meanings
 * @param {string} listId - The study list ID
 * @param {string} language - The language code
 * @param {number} batchSize - Number of words to process at once
 */
async function updateWordMeanings(listId, language, batchSize = 10) {
  try {
    // Get all words from the study list
    console.log('Fetching words from study list...')
    const words = await getStudyListWords(listId, language, 1, 500)
    console.log(`Found ${words.length} words in study list.`)

    // Process words in batches
    const updatedWords = []
    let processedCount = 0

    for (let i = 0; i < words.length; i += batchSize) {
      const batch = words.slice(i, i + batchSize)
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(words.length / batchSize)}...`)

      for (const word of batch) {
        try {
          console.log(`Fetching meanings for: ${word.word}`)
          const meanings = await fetchWordMeanings(word.word)

          if (meanings) {
            const formattedMeanings = formatMeanings(meanings)
            if (formattedMeanings) {
              updatedWords.push({
                word: word.word,
                exp: formattedMeanings,
              })
              console.log(`Updated meanings for: ${word.word}`)
            }
          }

          // Wait a bit between requests to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 1000))
        } catch (error) {
          console.error(`Error processing word ${word.word}:`, error)
        }

        processedCount++
        console.log(`Progress: ${processedCount}/${words.length} words processed`)
      }

      // Save progress after each batch
      if (updatedWords.length > 0) {
        const outputFile = path.join(process.cwd(), 'public', 'eudic', 'updated_words.json')
        await fs.writeFile(outputFile, JSON.stringify(updatedWords, null, 2))
        console.log(`Saved ${updatedWords.length} updated words to ${outputFile}`)
      }
    }

    console.log('Finished updating word meanings.')
    console.log(`Total words updated: ${updatedWords.length}`)
  } catch (error) {
    console.error('Error in updateWordMeanings:', error)
  }
}

// Main function
async function main() {
  try {
    const listId = '0'
    const language = 'en'

    await updateWordMeanings(listId, language)
  } catch (error) {
    console.error('Error in main function:', error)
  }
}

// Run the script
main()
