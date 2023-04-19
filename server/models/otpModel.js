const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: (value) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value),
      message: "please fill a valid email address",
    },
  },
  otp: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 4,
  },
  expireAt: {
    type: Date,
    expires: 300,
    default: Date.now,
  },
});

otpSchema.pre("save", async function (next) {
  if (!this.isModified("otp")) next();

  try {
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    const hashedOTP = await bcrypt.hash(this.otp, salt);

    this.otp = hashedOTP;

    next();
  } catch (error) {
    next(error);
  }
});

otpSchema.methods.compareOTP = async function (otp) {
  const isEqual = await bcrypt.compare(otp, this.otp);
  return isEqual;
};

const OtpModel = mongoose.models.OTP || mongoose.model("OTP", otpSchema);

module.exports = OtpModel;
