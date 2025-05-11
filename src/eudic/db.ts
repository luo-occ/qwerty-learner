import type { Word } from '@/typings'
import type { Table } from 'dexie'
import Dexie from 'dexie'

class DictDB extends Dexie {
  //   eudicDicts!: Table<EudicWord, string>
  dicts!: Table<Word, string>

  constructor() {
    super('DictDB')
    this.version(1).stores({
      //   eudicDicts: '&word,exp,add_time,star',
      dicts: '&name,trans,usphone,ukphone,notation',
    })
  }
}

export const dictDB = new DictDB()
window.dictDB = dictDB
