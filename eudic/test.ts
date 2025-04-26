namespace EudicTest {
  const { deleteStudyListCategory } = require('./api')

  deleteStudyListCategory('133900804293146580', 'en', 'qwerty')
    .then((result) => console.log('Category deleted:', result))
    .catch((error) => console.error('Error deleting category:', error))
}
