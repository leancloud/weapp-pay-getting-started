const axios = require('axios');

const APPID = process.env.WEIXIN_APPID;
const APPSECRET = process.env.WEIXIN_APPSECRET;

let accessToken = {
  value: null,
  expiredAt: 0,
};

const refreshToken = () => {
  console.log('refresh accessToken');
  return axios.get('https://api.weixin.qq.com/cgi-bin/token', {
    params: {
      grant_type: 'client_credential',
      appid: APPID,
      secret: APPSECRET,
    }
  }).then(({data : { access_token, expires_in, errcode, errmsg }}) => {
    if (errcode) {
      console.error(errcode, errmsg);
      throw new Eror(errmsg);
    }
    accessToken = {
      value: access_token,
      expiredAt: Date.now() + expires_in * 1000,
    };
    return access_token;
  })
  };

exports.getAccessToken = () => Promise.resolve().then(() => {
  if (accessToken.expiredAt > Date.now()) {
    if (accessToken.value) return accessToken.value;
  }
  return refreshToken();
})