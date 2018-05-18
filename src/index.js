const crypto = require('crypto');
const https = require('https');
const querystring = require('querystring');

const sign = Symbol('Xiaoe#sign');
const prepareParams = Symbol('Xiaoe#prepareParams');
const verifyResponse = Symbol('Xiaoe#verifyResponse');

module.exports = class Xiaoe {
  constructor(appId, appSecret) {
    this.appId = appId;
    this.appSecret = appSecret;
  }

  // eslint-disable-next-line
  async send({ cmd, version = '1.0', useType = '0', params = {} }) {
    try {
      const postData = querystring.stringify(this[prepareParams](useType, params));
      const response = await new Promise((resolve, reject) => {
        const request = https.request({
          hostname: 'api.xiaoe-tech.com',
          path: `/open/${cmd}/${version}`,
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // eslint-disable-next-line
        }, res => {
          let data = '';
          // eslint-disable-next-line
          res.on('data', chunk => { data += chunk });
          res.on('end', () => resolve(JSON.parse(data)));
        });
        request.on('error', error => reject(error));
        request.write(postData);
        request.end();
      });
      return this[verifyResponse](response);
    } catch (error) {
      return { code: 100, msg: `API请求发生错误: ${error.message}`, error };
    }
  }

  [verifyResponse](response) {
    if (response.app_id !== this.appId) {
      return {
        code: -40101, msg: '服务器返回app_id异常', data: [], origin_data: response,
      };
    }

    const { sign: signature, ...rest } = response;
    if (!signature || this[sign](rest) !== signature) {
      return {
        code: -100, msg: '服务器返回的签名校验出错', data: [], origin_data: response,
      };
    }
    return response;
  }

  [prepareParams](useType, logicParams) {
    const params = {
      app_id: this.appId,
      data: logicParams,
      // eslint-disable-next-line
      timestamp: ~~(Date.now() / 1000),
      use_type: useType,
    };
    return { ...params, sign: this[sign](params) };
  }


  [sign](params) {
    const orderedParams = Object.keys(params).sort().reduce((sum, k) => {
      sum.push(`${k}=${JSON.stringify(params[k])}`);
      return sum;
    }, []);
    orderedParams.push(`app_secret=${this.appSecret}`);
    const query = orderedParams.join('&');

    return crypto.createHash('md5').update(query).digest('hex');
  }
};
