import type { Dictionary, DictionaryResource } from '@/typings/index'
import { calcChapterCount } from '@/utils'

const customDicts: DictionaryResource[] = [
  {
    id: 'eudic-custom',
    name: 'Eudic Dictionary',
    description: 'Custom dictionary from Eudic textbooks',
    category: 'Custom',
    tags: ['Eudic'],
    url: '/dicts/Eudic.json',
    length: 5000, // TODO: update length
    language: 'en',
    languageCategory: 'en',
  },
]
const chinaExam: DictionaryResource[] = [
  {
    id: 'cet4',
    name: 'CET-4',
    description: '大学英语四级词库',
    category: '中国考试',
    tags: ['大学英语'],
    url: '/dicts/CET4_T.json',
    length: 2607,
    language: 'en',
    languageCategory: 'en',
  },
]

// 国际考试
const internationalExam: DictionaryResource[] = [
  {
    id: 'bec2',
    name: '商务英语',
    description: '商务英语常见词',
    category: '国际考试',
    tags: ['BEC'],
    url: '/dicts/BEC_2_T.json',
    length: 2753,
    language: 'en',
    languageCategory: 'en',
  },
  {
    id: 'bec3',
    name: 'BEC',
    description: 'BEC考试常见词',
    category: '国际考试',
    tags: ['BEC'],
    url: '/dicts/BEC_3_T.json',
    length: 2825,
    language: 'en',
    languageCategory: 'en',
  },
]

/**
 * Built-in dictionaries in an array.
 * Why arrays? Because it keeps the order across browsers.
 */
export const dictionaryResources: DictionaryResource[] = [...customDicts, ...internationalExam, ...chinaExam]

export const dictionaries: Dictionary[] = dictionaryResources.map((resource) => ({
  ...resource,
  chapterCount: calcChapterCount(resource.length),
}))

/**
 * An object-map from dictionary IDs to dictionary themselves.
 */
export const idDictionaryMap: Record<string, Dictionary> = Object.fromEntries(dictionaries.map((dict) => [dict.id, dict]))
