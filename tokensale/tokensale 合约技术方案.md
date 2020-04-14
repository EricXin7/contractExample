

# tokensale 合约技术方案


<div STYLE="page-break-after: always;"></div>
# 合约设计

##  合约方法设计



###  StartRound

**方法原型**

```
 func StartRound(round string)
```

**调用结构**

```
transaction = {
    "note": "tokensale startRound",
    "gasLimit": "25000",
    "calls": [
    {
        "contract": "bcbtJ4zVVdGeVNNhBNYRNzoYAvDyyZdtwcDXS",
        "method": "Transfer(types.Address,bn.Number)",
        "params": ["bcbtASRVRCir9W9iCGa6Bh7Eg9o9CzNYD4nj4", "10000000000000"]
    },
    {
        "contract": "bcbtBAVVC4Q158Vgci6TeKeht9hVTBYXsc5ah",
        "method": "StartRound(string)",
        "params": ["{\"fundingGoal\":10000000000000,\"startDate\":\"2020-02-		02\",\"endDate\":\"2020-02-21\",\"exchangeRate\":100000000,\"soft\":100000000000,\"hard\":1000000000000,\"funAmount\":0}"]
    }]
};
```

**功能说明**

- 启动tokensale，设置tokensale参数



### Exchange

**方法原型**

```
func Exchange()
```

**调用结构**

```
transaction = {
    "note": "tokensale Exchange",
    "gasLimit": "25000",
    "calls": [
    {
        "contract": "bcbt3ScZC4SzPKEHZDYHe7Xsydu6PKoCxzV8g",
        "method": "Transfer(types.Address,bn.Number)",
        "params": ["bcbtASRVRCir9W9iCGa6Bh7Eg9o9CzNYD4nj4", "1000000000"]
    },
    {
        "contract": "bcbtLPy7Bu1mWUhYs6DWHsgojTt5F5MauhVag",
        "method": "Exchange()",
        "params": [],
    }]
};
```

**功能说明**

- 参数tokensale，转入bcbt，等tokensale结束得到demo币，按照设置1个bcbt兑换10个demo币。



###  Withdraw

**方法原型**

```
func Withdraw()
```

**调用结构**

```
transaction = {
    "note": "tokensale Withdraw",
    "gasLimit": "25000",
    "calls": [
    {
        "contract": "bcbtLPy7Bu1mWUhYs6DWHsgojTt5F5MauhVag",
        "method": "Withdraw()",
        "params": [],
    }]
};
```

**功能说明**

- tokensale结束提取demo币或者owner提取bcbt



### CheckGoadReached

**方法原型**

```
func CheckGoadReached()
```

**调用结构**

```
transaction = {
    "note": "tokensale CheckGoadReached",
    "gasLimit": "25000",
    "calls": [
    {
        "contract": "bcbtLPy7Bu1mWUhYs6DWHsgojTt5F5MauhVag",
        "method": "CheckGoadReached()",
        "params": [],
    }]
};
```

**功能说明**

- 检查tokensale是否完成



### 查询ICO进度

**查询链接**

```html
https://test-earth.bcbchain.io/abci_query?path="/org9ib7PkkqhjV1A3hMXVgPcoBoxkL3iKdnS/ico/round"
```

**返回结果**

```json
{"fundingGoal":250000000,"startDate":"2020-02-29 15:30:30","endDate":"2020-02-29 16:30:30","exchangeRate":100000000,"soft":10000000000,"hard":100000000000,"funAmount":0,"token":"xxxxxx","status":"0"}
```



### 查询购买记录

**方法原型**

```
https://test-earth.bcbchain.io/abci_query?path="/org9ib7PkkqhjV1A3hMXVgPcoBoxkL3iKdnS/ico/records/<address>"
```

> `<address>` 需要用实际的账户地址替换

**返回结果**

```
[
    {time": "2020-02-29 15:00:00", "address": "xxxxx", "spend": 1000000, "funAmount": 250000000},
    {time": "2020-02-29 15:10:00", "address": "xxxxx", "spend": 1000000, "funAmount": 250000000}
]
```
