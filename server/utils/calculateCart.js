function calculateCart(cart) {
  if (!Array.isArray(cart)) {
    throw new Error('Unexpected error when calculating the total price of the cart');
  }
  let sum = cart.reduce((prevItem, currentItem) => {
    return prevItem + Number(currentItem.product.price) * currentItem.quantity;
  }, 0);
  price = sum.toString();

  return price;
}

module.exports = calculateCart;
