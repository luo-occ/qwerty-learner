import { getPhoneticData } from './api/phonetics.js'

const data = await getPhoneticData('hello')

console.log(data)
