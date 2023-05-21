function filterUnavailableTags(cart) {
  if (!Array.isArray(cart)) {
    throw new Error('Unexpected error when filtering the cart');
  }
  const updatedCart = cart.reduce((currentCart, cartItem) => {
    const availableTags = cartItem.tags.filter((tag) => tag.isAvailable);
    const newQuantity = availableTags.length;
    if (newQuantity > 0) {
      currentCart.push({
        ...cartItem,
        tags: availableTags,
        quantity: newQuantity,
      });
    }
    return currentCart;
  }, []);

  return updatedCart;
}

export default filterUnavailableTags;
