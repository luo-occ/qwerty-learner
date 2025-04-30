import { adaptEudicWordWithPhonetics } from './adapter.js'
import type { EudicWord } from './api.js'

// Sample words to test
const testWords: EudicWord[] = [
  {
    word: 'hello',
    exp: 'an expression of greeting',
    add_time: '2023-01-01',
    star: 0,
  },
  {
    word: 'computer',
    exp: 'an electronic device for storing and processing data',
    add_time: '2023-01-01',
    star: 0,
  },
  {
    word: 'diligent',
    exp: "having or showing care and conscientiousness in one's work or duties",
    add_time: '2023-01-01',
    star: 0,
  },
  {
    word: 'phonetic',
    exp: 'relating to speech sounds',
    add_time: '2023-01-01',
    star: 0,
  },
]

async function testPhoneticData() {
  console.log('Fetching phonetic data for sample words...')

  try {
    const wordsWithPhonetics = await adaptEudicWordWithPhonetics(testWords)

    console.log('Results:')
    console.log(JSON.stringify(wordsWithPhonetics, null, 2))

    console.log('\nPhonetic Symbols Summary:')
    wordsWithPhonetics.forEach((word) => {
      console.log(`${word.name}: US [${word.usphone}], UK [${word.ukphone}]`)
    })
  } catch (error) {
    console.error('Error during test:', error)
  }
}

// Run the test
testPhoneticData()
