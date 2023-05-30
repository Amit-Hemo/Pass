const request = require('supertest');
const jwtDecode = require('jwt-decode');

const verifyAccessToken = require('../middlewares/verifyAccessToken');
const app = require('../app');
const validateAuthUUID = require('../middlewares/validateAuthUUID');
const { readyUserDetails } = require('./testUsers');

//mocking middleware params
let req = {};
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
const next = jest.fn();

let accessToken;
let uuid;

describe('verifyAccessToken and validateAuthUUID integration', () => {
  beforeAll(async () => {
    const response = await request(app)
      .post('/users/login')
      .send(readyUserDetails)
      .set('Accept', 'application/json');
    accessToken = response.body.accessToken;
    uuid = response.body.user.uuid;
  });

  it('should call next if access token is provided with authorization header', async () => {
    req = { headers: { authorization: `Bearer ${accessToken}` } };
    verifyAccessToken(req, res, next);
    expect(next).toHaveBeenCalled();
    const { uuid: uuidFromToken } = await jwtDecode(accessToken);

    //mocking req.user = decoded.uuid
    req = { ...req, user: uuidFromToken };
  });

  it('should call next if uuid from token equals to uuid from req.params', () => {
    req = { ...req, params: { uuid } };
    const secondNext = jest.fn();
    validateAuthUUID(req, res, secondNext);
    expect(secondNext).toHaveBeenCalled();
  });

  it('should call next if uuid from token equals to uuid from req.body', () => {
    req = { ...req, body: { uuid } };
    const secondNext = jest.fn();
    validateAuthUUID(req, res, secondNext);
    expect(secondNext).toHaveBeenCalled();
  });

  it("should respond with 401 status code if uuid from token isn't equal to uuid in req", () => {
    req = { ...req, body: {}, params: { uuid: 'wrong' } };
    const secondNext = jest.fn();
    validateAuthUUID(req, res, secondNext);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should respond with 401 status code when authorization header is not exist', () => {
    req = { headers: {} };
    verifyAccessToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Authorization header not exist',
    });
  });

  it('should respond with 403 status code if token not exist', () => {
    req = { headers: { authorization: 'Bearer' } };
    verifyAccessToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Access token not exist' });
  });

  it('should respond with 403 status code if token is invalid or expired', () => {
    const expiredToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMGJjOWUyMzYtMmZkYi00YzUzLWE1MDctYzZkZGU4NGJlMzEzIiwiaWF0IjoxNjg0MDk4NTQyLCJleHAiOjE2ODQwOTk0NDJ9._qWmZBzo-QUJXf3n6sBTc8VMNGUHG9ndqMSh8AhxGww';
    req = { headers: { authorization: `Bearer ${expiredToken}` } };
    verifyAccessToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
  });
});
