

# market 合约技术方案


<div STYLE="page-break-after: always;"></div>
#  合约设计

##  合约方法设计

- **初始化**

合约初始化的时候存入了5种商品,商品信息如下:

```
 		goods[1].Name = "商品1";
        goods[1].Code = 1;
        goods[1].Price = 250000000;
        goods[1].BCBPrice = 1250000000;
        goods[1].Repertory = 40;
        
        goods[2].Name = "商品2";
        goods[2].Code = 2;
        goods[2].Price = 50000000;
        goods[2].BCBPrice = 25000000;
        goods[2].Repertory = 20;
        
        goods[3].Name = "商品3";
        goods[3].Code = 3;
        goods[3].Price = 140000000;
        goods[3].BCBPrice = 70000000;
        goods[3].Repertory = 0;
        
        goods[4].Name = "商品4";
        goods[4].Code = 4;
        goods[4].Price = 220000000;
        goods[4].BCBPrice = 110000000;
        goods[4].Repertory = 30;
        
        goods[5].Name = "商品5";
        goods[5].Code = 5;
        goods[5].Price = 220000000;
        goods[5].BCBPrice = 110000000;
        goods[5].Repertory = 8;
```



###  Buy

**方法原型**

```
 func Buy(code string)
```

**调用结构**

```
transaction = {
    "note": "market buy",
    "gasLimit": "25000",
    "calls": [
    {
        "contract": "bcbtJ4zVVdGeVNNhBNYRNzoYAvDyyZdtwcDXS",
        "method": "Transfer(types.Address,bn.Number)",
        "params": ["bcbt2Lj2bDCpp6bff3Y7VB9TJStRzNSKMTenK", "xxxxxx"]
    },
    {
        "contract": "bcbtBAVVC4Q158Vgci6TeKeht9hVTBYXsc5ah",
        "method": "Buy(string)",
        "params": ["1"]
    }]
};
```

**功能说明**

- 购买商品，输入金额必须是价格的整数倍



###  Reset

**方法原型**

```
func Reset()
```

**调用结构**

```
transaction = {
    "note": "market reset",
    "gasLimit": "25000",
    "calls": [
    {
        "contract": "bcbtBAVVC4Q158Vgci6TeKeht9hVTBYXsc5ah",
        "method": "Reset()",
        "params": [],
    }]
};
```

**功能说明**

- 重置商品库存



###  查询商品列表

**查询链接**

```html
https://test-earth.bcbchain.io/abci_query?path="/org9ib7PkkqhjV1A3hMXVgPcoBoxkL3iKdnS/market/goods"
```

**返回结果**

```json
[
    {"name":"商品1","code":"1","price":250000000,"bCBprice":125000000,"repertory":20},
    {"name":"商品2","code":"2","price":50000000,"bCBprice":25000000,"repertory":25},
    {"name":"商品3","code":"3","price":140000000,"bCBprice":70000000,"repertory":5},
    {"name":"商品4","code":"4","price":220000000,"bCBprice":110000000,"repertory":0},
    {"name":"商品5","code":"5","price":220000000,"bCBprice":110000000,"repertory":30}
]
```



###  查询交易记录

**方法原型**

```
https://test-earth.bcbchain.io/abci_query?path="/org9ib7PkkqhjV1A3hMXVgPcoBoxkL3iKdnS/market/records/<address>"
```

> `<address>` 需要用实际的账户地址替换

**返回结果**

```
[
    {"id":1, "time": "2020-02-29 15:00:00", "address": "xxxxx", "goodsCode": "1", "goodsPrice": 250000000, "buyNum": 1, "used": 250000000},
    {"id":2, "time": "2020-02-29 15:00:00", "address": "xxxxx", "goodsCode": "1", "goodsPrice": 250000000, "buyNum": 1, "used": 250000000},
]
```
