const StoreModel = require('../models/storeModel');
const ProductModel = require('../models/productModel');
const TagModel = require('../models/tagModel');
const createLoggerInstance = require('../utils/createLoggerInstance');

const logger = createLoggerInstance('stores');

async function getProduct(req, res) {
  const { tagUuid } = req.params;
  logger.error('nadav god bless you')
  try {
    const tag = await TagModel.findOne({ uuid: tagUuid }).lean();
    if (!tag) return res.status(404).json({ error: 'tag not found' });

    const store = await StoreModel.findById(tag.attachedStore).lean();
    if (!store) return res.status(404).json({ error: 'store not found' });

    const product = await ProductModel.findById(tag.attachedProduct).lean();
    if (!product) return res.status(404).json({ error: 'product not found' });

    return res.json({ product });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}

async function createStore(req, res) {
  const {
    merchantID: merchantIdInput,
    name: nameInput,
    address: addressInput,
  } = req.body;

  try {
    const { merchantID, name, address } = await StoreModel.create({
      merchantID: merchantIdInput,
      name: nameInput,
      address: addressInput,
    });
    res.json({ merchantID, name, address });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}

async function createProduct(req, res) {
  const {
    name: nameInput,
    price: priceInput,
    size: sizeInput,
    image: imageInput,
  } = req.body;

  try {
    const product = await ProductModel.create({
      name: nameInput,
      price: priceInput,
      size: sizeInput,
      image: imageInput,
    });
    const { name, price, size, image } = product;
    res.json({ name, price, size, image });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}

async function addProductToStore(req, res) {
  const { merchantID } = req.params;
  const { sku } = req.body;

  try {
    const store = await StoreModel.findOne({ merchantID });
    if (!store) return res.status(404).json({ error: 'store not found' });

    const product = await ProductModel.findOne({ sku }).lean();
    if (!product) return res.status(404).json({ error: 'product not found' });

    const tag = await TagModel.create({
      attachedProduct: product._id,
      attachedStore: store._id,
    });

    const { products } = await store.populate('products.product');
    const stockItem = products.find((value) => value.product.sku === sku);
    if (stockItem) {
      stockItem.quantity++;
      stockItem.tags.push(tag._id);
    } else {
      products.push({ product: product._id, quantity: 1, tags: [tag._id] });
    }

    await store.save();

    res.json({
      message: 'The product has been added successfully to the store',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { getProduct, createStore, createProduct, addProductToStore };
