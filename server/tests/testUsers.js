//verified, has cutomerId and payment method saved, has items in cart
const readyUserDetails = {
  email: 'ready@user.com',
  password: 'Test123!!',
};

//verified, has customerId but no items in cart
const noCartUserDetails = {
  email: 'no@cart.com',
  password: 'Test123!!',
};

const unverifiedUserDetails = {
  email: 'un@verified.com',
  password: 'Test123!!',
};

//verified but no customer
const noCustomerUserDetails = {
  email: 'no@customer.com',
  password: 'Test123!!',
};

module.exports = {
  readyUserDetails,
  unverifiedUserDetails,
  noCustomerUserDetails,
  noCartUserDetails,
};
