# contractExample
## 概述

本文档为你演示如何编写符合BCB链规范的 `ICO合约` 和 `购物合约` ，之后在BCB测试链上部署智能合约、调试智能合约接口、查询智能合约相关信息；并且提供了前端示例代码，部署前端代码后可以更直观体验如何在BCB测试链上进行ICO和购物。



## 准备

工具箱下载 [toolbox](<https://github.com/bcbchain/toolbox/releases>)

下载最新版工具箱，解压到本地目录，进入解压目录执行如下命令创建名称为`demo`，密码为`Ab1@Cd3$`的钱包账户

```shell
1. 创建钱包指令
./bcw create -n demo -p Ab1@Cd3$

2. 获取钱包地址
./addr -n demo -p Ab1@Cd3$ -i bcbt

3. 返回示例
OK
Address:  bcbtFUvSUXd6xDp6WXq9yNvR3dwqKycb3ZS8c		// 此处地址只是示例，实际应该不一样
```

复制以上地址，前往[测试币申请中心](<https://ttoken.bcbchain.io/#/home>)申请测试币，每次申请将立即获取10个bcbt，每天最多申请10次。



使用如下命令查看钱包余额

```shell
./bcc balance -a bcbtFUvSUXd6xDp6WXq9yNvR3dwqKycb3ZS8c -c bcbt
```



使用如下命令向测试链注册组织，选项o指定组织名称，组织名称自定义，已被注册的组织不能重复注册

```shell
./bcc registerOrg -n demo -p Ab1@Cd3$ -o demo -g 1000000 -c bcbt
```



## ICO合约介绍

ICO合约实现通过设置ICO参数来开启ICO过程，普通用户可以在ICO开启过程中通过向合约账户转入一定数量的链基础代币，并调用指定方法来达到认购一定数量`ICO`代币的行为；用户在认购完成后可以通过合约方法随时查看ICO进程，在ICO结束后根据ICO结果通过合约方法完成退款或提取`ICO`代币。



**合约方法列表**

| 合约方法         | 描述                 | 所需Gas | 合约Owner | 普通用户 |
| ---------------- | -------------------- | ------- | --------- | -------- |
| StartRound       | 开启ICO进程方法      | 500     | √         | ×        |
| Exchange         | 认购指定数量代币方法 | 500     | √         | √        |
| Withdraw         | 提取退款或认证的代币 | 500     | √         | √        |
| CheckGoadReached | 检查ICO是否达成      | 500     | √         | √        |

**合约上链**

- 合约打包

```shell
1. 开发者打包
./smcpack -n demo -p Ab1@Cd3$ -s <contract_path>/ico/1.0/ico

2. 组织签名
./sigorg -n demo -p Ab1@Cd3$ -s ico-1.0.tar.gz
```

- 合约部署

```shell
./bcc deployContract --contractName ico --version 1.0 --orgName demo --codeFile ./ico-1.0.tar.gz --effectHeight 10 --owner bcbtFUvSUXd6xDp6WXq9yNvR3dwqKycb3ZS8c --gasLimit 1000000 --name demo --password Ab1@Cd3$ -c bcbt
```



## Market合约介绍

Market合约实现使用ICO认购的代币购买虚拟商品的过程，拥有指定代币的用户可以向合约账户转入一定数量的代币，然后调用购买方法来达到购买虚拟商品的行为；为了实现能够让用户重复购买，所以额外增加重置方法，将虚拟商品的数量重置为初始数量。



**合约方法列表**

| 合约方法 | 描述         | 所需Gas | 合约Owner | 普通用户 |
| -------- | ------------ | ------- | --------- | -------- |
| Buy      | 购买指定商品 | 500     | √         | √        |
| Reset    | 重置商品信息 | 500     | √         | ×        |

**合约上链**

- 合约打包

```shell
1. 开发者打包
./smcpack -n demo -p Ab1@Cd3$ -s <contract_path>/market/1.0/market

2. 组织签名
./sigorg -n demo -p Ab1@Cd3$ -s market-1.0.tar.gz
```

- 合约部署

```shell
./bcc deployContract --contractName market --version 1.0 --orgName demo --codeFile ./market-1.0.tar.gz --effectHeight 10 --owner bcbtFUvSUXd6xDp6WXq9yNvR3dwqKycb3ZS8c --gasLimit 1000000 --name demo --password Ab1@Cd3$ -c bcbt
```



## Demo页面

### 插件钱包

1. [浏览器插件钱包调用API](https://bcbwallet.readthedocs.io/en/latest/web_api.html)
2. [插件钱包文件（`web/chrome-extension`）](https://github.com/bcbwallet/bcbwallet-extension/releases)


### 前端部署

``` bash
# 安装依赖项
$ npm install

# 本地运行调试
$ npm run dev

# 打包生成静态页面
$ npm run generate

# 部署
# 拷贝dist目录内的文件到服务器nginx下html目录下，配置
location / {
    try_files $uri $uri/ /index.html;
    index index.html index.htm;
}
# 配置接口代理（地址根据实际地址可修改）
location ~ ^/(abci_query) {
    proxy_pass https://test-earth.bcbchain.io;
}
```

### 前端配置

1. 项目所在目录`web/vue-chain-demo`
2. `nuxt.config.js`文件下`proxy`配置的合约技术方案部署的地址
3. 本项目对插件钱包二次封装，参见`wallet.js`文件，调用方法 `this.$wallet.do()`，也可直接调用 `window.bcbWeb.onAccountChanged`

### 合约调用

1. market 合约技术方案（参见web目录下pdf文档）
2. ico 合约技术方案（参见web目录下pdf文档）
