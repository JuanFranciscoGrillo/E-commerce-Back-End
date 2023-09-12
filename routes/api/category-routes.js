const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [Product]
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [Product]
    });

    if (!category) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }
    res.json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.json(newCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedCategory = await Category.update(req.body, {
      where: {
        id: req.params.id
      }
    });

    if (!updatedCategory) {
      res.status(404).json({ message: 'No category found with that id to update!' });
      return;
    }

    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const categoryToDelete = await Category.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!categoryToDelete) {
      res.status(404).json({ message: 'No category found with that id to delete!' });
      return;
    }

    res.json(categoryToDelete);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
