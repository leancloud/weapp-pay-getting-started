const wxpay = require('./wxpay');

const validateSign = results => {
  const sign = wxpay.sign(results);
  if (sign !== results.sign) {
    const error = new Error('微信返回参数签名结果不正确');
    error.code = 'INVALID_RESULT_SIGN';
    throw error;
  };
  return results;
};

const handleError = results => {
  if (results.return_code === 'FAIL') {
    throw new Error(results.return_msg);
  }
  if (results.result_code !== 'SUCCESS') {
    const error = new Error(results.err_code_des);
    error.code = results.err_code;
    throw error;
  }
  return results;
};

module.exports = {
  validateSign,
  handleError,
};