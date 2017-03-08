const router = require('express').Router();
const AV = require('leanengine');
const Order = require('../order');
const wxpay = require('../wxpay');
const { validateSign } = require('../utils');

const format = '___-_-_ _:_:__';
const formatTime = time => 
  new Date(
    time.split('')
      .map((value, index) => value + format[index])
      .join('').replace(/_/g, '')
    );

// 微信支付成功通知
router.post('/pay-callback', wxpay.useWXCallback((msg, req, res, next) => {
  // 处理商户业务逻辑
  validateSign(msg);
  const {
    result_code,
    err_code,
    err_code_des,
    out_trade_no,
    time_end,
    transaction_id,
    bank_type,
  } = msg;
  console.log('pay callback: ' + out_trade_no);
  new AV.Query(Order).include('user').equalTo('tradeId', out_trade_no).first({
    useMasterKey: true,
  }).then(order => {
    if (!order) throw new Error(`找不到订单${out_trade_no}`);
    if (order.status === 'SUCCESS') return;
    
    return order.save({
      status: result_code,
      errorCode: err_code,
      errorCodeDes: err_code_des,
      paidAt: formatTime(time_end),
      transactionId: transaction_id,
      bankType: bank_type,
    }, {
      useMasterKey: true,
    }).then(() => {
      // 需要延迟发送，否则可能会 form_id 无效
      setTimeout(() => order.sendNotice(), 5000);
    });
  }).then(() => {
    res.success();
  }).catch(error => {
    console.error(error.message);
    res.fail(error.message)
  });
}));

module.exports = router;
