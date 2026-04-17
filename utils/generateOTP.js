const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiry = Date.now() + 5 * 60 * 1000; // 5 min

  return { otp, expiry };
};

module.exports = generateOTP;