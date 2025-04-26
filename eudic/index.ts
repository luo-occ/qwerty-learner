import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Define Word interfaces
interface EudicWord {
  term: string
  definition: string
}

interface CustomWord {
  name: string
  trans: string[]
  usphone?: string
  ukphone?: string
}

interface UpdateResult {
  totalWords: number
  newWordsAdded: number
}

// Get dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration
const CUSTOM_DICT_PATH = path.join(__dirname, '../public/dicts/my-custom-dict.json')

// Function to fetch words from Eudic API
async function fetchWordsFromEudic(apiUrl: string, apiKey: string): Promise<CustomWord[] | null> {
  try {
    if (!apiUrl || !apiKey) {
      console.error('Eudic API URL or API key is not configured')
      return null
    }

    // This is a placeholder - you'll need to replace with actual Eudic API endpoints and parameters
    const response = await axios.get<{ words: EudicWord[] }>(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    // Process the response based on Eudic's API structure
    // This is an example - adjust according to the actual API response format
    const words = response.data.words.map((word) => ({
      name: word.term,
      trans: [word.definition],
    }))

    return words
  } catch (error) {
    console.error('Error fetching words from Eudic:', error instanceof Error ? error.message : String(error))
    return null
  }
}

// Function to update custom dictionary
async function updateCustomDictionary(newWords: CustomWord[]): Promise<UpdateResult> {
  try {
    // Read existing dictionary
    let existingDict: CustomWord[] = []
    try {
      const data = await fs.readFile(CUSTOM_DICT_PATH, 'utf8')
      existingDict = JSON.parse(data)
    } catch (error) {
      // If file doesn't exist or is invalid, start with empty array
      console.log('Starting with empty dictionary')
    }

    // Add new words (avoiding duplicates)
    const existingTerms = new Set(existingDict.map((word) => word.name))
    const wordsToAdd = newWords.filter((word) => !existingTerms.has(word.name))

    const updatedDict = [...existingDict, ...wordsToAdd]

    // Write updated dictionary to file
    await fs.writeFile(CUSTOM_DICT_PATH, JSON.stringify(updatedDict, null, 2), 'utf8')

    return {
      totalWords: updatedDict.length,
      newWordsAdded: wordsToAdd.length,
    }
  } catch (error) {
    console.error('Error updating custom dictionary:', error instanceof Error ? error.message : String(error))
    throw error
  }
}

// Serverless function handler for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse): Promise<VercelResponse> {
  // Get API credentials from environment variables
  const apiUrl = process.env.EUDIC_API_URL
  const apiKey = process.env.EUDIC_API_KEY

  if (!apiUrl || !apiKey) {
    return res.status(500).json({
      success: false,
      message: 'API credentials not configured',
    })
  }

  try {
    console.log('Running dictionary update...')
    const newWords = await fetchWordsFromEudic(apiUrl, apiKey)

    if (!newWords) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch words from Eudic',
      })
    }

    const result = await updateCustomDictionary(newWords)

    return res.status(200).json({
      success: true,
      message: `Dictionary updated successfully. Total words: ${result.totalWords}, New words added: ${result.newWordsAdded}`,
      ...result,
    })
  } catch (error) {
    console.error('Error updating dictionary:', error instanceof Error ? error.message : String(error))
    return res.status(500).json({
      success: false,
      message: `Error updating dictionary: ${error instanceof Error ? error.message : String(error)}`,
    })
  }
}
