# 小程序微信支付示例

小程序微信支付「后端商户系统」。配合 LeanCloud 小程序 SDK 快速实现小程序微信支付功能。

## 部署

### 配置环境变量

开始之前，请确保已经按照下面的步骤完成了环境变量的配置：

1. 进入应用控制台 - 云引擎 - 设置
2. 设置应用的二级域名并保存
3. 添加并保存以下环境变量
  - `WEIXIN_APPID`：小程序 AppId
  - `WEIXIN_MCHID`：微信支付商户号
  - `WEIXIN_PAY_SECRET`：微信支付 API 密钥（[微信商户平台](https://pay.weixin.qq.com) - 账户设置 - API安全 - 密钥设置）
  - `WEIXIN_NOTIFY_URL`：`https://{{yourdomain}}.leanapp.cn/weixin/pay-callback`，其中 `yourdomain` 是第二步中设置的二级域名

<details>
<summary>Example</summary>
![image](https://cloud.githubusercontent.com/assets/175227/22236906/7c651c80-e243-11e6-819b-007d5862bdbf.png)
</details>

### 本地开发

首先确认本机已经安装 [Node.js](http://nodejs.org/) 运行环境和 [LeanCloud 命令行工具](https://leancloud.cn/docs/leanengine_cli.html)，然后执行下列指令：

```
$ git clone https://github.com/leancloud/weapp-pay-getting-started.git
$ cd weapp-pay-getting-started
```

安装依赖：

```
npm install
```

登录并关联应用：

```
lean login
lean checkout
```

启动项目：

```
lean up
```

之后你就可以在 [localhost:3001](http://localhost:3001) 调试云函数了。

### 部署

部署到预备环境（若无预备环境则直接部署到生产环境）：
```
lean deploy
```

## 支付流程

1. 登录用户在小程序客户端通过 JavaScript SDK 调用名为 `order` 的云函数下单。
2. `order` 函数调用微信支付统一下单 API，创建「预订单」并保存在 Order 表中，返回签名过的预订单信息。
3. 在小程序客户端调用支付 API，传入 2 中返回的预订单信息，发起支付。
4. 支付成功后，微信通知 `/weixin/pay-callback` 支付成功，pay-callback 将对应的 order 状态更新为 `SUCCESS`。

客户端的实例代码参见 [leancloud/leantodo-weapp](https://github.com/leancloud/leantodo-weapp)。

## 相关文档

* 小程序
  * [在小程序中使用 LeanCloud](https://leancloud.cn/docs/weapp.html)
  * [小程序支付客户端示例项目（LeanTodo)](https://github.com/leancloud/leantodo-weapp)
* 支付
  * [小程序客户端发起支付 API](https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-pay.html)
  * [微信支付统一下单 API 参数与错误码](https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=9_1)
  * [微信支付结果通知参数](https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=9_7)
* 云引擎
  * [云函数开发指南](https://leancloud.cn/docs/leanengine_cloudfunction_guide-node.html)
  * [网站托管开发指南](https://leancloud.cn/docs/leanengine_webhosting_guide-node.html)
  * [JavaScript 开发指南](https://leancloud.cn/docs/leanstorage_guide-js.html)
  * [JavaScript SDK API](https://leancloud.github.io/javascript-sdk/docs/)
  * [Node.js SDK API](https://github.com/leancloud/leanengine-node-sdk/blob/master/API.md)
  * [命令行工具使用指南](https://leancloud.cn/docs/cloud_code_commandline.html)
  * [云引擎常见问题和解答](https://leancloud.cn/docs/leanengine_faq.html)
