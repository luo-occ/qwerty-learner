import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Define Word interfaces
interface DictionaryResource {
  id: string
  name: string
  description: string
  category?: string
  tags?: string[]
  url?: string
  length?: number
  language?: string
  languageCategory?: string
}

// Get dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PUBLIC_DICTS_PATH = path.resolve(__dirname, '../public/dicts')

// Function to delete dictionary JSON files for a specified array
export async function deleteDictionariesForArray(
  dictionaries: DictionaryResource[],
  arrayName: string,
): Promise<{ count: number; deletedFiles: string[] }> {
  try {
    // Extract URLs directly from the passed array object
    const dictionaryUrls = dictionaries
      .map((dict) => dict.url)
      .filter((url): url is string => !!url && url.startsWith('/dicts/'))
      .map((url) => url.replace('/dicts/', ''))

    if (dictionaryUrls.length === 0) {
      console.log(`No dictionary URLs found to delete for ${arrayName}.`)
      return { count: 0, deletedFiles: [] }
    }

    console.log(`Found ${dictionaryUrls.length} dictionary files to delete for ${arrayName}...`)

    // Delete each file
    const deletedFiles: string[] = []

    for (const url of dictionaryUrls) {
      try {
        const filePath = path.join(PUBLIC_DICTS_PATH, url)
        await fs.access(filePath) // Check if file exists
        await fs.unlink(filePath) // Delete the file
        deletedFiles.push(url)
        console.log(`Deleted: ${filePath}`)
      } catch (error) {
        // Log if the file doesn't exist or other error occurs
        if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
          console.log(`Skipped: ${url} (File not found)`)
        } else {
          console.error(`Error deleting ${url}: ${error instanceof Error ? error.message : String(error)}`)
        }
      }
    }

    console.log('count', deletedFiles.length, deletedFiles)
    return { count: deletedFiles.length, deletedFiles }
  } catch (error) {
    console.error(`Error deleting dictionary files`, error instanceof Error ? error.message : String(error))
    return { count: 0, deletedFiles: [] }
  }
}
