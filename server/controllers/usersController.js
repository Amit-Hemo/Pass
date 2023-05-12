const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const OtpModel = require('../models/otpModel');
const TagModel = require('../models/tagModel');
const PurchaseModel = require('../models/purchaseModel');
const generateOTP = require('../utils/generateOTP');
const sendOTPEmail = require('../utils/sendOTPEmail');
const sendResetPasswordEmail = require('../utils/sendResetPasswordEmail');

async function getUser(req, res) {
  const { uuid } = req.params;

  try {
    const user = await UserModel.findOne({ uuid })
      .select('uuid firstName lastName email -_id')
      .lean();
    if (!user) return res.status(404).send({ error: 'User not found' });

    return res.json({ user });
  } catch (error) {
    return res.status(500).send({ error: 'Server error' });
  }
}

async function createUser(req, res) {
  const {
    firstName: firstNameInput,
    lastName: lastNameInput,
    email: emailInput,
    password: passwordInput,
  } = req.body;

  try {
    const { firstName, lastName, email, uuid } = await UserModel.create({
      firstName: firstNameInput,
      lastName: lastNameInput,
      email: emailInput,
      password: passwordInput,
    });

    await OtpModel.deleteMany({ email });
    const otp = generateOTP();

    await OtpModel.create({ email, otp });

    res.json({
      message: 'The user has been created successfully',
      uuid,
      firstName,
      lastName,
      email,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).send({
        error: 'The email is already used by an account',
        client: 'כתובת האימייל תפוסה',
      });
    } else {
      return res.status(500).send({ error: 'Server error' });
    }
  }
}

async function updateUser(req, res) {
  const { uuid: uuidInput } = req.params;
  const updatedUserInfo = req.body;

  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { uuid: uuidInput },
      updatedUserInfo,
      {
        new: true,
      }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { uuid, firstName, lastName, email } = updatedUser;

    res.json({ uuid, firstName, lastName, email });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).send({
        error: 'The email is already used by an account',
        client: 'כתובת האימייל תפוסה',
      });
    } else {
      return res.status(500).send({ error: 'Server error' });
    }
  }
}

async function loginUser(req, res) {
  const { email: emailInput, password } = req.body;

  try {
    const user = await UserModel.findOne({ email: emailInput });
    if (!user)
      return res
        .status(404)
        .json({ error: 'User not found', client: 'אחד מהפרטים שהוזנו שגוי' });

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword)
      return res
        .status(401)
        .json({ error: 'Wrong password', client: 'אחד מהפרטים שהוזנו שגוי' });

    if (!user.verified) {
      return res.status(401).json({
        error: 'User must be verified before login',
        client: 'המשתמש לא אומת, יש להשלים את תהליך האימות בדף הבא',
      });
    }

    const accessToken = user.generateAccessToken(user.uuid);
    const refreshToken = user.generateRefreshToken(user.uuid);

    user.refreshToken = refreshToken;
    await user.save();

    const { uuid, firstName, lastName, email } = user;
    return res.json({
      accessToken,
      refreshToken,
      user: { uuid, firstName, lastName, email },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}

async function logoutUser(req, res) {
  const { refreshToken } = req.body;

  try {
    const user = await UserModel.findOneAndUpdate(
      { refreshToken },
      { refreshToken: null },
      { new: true }
    );
    if (!user) return res.status(401).json({ error: 'User not found' });

    return res
      .status(200)
      .json({ message: 'The user is logged out successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}

async function handleRefreshToken(req, res) {
  const { refreshToken } = req.body;

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await UserModel.findOne({ refreshToken });
    if (!user)
      return res.status(403).json({ error: 'Refresh token not found' });

    const accessToken = user.generateAccessToken(decoded.uuid);
    return res.json({ accessToken });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).send({ error: 'Token is expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(403).send({ error: 'Invalid Token' });
    } else {
      console.log(error);
      return res.status(500).send({ error: 'Server error' });
    }
  }
}

async function updatePassword(req, res) {
  const { password, newPassword } = req.body;
  const { uuid } = req.params;

  try {
    const user = await UserModel.findOne({ uuid });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword)
      return res
        .status(400)
        .json({ error: 'Invalid password', client: 'הסיסמא הנוכחית שגויה' });

    const isOriginal = await user.comparePassword(newPassword);
    if (isOriginal)
      return res.status(400).json({ error: 'Password has already been used' });

    user.password = newPassword;
    await user.save();

    return res
      .status(200)
      .json({ message: 'Password has been successfully updated' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}

async function resetPassword(req, res) {
  const { newPassword } = req.body;
  const { uuid } = req.params;

  try {
    const user = await UserModel.findOne({ uuid });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isOriginal = await user.comparePassword(newPassword);
    if (isOriginal)
      return res.status(400).json({
        error: 'Password has already been used',
        client: 'הסיסמא שומשה בעבר, יש לבחור סיסמא חדשה',
      });

    user.password = newPassword;
    await user.save();

    sendResetPasswordEmail({
      targetEmail: user.email,
    });

    return res
      .status(200)
      .json({ message: 'Password has been successfully reset' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}

async function forgotPassword(req, res) {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email }).lean();
    if (!user)
      return res.status(404).json({
        error: 'User not found',
        client: 'כתובת האימייל לא נמצאה במערכת',
      });

    return res.json({ message: 'Forgot password request has been approved' });
  } catch (error) {
    return res.status(500).json({ error: 'Server Error' });
  }
}

async function requestOTP(req, res) {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email }).lean();
    if (!user)
      return res.status(404).json({
        error: 'User not found',
      });

    await OtpModel.deleteMany({ email });
    const otp = generateOTP();

    await OtpModel.create({ email, otp });

    await sendOTPEmail({
      otp,
      otpExpire: 5,
      targetEmail: email,
      actionMessage: 'לסיים את תהליך האימות',
    });

    res.status(200).json({
      message: `Password reset OTP has been sent to this email: ${email}`,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}

async function validateOTP(req, res) {
  const { otp, email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const otpDocument = await OtpModel.findOne({ email });
    if (!otpDocument)
      return res.status(404).json({
        error: 'OTP is not found for that user, please resend OTP',
        client: 'הקוד שהוזן פג תוקף , יש ללחוץ על כפתור "שליחת קוד מחדש"',
      });

    const isMatch = await otpDocument.compareOTP(otp);
    if (!isMatch)
      return res.status(400).json({
        error: 'Wrong OTP',
        client: 'הקוד שהוזן שגוי, יש להזין את הקוד שנשלח באימייל',
      });

    await otpDocument.deleteOne();
    user.verified = true;
    await user.save();

    res.json({ message: 'otp is valid', uuid: user.uuid });
  } catch (error) {
    return res.status(500).json({ error: 'Error in OTP verification process' });
  }
}

async function addProductToCart(req, res) {
  const { uuid: userId } = req.params;
  const { tagUuid } = req.body;

  try {
    const user = await UserModel.findOne({ uuid: userId }).populate(
      'cart.tags'
    );
    if (!user) return res.status(404).json({ error: 'User not found' });

    const tag = await TagModel.findOne({ uuid: tagUuid }).lean();
    if (!tag) return res.status(404).json({ error: 'Tag not found' });

    const { cart } = user;

    if (
      cart.length > 0 &&
      cart[0].tags[0].attachedStore.toString() !== tag.attachedStore.toString()
    ) {
      return res.status(409).json({
        error: 'Products must be added to the cart from the same store',
        client:
          'המוצר שהוספת שייך לחנות אחרת, יש לסיים את תהליך הרכישה מול החנות הקודמת או למחוק את עגלת הקניות',
      });
    }

    const foundProduct = cart.find(
      (value) => value.product.toString() === tag.attachedProduct.toString()
    );

    if (foundProduct) {
      const isTagExists = foundProduct.tags.find(
        (value) => value._id.toString() === tag._id.toString()
      );
      if (isTagExists)
        return res.status(409).json({
          error: 'The tag is already in cart',
          client: 'המוצר כבר נסרק ונמצא בעגלת הקניות',
        });
      foundProduct.quantity++;
      foundProduct.tags.push(tag._id);
    } else {
      cart.push({ product: tag.attachedProduct, quantity: 1, tags: [tag._id] });
    }

    await user.save();

    return res.json({ message: 'Product has been added to the cart' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}

async function deleteProductFromCart(req, res) {
  const { uuid, tagUuid } = req.params;

  try {
    const user = await UserModel.findOne({ uuid });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const tag = await TagModel.findOne({ uuid: tagUuid }).lean();
    if (!tag) return res.status(404).json({ error: 'Tag not found' });

    const { cart } = user;

    const foundProduct = cart.find(
      (value) => value.product.toString() === tag.attachedProduct.toString()
    );
    if (!foundProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const isTagExists = foundProduct.tags.includes(tag._id);
    if (!isTagExists)
      return res.status(404).json({ error: 'Tag not found in the cart' });

    const productIndex = cart.indexOf(foundProduct);

    if (foundProduct.quantity === 1) {
      cart.splice(productIndex, 1);
    } else {
      const tagIndex = foundProduct.tags.indexOf(tag._id);
      foundProduct.tags.splice(tagIndex, 1);
      foundProduct.quantity--;
    }
    await user.save();
    return res.json({ message: 'product deleted from cart' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}

async function watchCart(req, res) {
  const { uuid } = req.params;

  try {
    const user = await UserModel.findOne({ uuid })
      .select('-cart._id')
      .lean()
      .populate('cart.product', 'name size price image sku -_id')
      .populate('cart.tags', 'isAvailable attachedStore uuid -_id');
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { cart } = user;

    return res.json({ cart });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}

async function deleteCart(req, res) {
  const { uuid } = req.params;

  try {
    const user = await UserModel.findOne({ uuid });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.cart = [];
    await user.save();

    return res.json({ message: 'Cart deleted successfuly' });
  } catch (error) {
    return res.status(500).json({
      error: 'Server error',
      client: 'קרתה שגיאה בלתי צפויה במחיקת העגלה, המוצרים כבר נקנו',
    });
  }
}

async function watchPurchases(req, res) {
  const { uuid } = req.params;

  try {
    const user = await UserModel.findOne({ uuid })
      .select('purchases')
      .lean()
      .populate('purchases', '-_id -cardType -products');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { purchases } = user;

    return res.json({ purchases });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}

async function watchPurchaseById(req, res) {
  const { uuid, transactionId } = req.params;

  try {
    const user = await UserModel.findOne({ uuid })
      .select('purchases -_id')
      .lean()
      .populate({
        path: 'purchases',
        select: '-_id -products._id',
        populate: {
          path: 'products.product',
          select: '-_id',
        },
      });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const transaction = await PurchaseModel.findOne({ transactionId }).lean();
    if (!transaction)
      return res.status(404).json({ error: 'Transaction not exist' });

    const foundPurchase = user.purchases.find(
      (purchase) => purchase.transactionId === transactionId
    );
    if (!foundPurchase) {
      return res
        .status(404)
        .json({ error: 'Transaction not exist in user purchase history' });
    }

    return res.json({ foundPurchase });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  createUser,
  updateUser,
  loginUser,
  handleRefreshToken,
  logoutUser,
  updatePassword,
  forgotPassword,
  requestOTP,
  validateOTP,
  resetPassword,
  addProductToCart,
  deleteProductFromCart,
  watchCart,
  deleteCart,
  watchPurchases,
  watchPurchaseById,
  getUser,
};
