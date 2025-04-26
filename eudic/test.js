const fs = require('fs').promises
const path = require('path')
const { getStudyListWords } = require('./api.ts')

/**
 * Retrieves all words from a study list using pagination
 * @param {string} listId - The ID of the study list
 * @param {string} language - The language code
 * @param {number} pageSize - Number of words per page
 * @returns {Promise<Array>} - All words from the study list
 */
async function getAllStudyListWords(listId, language, pageSize = 100) {
  let currentPage = 1
  let allWords = []
  let hasMoreWords = true

  console.log('Starting to fetch words...')

  while (hasMoreWords) {
    try {
      console.log(`Fetching page ${currentPage} with ${pageSize} words per page...`)
      const words = await getStudyListWords(listId, language, currentPage, pageSize)

      if (words && words.length > 0) {
        allWords = [...allWords, ...words]
        console.log(`Retrieved ${words.length} words. Total so far: ${allWords.length}`)
        currentPage++
      } else {
        hasMoreWords = false
        console.log('No more words to fetch.')
      }
    } catch (error) {
      console.error(`Error fetching page ${currentPage}:`, error)
      hasMoreWords = false
    }
  }

  return allWords
}

/**
 * Saves the words to a JSON file
 * @param {Array} words - The words to save
 * @param {string} filename - The filename to save to
 */
async function saveWordsToFile(words, filename) {
  try {
    // Ensure directory exists
    const dir = path.dirname(filename)
    await fs.mkdir(dir, { recursive: true })

    // Save the file
    await fs.writeFile(filename, JSON.stringify(words, null, 2))
    console.log(`Successfully saved ${words.length} words to ${filename}`)
  } catch (error) {
    console.error('Error saving file:', error)
  }
}

// Main function
async function main() {
  try {
    // List ID '0' and language 'en'
    const listId = '0'
    const language = 'en'
    const pageSize = 500 // Maximum page size

    // Get all words
    const allWords = await getAllStudyListWords(listId, language, pageSize)
    console.log(`Total words retrieved: ${allWords.length}`)

    // Save to file
    const outputFile = path.join(process.cwd(), 'public', 'eudic', 'wordlist.json')
    await saveWordsToFile(allWords, outputFile)
  } catch (error) {
    console.error('Error in main function:', error)
  }
}

// Run the script
main()
