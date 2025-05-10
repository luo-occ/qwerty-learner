import { getStudyListCategories } from './api/eudic.js'

const data = await getStudyListCategories('en')
console.log(data)
