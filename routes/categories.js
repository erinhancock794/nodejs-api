const express = require('express');
const router = express.Router();

const allCategories = ['school', 'work', 'health']

function validateCategory(array, category) {
    return Boolean(array.find((i) => i === category));
  }

//GET all categories
router.get('/', (req, res) => {
    res.status(200).json(allCategories);
  });

  //POST add new category
  router.post('/add', (req, res) => {
      const { category } = req.body;
      //add validation
      allCategories.push(category);
      res.status(200).json({
          message: 'success',
          categories: allCategories

      })

  });

  //PUT update a category

  router.put('/update/:currentCategory', (req, res) => {
      console.log('allCategories------>', allCategories);
    const { currentCategory } = req.params;

    const { category } = req.body;
    console.log('categoryu', category);

    const isCurrentCategoryValid = validateCategory(allCategories, currentCategory)
    console.log('isCurrentCategoryValid', isCurrentCategoryValid);

    const isNewCategoryValid = !validateCategory(allCategories, category);
    console.log('isNewCategoryValid', isNewCategoryValid);

    if (!isCurrentCategoryValid) {
        res.status(404).json({
            error: true,
            message: 'Cannot update a category that does not exist.'
        })

    } else if (!isNewCategoryValid) {
        res.status(404).json({
            error: true,
            message: 'This category already exists.'
        })
    } else {
        const index = allCategories.findIndex((i) => i === currentCategory);
        allCategories.splice(index, 1, category)
        res.status(200).json({
            message: 'success',
            previousCategory: currentCategory,
            updatedCategory: category,
            categories: allCategories
        })
    }
  })

  //DELETE remove a category
  router.delete('/:currentCategory', (req, res) => {
      const { currentCategory } = req.params;
      const isCurrentCategoryValid = validateCategory(allCategories, currentCategory)
      if (!isCurrentCategoryValid) {
          res.status(404).json({
              error: true,
              message: 'Category not found.'
          })
      } else {
        const index = allCategories.findIndex((i) => i === currentCategory);
        allCategories.splice(index, 1);
        res.status(200).json({ message: 'success', categories: allCategories });

      }

    })



module.exports = router;
