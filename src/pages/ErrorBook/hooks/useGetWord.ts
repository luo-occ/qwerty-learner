import { dictStore } from '@/resources/dictionary'
import type { Dictionary, Word } from '@/typings'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

export default function useGetWord(name: string, dict: Dictionary) {
  console.log('get word', name, dict)
  const { data: wordList, error, isLoading } = useSWR(dict?.url, (url) => dictStore.fetchWordList(url, dict.id))
  const [hasError, setHasError] = useState(false)

  const word: Word | undefined = useMemo(() => {
    if (!wordList) return undefined

    console.log('wordList', wordList)

    const word = wordList.find((word) => word.name === name)
    if (word) {
      return word
    } else {
      setHasError(true)
      return undefined
    }
  }, [wordList, name])

  useEffect(() => {
    if (error) setHasError(true)
  }, [error])

  return { word, isLoading, hasError }
}
