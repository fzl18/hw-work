# bvcadt-dataapi-js
```
npm install -d -g pm2
pm2 start pm2.xxx.js
```

## 说明
```
1. 只提供目前用到的接口
2. 使用mongodb代替hbase
```


## 表结构
```
h_ledgers{
	ledger_index:区块高度,
	ledger_hash: 区块Hash,
	close_time: 区块关闭时间,
	sync_start_time: 数据同步开始时间，
	sync_status: 数据同步状态,	
	sync_end_time: 数据同步结束时间
}

h_error_ledgers{
	ledger_index:区块高度,
	ledger_hash: 区块Hash,
	close_time: 区块关闭时间,
	sync_start_time: 数据同步开始时间，
	sync_status: 数据同步状态,	
	sync_end_time: 数据同步结束时间
}

h_transactions{
    hash: 交易hash
    ledger_index: 区块高度
    type: 交易类型
    time: 交易时间
    fee: 交易手续费
    amount: 交易金额
    account: 交易地址
    source: 交易源地址
    destination: 交易目的地址
    currency: 币种类型
    issuer: 币种发行商
    result: 交易结果
    tx: 底层交易数据
}

// 小时统计表（UTC时间戳）
h_tx_hours{
    year: 统计年份时间戳
    month: 统计月份时间戳
    day: 统计日时间戳
    hour: 统计小时时间戳
    tx_count: 交易数量
}

```

## 进程说明
```
live.js{
	1. 从已同步的区块开始同步数据
	2. 统计指定时间之后的交易记录,支持时区的配置，不配置时按照UTC时间处理
}

http.js{
	提供交易历史(已关闭区块)记录查询接口
	提供统计数据查询接口
}
```

## 通知说明
```
1. 发生数据同步失败时记录日志，并发送邮件通知，一个小时内相同异常的邮件只发送两次，第一次和最后一次(带异常发生的数量)
2. 不同进程的日志记录到不同的文件中
3. 特殊异常日志单独记录文件(例如区块不连续，区块回滚，同步失败等等)
```

## 接口说明
1. /v2/ledgers/{ledger}  
    说明：接口直接调用底层数据返回  

2. /v2/transactions/{hash}  
    说明：接口读取交易数表返回  
    
3. /v2/accounts/{account}/balances  
    说明：获取用户余额，查询底层返回数据  
    
4. /v2/payments/{currency}  
    说明：查询交易列表  
    
5. /v2/accounts/{account}/transactions  
    说明：获取指定账户的交易列表  
    
6. /v2/accounts/{account}/payments  
    说明：获取指定账户的交易信息  
    
7. /v2/reports  
    说明：信息统计接口，提供按天和按小时统计  
    
8. /v2/system/errorLedgers  
    说明：查询同步失败的区块列表  
    参数：token=xxx
       
9. /v2/system/syncLedgers  
    说明：同步指定区间的区块列表  
    参数：token=xxx&start=50&end=100
    
10. /v2/system/replaceNode  
    说明：更新节点信息  
    参数：token=xxx&key=test&address=http://192.168.0.21:53234&desc=内网测试  
    
        