const request = require('supertest');

const app = require('../app');
const UserModel = require('../models/userModel');
const {
  readyUserDetails,
  unverifiedUserDetails,
  noCartUserDetails,
} = require('./testUsers');
const {
  borutoShirtTag,
  anotherBorutoShirtTag,
  fromAnotherStoreTag,
  mockTag,
  thirdBorutoShirtTag,
} = require('./testTags');


describe('POST /users/login', () => {
  it('should respond with tokens and corresponding user object if login succeeded', async () => {
    const response = await request(app)
      .post('/users/login')
      .send(readyUserDetails)
      .set('Accept', 'application/json');

    expect(response.statusCode).toEqual(200);
    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('json')
    );
    expect(response.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        user: expect.objectContaining({
          uuid: expect.any(String),
          firstName: expect.any(String),
          lastName: expect.any(String),
          email: expect.any(String),
        }),
      })
    );
  });

  it('should respond with 422 status code if wrong request body', async () => {
    const wrongUserDetailsBodies = [
      {},
      { email: 'test@test', password: 'Amit222' },
      { password: 'Test123!!!' },
      { email: 'test@test.com' },
      { wrongField: 'test' },
    ];

    for (const body of wrongUserDetailsBodies) {
      const response = await request(app)
        .post('/users/login')
        .send(body)
        .set('Accept', 'application/json');
      expect(response.statusCode).toEqual(422);
    }
  });

  it('should respond with 404 status code', async () => {
    const nonExistedUserDetails = {
      email: 'no@exist.com',
      password: 'Test123!!!',
    };

    const response = await request(app)
      .post('/users/login')
      .send(nonExistedUserDetails)
      .set('Accept', 'application/json');
    expect(response.statusCode).toEqual(404);
  });

  it('should respond with 401 status code for wrong password', async () => {
    const wrongPwdUserDetails = {
      ...readyUserDetails,
      password: 'wrongPassword123!',
    };

    const response = await request(app)
      .post('/users/login')
      .send(wrongPwdUserDetails)
      .set('Accept', 'application/json');
    expect(response.statusCode).toEqual(401);
    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('json')
    );
    expect(response.body?.error).toEqual('Wrong password');
  });

  it('should respond with 401 status code for unverified user', async () => {
    const response = await request(app)
      .post('/users/login')
      .send(unverifiedUserDetails)
      .set('Accept', 'application/json');
    expect(response.statusCode).toEqual(401);
    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('json')
    );
    expect(response.body?.error).toEqual('User must be verified before login');
  });

  afterAll(async () => {
    await UserModel.findOneAndUpdate(
      { email: readyUserDetails.email },
      { refreshToken: null }
    );
  });
});

describe('POST&DELETE /users/:uuid/cart(/:tagUuid) integration', () => {
  let noCartUserAccessToken = '';
  let noCartUserUuid = '';
  beforeAll(async () => {
    const response = await request(app)
      .post('/users/login')
      .send(noCartUserDetails)
      .set('Accept', 'application/json');
    noCartUserAccessToken = response.body?.accessToken;
    noCartUserUuid = response.body?.user?.uuid;
  });

  it('should increase cart.length to 1 if the product was added to cart', async () => {
    const response = await request(app)
      .post(`/users/${noCartUserUuid}/cart`)
      .send({ tagUuid: borutoShirtTag })
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${noCartUserAccessToken}`);

    expect(response.statusCode).toEqual(200);

    //check cart length
    const user = await UserModel.findOne({ uuid: noCartUserUuid })
      .select('cart')
      .lean();
    expect(user.cart?.length).toEqual(1);
  });

  it('should increase cart.length to 2 and product quantity to 2 when adding the same product', async () => {
    const response = await request(app)
      .post(`/users/${noCartUserUuid}/cart`)
      .send({ tagUuid: anotherBorutoShirtTag })
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${noCartUserAccessToken}`);

    expect(response.statusCode).toEqual(200);

    //check cart length
    const user = await UserModel.findOne({ uuid: noCartUserUuid })
      .select('cart')
      .lean();
    expect(user.cart?.length).toEqual(1);
    console.log('quantity:', user.cart[0].quantity);
    expect(user.cart[0].quantity).toEqual(2);
  });

  it('should respond with 409 if the tag is from another store of the current cart (POST)', async () => {
    const response = await request(app)
      .post(`/users/${noCartUserUuid}/cart`)
      .send({ tagUuid: fromAnotherStoreTag })
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${noCartUserAccessToken}`);

    expect(response.statusCode).toEqual(409);
    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('json')
    );
    expect(response.body?.error).toEqual(
      'Products must be added to the cart from the same store'
    );
  });

  it('should respond with 409 if the tag is already in cart (POST)', async () => {
    const response = await request(app)
      .post(`/users/${noCartUserUuid}/cart`)
      .send({ tagUuid: anotherBorutoShirtTag })
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${noCartUserAccessToken}`);

    expect(response.statusCode).toEqual(409);
    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('json')
    );
    expect(response.body?.error).toEqual('The tag is already in cart');
  });

  it('should respond with 404 if tag is not cart (DELETE)', async () => {
    const user = await UserModel.findOne({ uuid: noCartUserUuid })
      .select('cart')
      .lean();

    if (user?.cart?.length < 1)
      fail('one of the two POST tests were failed (good flow), fix them first');
    if (user?.cart[0]?.quantity < 2)
      fail('one of the two POST tests were failed (good flow), fix them first');

    const response = await request(app)
      .delete(`/users/${noCartUserUuid}/cart/${thirdBorutoShirtTag}`)
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${noCartUserAccessToken}`);

    expect(response.statusCode).toEqual(404);
    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('json')
    );
    expect(response.body?.error).toEqual('Tag not found in the cart');
  });

  it('should make the cart empty if the products were deleted from the cart', async () => {
    const user = await UserModel.findOne({ uuid: noCartUserUuid })
      .select('cart')
      .lean();

    if (user?.cart?.length < 1)
      fail('one of the two POST tests were failed (good flow), fix them first');
    if (user?.cart[0]?.quantity < 2)
      fail('one of the two POST tests were failed (good flow), fix them first');

    for (const tagUuid of [borutoShirtTag, anotherBorutoShirtTag]) {
      const response = await request(app)
        .delete(`/users/${noCartUserUuid}/cart/${tagUuid}`)
        .set('Accept', 'application/json')
        .set('authorization', `Bearer ${noCartUserAccessToken}`);

      expect(response.statusCode).toEqual(204);
    }

    const userAfterDelete = await UserModel.findOne({ uuid: noCartUserUuid })
      .select('cart')
      .lean();

    expect(userAfterDelete?.cart?.length).toEqual(0);
  });

  it('should respond with 404 if tag is not exist in db(POST&DELETE)', async () => {
    const postResponse = await request(app)
      .post(`/users/${noCartUserUuid}/cart`)
      .send({ tagUuid: mockTag })
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${noCartUserAccessToken}`);

    expect(postResponse.statusCode).toEqual(404);
    expect(postResponse.headers['content-type']).toEqual(
      expect.stringContaining('json')
    );
    expect(postResponse.body?.error).toEqual('Tag not found');

    const deleteResponse = await request(app)
      .delete(`/users/${noCartUserUuid}/cart/${mockTag}`)
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${noCartUserAccessToken}`);

    expect(deleteResponse.statusCode).toEqual(404);
    expect(deleteResponse.headers['content-type']).toEqual(
      expect.stringContaining('json')
    );
    expect(deleteResponse.body?.error).toEqual('Tag not found');
  });

  it('should respond with 404 if product is not in cart (DELETE)', async () => {
    const response = await request(app)
      .delete(`/users/${noCartUserUuid}/cart/${borutoShirtTag}`)
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${noCartUserAccessToken}`);

    expect(response.statusCode).toEqual(404);
    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('json')
    );
    expect(response.body?.error).toEqual('Product not found');
  });

  afterAll(async () => {
    await UserModel.findOneAndUpdate(
      { email: noCartUserDetails.email },
      { refreshToken: null, cart: [] }
    );
  });
});
