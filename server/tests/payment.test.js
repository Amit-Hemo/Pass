const request = require('supertest');

const app = require('../app');
const UserModel = require('../models/userModel');
const {
  readyUserDetails,
  noCustomerUserDetails,
  noCartUserDetails,
} = require('./testUsers');
const {
  borutoShirtTag,
  mockTag,
  transactionErrorTag,
  anotherBorutoShirtTag,
  zooShirtTag,
  thirdBorutoShirtTag,
} = require('./testTags');
const PurchaseModel = require('../models/purchaseModel');
const TagModel = require('../models/tagModel');

let accessToken;
let uuid;

async function makeTagsAvailable() {
  await TagModel.updateMany(
    {
      $or: [
        { uuid: borutoShirtTag },
        { uuid: anotherBorutoShirtTag },
        { uuid: thirdBorutoShirtTag },
        { uuid: zooShirtTag },
      ],
    },
    { $set: { isAvailable: true } }
  );
}

async function purchaseCartHappyFlow(uuid, accessToken) {
  const response = await request(app)
    .post('/payment/transaction')
    .send({ uuid })
    .set('Accept', 'application/json')
    .set('authorization', `Bearer ${accessToken}`);

  expect(response.statusCode).toEqual(200);
  expect(response.headers['content-type']).toEqual(
    expect.stringContaining('json')
  );
  expect(response.body?.transactionId).toEqual(expect.any(String));

  //check if purchase exists in this user
  const { transactionId } = response.body;
  const user = await UserModel.findOne({ uuid })
    .select('purchases')
    .populate('purchases');
  const {
    transactionId: lastPurchaseId,
    products: paidProducts,
    totalAmount,
  } = user.purchases.pop();
  await user.save();
  await PurchaseModel.deleteOne({ transactionId });
  expect(lastPurchaseId).toEqual(transactionId);

  return { paidProducts, totalAmount };
}

describe('GET /payment/customers/:uuid/generateToken', () => {
  beforeAll(async () => {
    const response = await request(app)
      .post('/users/login')
      .send(readyUserDetails)
      .set('Accept', 'application/json');

    accessToken = response.body.accessToken;
    uuid = response.body.user.uuid;
  });

  it('should respond with braintree client token if user is braintree customer', async () => {
    const response = await request(app)
      .get(`/payment/customers/${uuid}/generateToken`)
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('json')
    );
    expect(response.body).toEqual(
      expect.objectContaining({
        clientToken: expect.any(String),
      })
    );
  });

  it('should respond with 404 status code if user is not a braintree customer', async () => {
    //mocking create user and verification
    const loginResponse = await request(app)
      .post('/users/login')
      .send(noCustomerUserDetails)
      .set('Accept', 'application/json');

    const newUserAccessToken = loginResponse.body.accessToken;
    const newUserUuid = loginResponse.body.user.uuid;

    const generateTokenResponse = await request(app)
      .get(`/payment/customers/${newUserUuid}/generateToken`)
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${newUserAccessToken}`);

    //user doesn't have customerID yet
    expect(generateTokenResponse.statusCode).toEqual(404);

    const expectedErrorMessage = `User ${newUserUuid} does not have customer in the vault, create one with a POST request to /payment/customers`;
    expect(generateTokenResponse.headers['content-type']).toEqual(
      expect.stringContaining('json')
    );
    expect(generateTokenResponse.body?.error).toEqual(expectedErrorMessage);
  });
  afterAll(async () => {
    await UserModel.findOneAndUpdate(
      { email: readyUserDetails.email },
      { refreshToken: null }
    );
    await UserModel.findOneAndUpdate(
      { email: noCustomerUserDetails.email },
      { refreshToken: null }
    );
  });
});

describe('POST /transaction', () => {
  beforeAll(async () => {
    const response = await request(app)
      .post('/users/login')
      .send(readyUserDetails)
      .set('Accept', 'application/json');

    accessToken = response.body.accessToken;
    uuid = response.body.user.uuid;

    await makeTagsAvailable();
  });

  it('should respond with a transactionId which is in the Purchase collection(FAST)', async () => {
    const response = await request(app)
      .post('/payment/transaction')
      .send({ uuid, tagUuid: borutoShirtTag })
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('json')
    );
    expect(response.body?.transactionId).toEqual(expect.any(String));

    //check if purchase exists in this user
    const { transactionId } = response.body;
    const user = await UserModel.findOne({ uuid })
      .select('purchases')
      .populate('purchases');
    const lastPurchaseId = user.purchases.pop().transactionId;
    await user.save();
    await PurchaseModel.deleteOne({ transactionId });
    expect(lastPurchaseId).toEqual(transactionId);
  });

  it('should respond with 404 status code if tag is unavailable while trying to purchase(FAST)', async () => {
    const response = await request(app)
      .post('/payment/transaction')
      .send({ uuid, tagUuid: borutoShirtTag })
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(404);
    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('json')
    );
    expect(response.body?.error).toEqual('Product is unavailable');
  });

  it('should respond with a transactionId which is in the Purchase collection and the tags are disabled(CART)', async () => {
    const { paidProducts, totalAmount } = await purchaseCartHappyFlow(
      uuid,
      accessToken
    );

    //2 * boruto = 160, zoo = 45, total = 205
    expect(Number(totalAmount)).toEqual(205);
    //2 because AnotherBoruto and ThirdBoruto are of the same product and zooShirt is a different one
    expect(paidProducts?.length).toEqual(2);

    //check if there is still any available tag from those in the user cart
    const availableTags = await TagModel.find({
      uuid: { $in: [anotherBorutoShirtTag, thirdBorutoShirtTag, zooShirtTag] },
      isAvailable: true,
    }).lean();
    expect(availableTags?.length).toEqual(0);
  });

  it('should respond with a transactionId that has one product(CART)', async () => {
    await TagModel.updateMany(
      { uuid: { $in: [anotherBorutoShirtTag, thirdBorutoShirtTag] } },
      { $set: { isAvailable: true } }
    );
    await TagModel.updateOne(
      { uuid: zooShirtTag },
      { $set: { isAvailable: false } }
    );

    const { paidProducts, totalAmount } = await purchaseCartHappyFlow(
      uuid,
      accessToken
    );

    //2 * boruto = 160
    expect(Number(totalAmount)).toEqual(160);
    //2 boruto is 1 product
    expect(paidProducts?.length).toEqual(1);

    //check if there is still any available tag from those in the user cart
    const availableTags = await TagModel.find({
      uuid: { $in: [anotherBorutoShirtTag, thirdBorutoShirtTag, zooShirtTag] },
      isAvailable: true,
    }).lean();
    expect(availableTags?.length).toEqual(0);
  });

  it('should respond with 204 status code if the user cart is empty', async () => {
    const response = await request(app)
      .post('/users/login')
      .send(noCartUserDetails)
      .set('Accept', 'application/json');
    const noCartAccessToken = response.body?.accessToken;
    const noCartUuid = response.body?.user?.uuid;

    const transactionResponse = await request(app)
      .post('/payment/transaction')
      .send({ uuid: noCartUuid })
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${noCartAccessToken}`);

    await UserModel.findOneAndUpdate(
      { email: noCartUserDetails.email },
      { refreshToken: null }
    );

    expect(transactionResponse.statusCode).toEqual(204);
  });

  it('should respond with 422 status code for wrong body', async () => {
    const wrongBodies = [
      {},
      { uuid, tagUuid: borutoShirtTag, extra: 'key' },
      { tagUuid: borutoShirtTag },
      { uuid: 'invalid', tagUuid: borutoShirtTag },
      { uuid, tagUuid: 'invalid' },
    ];

    for (const body of wrongBodies) {
      const transactionResponse = await request(app)
        .post('/payment/transaction')
        .send(body)
        .set('Accept', 'application/json')
        .set('authorization', `Bearer ${accessToken}`);

      expect(transactionResponse.statusCode).toEqual(422);
    }
  });

  it('should respond with 404 status code if user is not a braintree customer', async () => {
    const response = await request(app)
      .post('/users/login')
      .send(noCustomerUserDetails)
      .set('Accept', 'application/json');
    const noCustomerAccessToken = response.body?.accessToken;
    const noCustomerUuid = response.body?.user?.uuid;

    const transactionResponse = await request(app)
      .post('/payment/transaction')
      .send({ uuid: noCustomerUuid, tagUuid: borutoShirtTag })
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${noCustomerAccessToken}`);

    await UserModel.findOneAndUpdate(
      { email: noCustomerUserDetails.email },
      { refreshToken: null }
    );

    expect(transactionResponse.statusCode).toEqual(404);
    expect(transactionResponse.headers['content-type']).toEqual(
      expect.stringContaining('json')
    );
    const expectedErrorMessage = `User ${noCustomerUuid} does not have customer in the vault, create one with a POST request to /payment/customers`;
    expect(transactionResponse.body?.error).toEqual(expectedErrorMessage);
  });

  it('should respond with 404 status code if tag is not exist(FAST)', async () => {
    const response = await request(app)
      .post('/payment/transaction')
      .send({ uuid, tagUuid: mockTag })
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(404);
    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('json')
    );
    expect(response.body?.error).toEqual('Tag not found');
  });

  it('should respond with 500 status code if there is an transaction error', async () => {
    const response = await request(app)
      .post('/payment/transaction')
      .send({ uuid, tagUuid: transactionErrorTag })
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(500);
    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('json')
    );
    expect(response.body?.error).toEqual('Do Not Honor');
  });

  afterAll(async () => {
    await UserModel.findOneAndUpdate(
      { email: readyUserDetails.email },
      { refreshToken: null }
    );
    await makeTagsAvailable();
  });
});
