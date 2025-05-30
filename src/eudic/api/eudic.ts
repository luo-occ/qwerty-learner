/**
 * Eudic API Module
 * API for interacting with Eudic vocabulary lists
 */
// Load environment variables from .env.local

export interface StudyListCategory {
  id: string
  language: string
  name: string
}

export interface EudicWord {
  word: string
  exp: string
  add_time: string
  star: number
}

/**
 * Create headers with auth token for API requests
 */
function createHeaders(contentType = false): HeadersInit {
  const headers: HeadersInit = {
    Authorization: EUDIC_AUTH_TOKEN || '',
  }

  if (contentType) {
    headers['Content-Type'] = 'application/json'
  }

  return headers
}

const EUDIC_LIST_ID = '0'

/**
 * Get all vocabulary lists
 * @param language Language code (en/fr/de/es)
 */
async function getStudyListCategories(language: string): Promise<StudyListCategory[]> {
  const response = await fetch(`https://api.frdic.com/api/open/v1/studylist/category?language=${language}`, {
    method: 'GET',
    headers: createHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch study list categories: ${response.statusText}`)
  }

  const data = await response.json()
  return data.data
}

/**
 * Add a new vocabulary list
 * @param language Language code (en/fr/de/es)
 * @param name Name of the new vocabulary list
 */
async function addStudyListCategory(language: string, name: string): Promise<StudyListCategory> {
  const response = await fetch('https://api.frdic.com/api/open/v1/studylist/category', {
    method: 'POST',
    headers: createHeaders(true),
    body: JSON.stringify({
      language,
      name,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to add study list category: ${response.statusText}`)
  }

  const data = await response.json()
  return data.data
}

/**
 * Rename a vocabulary list
 * @param id Vocabulary list ID
 * @param language Language code (en/fr/de/es)
 * @param name New name for the vocabulary list
 */
async function renameStudyListCategory(id: string, language: string, name: string): Promise<string> {
  const response = await fetch('https://api.frdic.com/api/open/v1/studylist/category', {
    method: 'PATCH',
    headers: createHeaders(true),
    body: JSON.stringify({
      id,
      language,
      name,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to rename study list category: ${response.statusText}`)
  }

  const data = await response.json()
  return data.message
}

/**
 * Delete a vocabulary list
 * @param id Vocabulary list ID
 * @param language Language code (en/fr/de/es)
 * @param name Name of the vocabulary list
 */
async function deleteStudyListCategory(id: string, language: string, name: string): Promise<void> {
  const response = await fetch('https://api.frdic.com/api/open/v1/studylist/category', {
    method: 'DELETE',
    headers: createHeaders(true),
    body: JSON.stringify({
      id,
      language,
      name,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to delete study list category: ${response.statusText}`)
  }

  return
}

/**
 * Get words from a vocabulary list
 * @param id Vocabulary list ID
 * @param language Language code (en/fr/de/es)
 * @param page Page number (optional)
 * @param pageSize Number of words per page (optional, default 100)
 */
async function getStudyListWords(page?: number, pageSize?: number): Promise<EudicWord[]> {
  const id = EUDIC_LIST_ID
  const language = 'en'
  let url = `https://api.frdic.com/api/open/v1/studylist/words/${id}?language=${language}`

  if (page !== undefined) {
    url += `&page=${page}`
  }

  if (pageSize !== undefined) {
    url += `&page_size=${pageSize}`
  }
  console.log('headers', createHeaders())
  const response = await fetch(url, {
    method: 'GET',
    headers: createHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch study list words: ${response.statusText}`)
  }

  const data = await response.json()
  return data.data
}

/**
 * Add words to a vocabulary list
 * @param id Vocabulary list ID
 * @param language Language code (en/fr/de/es)
 * @param words Array of words to add
 */
async function addWordsToStudyList(id: string, language: string, words: string[]): Promise<string> {
  const response = await fetch('https://api.frdic.com/api/open/v1/studylist/words', {
    method: 'POST',
    headers: createHeaders(true),
    body: JSON.stringify({
      id,
      language,
      words,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to add words to study list: ${response.statusText}`)
  }

  const data = await response.json()
  return data.message
}

/**
 * Delete words from a vocabulary list
 * @param id Vocabulary list ID
 * @param language Language code (en/fr/de/es)
 * @param words Array of words to delete
 */
async function deleteWordsFromStudyList(words: string[]): Promise<void> {
  const id = EUDIC_LIST_ID
  const language = 'en'
  const response = await fetch('https://api.frdic.com/api/open/v1/studylist/words', {
    method: 'DELETE',
    headers: createHeaders(true),
    body: JSON.stringify({
      id,
      language,
      words,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to delete words from study list: ${response.statusText}`)
  }

  return
}

export {
  getStudyListCategories,
  addStudyListCategory,
  renameStudyListCategory,
  deleteStudyListCategory,
  getStudyListWords,
  addWordsToStudyList,
  deleteWordsFromStudyList,
}
