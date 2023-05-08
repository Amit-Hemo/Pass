function calculateCartPrice(cart) {
  if (!cart) return 0;
  let price = cart.reduce((prevItem, currentItem) => {
    return prevItem + Number(currentItem.product.price) * currentItem.quantity;
  }, 0);
  price = price.toString();

  return price;
}

export default calculateCartPrice;
