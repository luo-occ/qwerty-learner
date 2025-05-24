import type { Word } from '@/typings'
import type { Table } from 'dexie'
import Dexie from 'dexie'

class DictDB extends Dexie {
  //   eudicDicts!: Table<EudicWord, string>
  dicts!: Table<Word, string>

  constructor() {
    super('DictDB')

    this.version(1).stores({
      dicts: '&name,trans,usphone,ukphone,notation,*add_time',
    })
  }
  getTimedDicts() {
    return this.dicts.orderBy('add_time').reverse().toArray()
  }

  async clean() {
    try {
      // Close the current database connection
      await this.close()

      // Delete the database
      await this.delete()

      // Reopen the database
      await this.open()

      console.log('Database cleaned successfully')
      return true
    } catch (error) {
      console.error('Error cleaning database:', error)
      return false
    }
  }
}

export const dictDB = new DictDB()
window.dictDB = dictDB
