const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [Category, { model: Tag, through: ProductTag }]
    });
    res.json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get one product by its `id` value
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [Category, { model: Tag, through: ProductTag }]
    });

    if (!product) {
      res.status(404).json({ message: 'No product found with that id!' });
      return;
    }
    res.json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Update product by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    let productTags = await ProductTag.findAll({ where: { product_id: req.params.id }});
    const productTagIds = productTags.map(({ tag_id }) => tag_id);
    const newProductTags = req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => ({ product_id: req.params.id, tag_id }));

    const productTagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);
      
    if (productTagsToRemove) await ProductTag.destroy({ where: { id: productTagsToRemove }});
    if (newProductTags) await ProductTag.bulkCreate(newProductTags);

    res.json(product);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Delete one product by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const productToDelete = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!productToDelete) {
      res.status(404).json({ message: 'No product found with that id to delete!' });
      return;
    }

    res.json({ message: 'Product deleted!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
