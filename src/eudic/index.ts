import { deleteWordsFromStudyList } from './api/eudic'
import { dictDB } from './db'
import { processWords } from './update'
import type { Word } from '@/typings'

export async function updateEudicDict(): Promise<Word[]> {
  console.log('Updating Eudic dictionary...')
  const updateDate = localStorage.getItem('dictStoreUpdateDate')
  if (!updateDate || new Date().getTime() - new Date(updateDate).getTime() > 1000 * 60 * 5) {
    await processWords()
    localStorage.setItem('dictStoreUpdateDate', new Date().toISOString())
  }
  return dictDB.getTimedDicts()
}

export async function refreshDict() {
  localStorage.removeItem('dictStoreUpdateDate')
  await dictDB.clean()
  await updateEudicDict()
}

export async function deleteWords(names: string[]) {
  await deleteWordsFromStudyList(names)
  await dictDB.dicts.bulkDelete(names)
}
