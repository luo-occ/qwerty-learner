export interface Word {
  name: string
  trans: string[]
  usphone: string
  ukphone: string
  notation?: string
}

export interface DictionaryResource {
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
