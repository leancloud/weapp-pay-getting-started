const uuid = require('uuid/v4');
const AV = require('leanengine');
const Order = require('./order');
const wxpay = require('./wxpay');

/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('hello', function(request, response) {
  response.success('Hello world!');
});

/** 
 * 小程序创建订单
 */
AV.Cloud.define('order', (request, response) => {
  const user = request.currentUser;
  if (!user) {
    return response.error(new Error('用户未登录'));
  }
  const authData = user.get('authData');
  if (!authData || !authData.lc_weapp) {
    return response.error(new Error('当前用户不是小程序用户'));
  }
  const order = new Order();
  order.tradeId = uuid().replace(/-/g, '');
  order.status = 'INIT';
  order.user = request.currentUser;
  order.productDescription = 'LeanCloud-小程序支付测试';
  order.amount = 1;
  order.ip = request.meta.remoteAddress;
  if (!(order.ip && /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(order.ip))) {
    order.ip = '127.0.0.1';
  }
  order.tradeType = 'JSAPI';
  const acl = new AV.ACL();
  // 只有创建订单的用户可以读，没有人可以写
  acl.setPublicReadAccess(false);
  acl.setPublicWriteAccess(false);
  acl.setReadAccess(user, true);
  acl.setWriteAccess(user, false);
  order.setACL(acl);
  order.place().then(() => {
    console.log(`预订单创建成功：订单号 [${order.tradeId}] prepayId [${order.prepayId}]`);
    const payload = {
      appId: process.env.WEIXIN_APPID,
      timeStamp: String(Math.floor(Date.now() / 1000)),
      package: `prepay_id=${order.prepayId}`,
      signType: 'MD5',
      nonceStr: String(Math.random()),
    }
    payload.paySign = wxpay.sign(payload);
    response.success(payload);
  }).catch(error => {
    console.error(error);
    response.error(error);
  });
});
