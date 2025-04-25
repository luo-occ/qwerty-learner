import { idDictionaryMap } from '@/resources/dictionary'
import type { Word } from '@/typings'

/**
 * Updates the dictionary length based on the actual word count in the loaded dictionary
 * This is particularly useful for dynamically generated dictionaries
 */
export const updateDictionaryLength = (dictionaryId: string, words: Word[]): void => {
  const dictionary = idDictionaryMap[dictionaryId]
  if (dictionary) {
    dictionary.length = words.length
  }
}
