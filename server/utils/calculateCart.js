function calculateCart(cart) {
  let sum = cart.reduce((prevItem, currentItem) => {
    return prevItem + Number(currentItem.product.price) * currentItem.quantity;
  }, 0);
  price = sum.toString();

  return price;
}

module.exports = calculateCart;
