const express = require('express');

const storesController = require('../controllers/storesController');
const verifyAccessToken = require('../middlewares/verifyAccessToken');
const validateResource = require('../middlewares/validateResource');
const skuSchema = require('../schemas/skuSchema');
const productSchema = require('../schemas/productSchema');
const storeSchema = require('../schemas/storeSchema');

const router = express.Router();

router.get(
  '/:merchantID/products/:sku',
  validateResource({
    params: skuSchema.merge(storeSchema.pick({ merchantID: true })),
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
