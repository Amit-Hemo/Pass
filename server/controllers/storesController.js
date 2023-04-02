const StoreModel = require("../models/storeModel");
const ProductModel = require("../models/productModel");

async function getProduct(req, res) {
  const { sku, merchantID } = req.params;

  try {
    const store = await StoreModel.findOne({ merchantID });

    if (!store) return res.status(404).json({ error: "store not found" });

    const { products } = await store.populate("products.product");
    const stockItem = products.find((value) => value.product.sku === sku);
    if (!stockItem) return res.status(404).json({ error: "product not found" });

    const { name, price, image, size } = stockItem.product;

    return res.json({ sku, name, price, image, size });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
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
    return res.status(500).json({ error: "Server error" });
  }
}

async function createProduct(req, res) {
  const { merchantID } = req.params;
  const {
    name: nameInput,
    price: priceInput,
    size: sizeInput,
    image: imageInput,
  } = req.body;

  try {
    const store = await StoreModel.findOne({ merchantID });
    if (!store) return res.status(404).json({ error: "store not found" });

    const product = await ProductModel.create({
      name: nameInput,
      price: priceInput,
      size: sizeInput,
      image: imageInput,
    });

    store.products.push({ product: product._id, quantity: 10 });
    await store.save();

    const { name, price, size, image } = product;
    res.json({ name, price, size, image });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}



module.exports = { getProduct, createStore, createProduct };
