function countCartAmount(cart) {
  if(!cart) return 0;
  let amount = cart.reduce((prevItem, currentItem) => {
    return prevItem + currentItem.quantity;
  }, 0);
  amount = amount.toString();

  return amount;
}

export default countCartAmount