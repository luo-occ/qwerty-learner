import { deleteWords, refreshDict, updateEudicDict } from '@/eudic'
import { dictDB } from '@/eudic/db'
import type { Dictionary, Word } from '@/typings/index'
import { calcChapterCount } from '@/utils'

const customDicts: Dictionary[] = [
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
    chapterCount: 250,
  },
]
const chinaExam: Dictionary[] = [
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
    chapterCount: 14,
  },
]

class DictStore {
  public idDictionaryMap: Record<string, Dictionary> = Object.fromEntries([...customDicts, ...chinaExam].map((dict) => [dict.id, dict]))
  private updateEudicDict: Promise<Word[]> = updateEudicDict()
  private db = dictDB
  constructor() {
    this.updateEudicDict.then((words) => {
      const eudicDict = this.idDictionaryMap['eudic-custom']
      eudicDict.length = words.length
      eudicDict.chapterCount = calcChapterCount(words.length)
    })
  }
  get dictionaries() {
    return Object.values(this.idDictionaryMap)
  }
  async fetchWordList(url: string, dictionaryId?: string): Promise<Word[]> {
    console.log('Fetching word list...')
    if (url === '/dicts/Eudic.json') {
      return this.updateEudicDict
    }
    const URL_PREFIX: string = REACT_APP_DEPLOY_ENV === 'pages' ? '/qwerty-learner' : ''
    const response = await fetch(URL_PREFIX + url)
    const words: Word[] = await response.json()

    return words
  }

  async refreshDict() {
    refreshDict()
  }
  async deleteWords(names: string[]) {
    deleteWords(names)
  }
}

export const dictStore = new DictStore()
window.dictStore = dictStore
