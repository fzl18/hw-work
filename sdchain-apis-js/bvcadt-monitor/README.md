# 监控
## 底层监控
```
server_info
"complete_ledgers" : "1-2658345", 值是一个范围，而不是一个数字或empty，如果是一个数字，表示本地账本停滞。
"server_state" : "full" , validating, and proposing 判断server_state值是这三个的时候才表示正常，其他都是异常情况。
"peers" >= "validation_quorum" 正常
"status" : "success" 正常
"最大区块"超过3m未增长
```

## 通知限定
```
1. 一次检测异常节点少于3个时，一条短信，通知异常节点及其原因。
2. 一次检测有多个节点异常时，一条短信，通知哪些节点有异常，不通知具体原因。
3. 半个小时内只通知一次。
```