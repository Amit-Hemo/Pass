const express = require('express');

const storesController = require('../controllers/storesController');
const validateResource = require('../middlewares/validateResource');
const skuSchema = require('../schemas/skuSchema');
const productSchema = require('../schemas/productSchema');
const storeSchema = require('../schemas/storeSchema');
const uuidSchema = require('../schemas/uuidSchema')

const router = express.Router();

router.get(
  '/tags/:uuid',
  validateResource({
    params: uuidSchema
  }),
  storesController.getProduct
);

router.post(
  '/',
  validateResource({ body: storeSchema }),
  storesController.createStore
);

router.post(
  '/productsFactory',
  validateResource({
    body: productSchema,
  }),
  storesController.createProduct
);

router.post(
  '/:merchantID/products',
  validateResource({
    params: storeSchema.pick({ merchantID: true }),
    body: skuSchema,
  }),
  storesController.addProductToStore
);

module.exports = router;
