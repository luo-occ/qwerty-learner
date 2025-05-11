import { deleteWordsFromStudyList } from './api/eudic'
import { dictDB } from './db'
import { processWords } from './update'
import type { Word } from '@/typings'

export async function updateEudicDict(): Promise<Word[]> {
  const updateDate = localStorage.getItem('dictStoreUpdateDate')
  if (!updateDate || updateDate !== new Date().toISOString().split('T')[0]) {
    console.log('Updating Eudic dictionary...')
    await processWords()
    localStorage.setItem('dictStoreUpdateDate', new Date().toISOString().split('T')[0])
  }
  return dictDB.dicts.toArray()
}

export async function refreshDict() {
  localStorage.removeItem('dictStoreUpdateDate')
  await dictDB.dicts.clear()
  await updateEudicDict()
}

export async function deleteWords(names: string[]) {
  await deleteWordsFromStudyList(names)
  await dictDB.dicts.bulkDelete(names)
}
