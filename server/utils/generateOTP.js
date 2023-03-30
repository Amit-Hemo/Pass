function generateOTP() {
  return Math.floor(Math.random() * 8999 + 1000).toString();
}

module.exports = generateOTP;
