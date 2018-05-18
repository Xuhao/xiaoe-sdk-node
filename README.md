# xiaoe-sdk-node

小鹅通 SDK for Node

## 安装

    npm i xiaoe-sdk-node --save

## 使用

```javascript
const Xiaoe = require('xiaoe-sdk-node');

# Create client with your app_id and app_secret
const client = new Xiaoe('appId', 'appSecret');

const result = await client.send({ cmd: 'users.getinfo', params: { phone: '13888888888'} })
```

#### send(options)

向小鹅通API服务器发送请求，并验证返回内容。这是唯一需要用的函数。

`options`参数：
* `cmd`: 请求命令字，必填
* `version`: API版本，选填，默认值`1.0`
* `useType`: 数据的使用场景，选填，默认值`0`； 0-服务端自用，1-iOS，2-android，3-pc浏览器，4-手机浏览器，100-超级权限
* `params`: 请求业务参数，选填，默认值`{}`

API 相关信息请查看 [小鹅通api-doc](http://api-doc.xiaoe-tech.com
    )