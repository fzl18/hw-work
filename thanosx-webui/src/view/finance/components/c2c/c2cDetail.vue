<template>
    <section class="detail">
        <div class="left">
            <financeHeader :hint="false">
                <span class="cursor" @click="$router.push('/c2cOrder')">{{lang[local].c2cOrder}} </span> > <span style="color:#FF6500">{{lang[local].c2cDetail}}</span>
            </financeHeader>
            <section>
                <div class="info">
                    <div class="price">
                        <span>{{ orderInfo.type == 1 ? lang[local].c2cBuy:lang[local].c2cSell}}：<span class="buy">{{orderInfo.amount}} {{orderInfo.symbol && orderInfo.symbol.toUpperCase()}}</span></span>
                        <span style="margin-left:40px">{{lang[local].addOrderTip3}}：<span class="org">{{moneyFormat}} {{orderInfo.currency}}</span></span>
                        <span style="margin-left:20px">（{{lang[local].unitPrice}}：{{orderInfo.price}}{{orderInfo.currency}}）</span>
                    </div>
                    <div class="user">
                        <p>{{lang[local].turnover}}{{orderInfo.type == 1 ? lang[local].c2cDetailTxt2:lang[local].c2cDetailTxt3}}：{{orderInfo.nickname}}（UID：{{orderInfo.user_id}}）</p>
                        <p>{{lang[local].apply19}}：{{orderInfo.realname}} ({{orderInfo.phone}})</p>
                    </div>
                </div>
                <div class="transferType">
                    <div class="tit">
                        {{lang[local].c2cDetailTxt1}}：
                    </div>
                    <div class="card" v-if="orderInfo.status!=2">
                        <template v-if="orderInfo.pay_type == 0">
                            <div v-for="item in orderInfo.pays" @click="handlePayType(item)">
                                <Row v-if="item.type =='1'" class="type" :class="curPay && curPay.id == item.id ? 'cur':''">
                                    <Col span="4" class="bg"><i class="iconfont icon-yinxingqia org"></i> {{lang[local].bankCard}}</Col>
                                    <Col span="4" style="padding-left:15px">{{item.name}}</Col>
                                    <Col span="8">{{item.account}}</Col>
                                    <Col span="4">{{item.bank}}</Col>
                                    <Col span="4">{{item.branch}}</Col>
                                </Row>

                                <Row v-if="item.type =='2'" class="type" :class="curPay && curPay.id == item.id  ? 'cur':''">
                                    <Col span="4" class="bg"><i class="iconfont iconfont icon-ZFBZD blue"></i>{{lang[local].aliPay}}</Col>
                                    <Col span="4" style="padding-left:15px">{{item.name}}</Col>
                                    <Col span="8">{{lang[local].transferModeTip10}}：{{item.branch}}</Col>
                                    <Col span="4"><Button type="text" size="large" class="blue" @click="seeQR">{{lang[local].c2cDetailTxt4}}</Button></Col>
                                    <Col span="4"></Col>
                                </Row>

                                <Row v-if="item.type =='3'" class="type" :class="curPay && curPay.id == item.id  ? 'cur':''">
                                    <Col span="4" class="bg"><i class="iconfont icon-ai-weixin green"></i>{{lang[local].weChat}}</Col>
                                    <Col span="4" style="padding-left:15px">{{item.name}}</Col>
                                    <Col span="8">{{lang[local].c2cDetailTxt5}}：{{item.branch}}</Col>
                                    <Col span="4"><Button type="text" size="large" class="blue" @click="seeQR">{{lang[local].c2cDetailTxt4}}</Button></Col>
                                    <Col span="4"></Col>
                                </Row>
                                <Row v-if="item.type =='4'" class="type" :class="curPay && curPay.id == item.id  ? 'cur':''">
                                    <Col span="4" class="bg"><i class="iconfont icon-paynow org"></i>PayNow</Col>
                                    <Col span="4" style="padding-left:15px">{{item.name}}</Col>
                                    <Col span="12">PayNow {{local == 'en' ? '' : lang[local].safety22}}：{{item.branch}}</Col>
                                    <!-- <Col span="4"><Button type="text" size="large" class="blue" @click="seeQR">{{lang[local].c2cDetailTxt4}}</Button></Col> -->
                                    <Col span="4"></Col>
                                </Row>

                                <Row v-if="item.type =='5'" class="type" :class="curPay && curPay.id == item.id  ? 'cur':''">
                                    <Col span="4" class="bg"><i class="iconfont icon-race org"></i>Interace</Col>
                                    <Col span="4" style="padding-left:15px">{{item.name}}</Col>
                                    <Col span="12">Interace-transfer {{local == 'en' ? '' : lang[local].safety22}}：{{item.branch}}</Col>
                                    <!-- <Col span="4"><Button type="text" size="large" class="blue" @click="seeQR">{{lang[local].c2cDetailTxt4}}</Button></Col> -->
                                    <Col span="4"></Col>
                                </Row>

                                <Row v-if="item.type =='6'" class="type" :class="curPay && curPay.id == item.id  ? 'cur':''">
                                    <Col span="4" class="bg"><i class="iconfont icon-paypal blue"></i>Paypal</Col>
                                    <Col span="4" style="padding-left:15px">{{item.name}}</Col>
                                    <Col span="12">Paypal {{local == 'en' ? '' : lang[local].safety22}}：{{item.branch}}</Col>
                                    <!-- <Col span="4"><Button type="text" size="large" class="blue" @click="seeQR">{{lang[local].c2cDetailTxt4}}</Button></Col> -->
                                    <Col span="4"></Col>
                                </Row>

                                <Row v-if="item.type =='7'" class="type" :class="curPay && curPay.id == item.id  ? 'cur':''">
                                    <Col span="4" class="bg"><i class="iconfont icon-uip org"></i>UPI</Col>
                                    <Col span="4" style="padding-left:15px">{{item.name}}</Col>
                                    <Col span="8">UPI {{local == 'en' ? '' : lang[local].safety22}}：{{item.branch}}</Col>
                                    <Col span="4"><Button type="text" size="large" class="blue" @click="seeQR">{{lang[local].c2cDetailTxt4}}</Button></Col>
                                    <Col span="4"></Col>
                                </Row>
                            </div>

                            <!-- <div v-if="orderInfo.bank_card" @click="handlePayType('bank')" >
                                <Row class="type" :class="payType =='bank' ? 'cur':''">
                                    <Col span="4" class="bg"><i class="iconfont icon-yinxingqia org"></i> {{lang[local].bankCard}}</Col>
                                    <Col span="4" style="padding-left:15px">{{orderInfo.truename}}</Col>
                                    <Col span="8">{{orderInfo.bank_card}}</Col>
                                    <Col span="4">{{orderInfo.bank_name}}</Col>
                                    <Col span="4">{{orderInfo.bank_branch}}</Col>
                                </Row>
                            </div>
                            <div v-if="orderInfo.alipay_account" @click="handlePayType('alipay')">
                                <Row class="type" :class="payType =='alipay' ? 'cur':''">
                                    <Col span="4" class="bg"><i class="iconfont iconfont icon-ZFBZD blue"></i>{{lang[local].aliPay}}</Col>
                                    <Col span="4" style="padding-left:15px">{{orderInfo.wxpay_name}}</Col>
                                    <Col span="8">{{lang[local].transferModeTip10}}：{{orderInfo.alipay_account}}</Col>
                                    <Col span="4"><Button type="text" size="large" class="blue" @click="seeQR">{{lang[local].c2cDetailTxt4}}</Button></Col>
                                    <Col span="4"></Col>
                                </Row>
                            </div>
                            <div v-if="orderInfo.wxpay_account" @click="handlePayType('wxpay')">
                                <Row class="type" :class="payType =='wxpay' ? 'cur':''">
                                    <Col span="4" class="bg"><i class="iconfont icon-ai-weixin green"></i>{{lang[local].weChat}}</Col>
                                    <Col span="4" style="padding-left:15px">{{orderInfo.wxpay_name}}</Col>
                                    <Col span="8">{{lang[local].c2cDetailTxt5}}：{{orderInfo.wxpay_account}}</Col>
                                    <Col span="4"><Button type="text" size="large" class="blue" @click="seeQR">{{lang[local].c2cDetailTxt4}}</Button></Col>
                                    <Col span="4"></Col>
                                </Row>
                            </div> -->
                        </template>

                        <template v-if="orderInfo.pay_type != 0 ">
                            <div v-for="item in orderInfo.pays"  @click="handlePayType(item)">
                                <Row v-if="item.type =='1' && orderInfo.pay_type == item.id*1" class="type nocur">
                                    <Col span="4" class="bg"><i class="iconfont icon-yinxingqia org"></i> {{lang[local].bankCard}}</Col>
                                    <Col span="4" style="padding-left:15px">{{item.name}}</Col>
                                    <Col span="8">{{item.account}}</Col>
                                    <Col span="4">{{item.bank}}</Col>
                                    <Col span="4">{{item.branch}}</Col>
                                </Row>

                                <Row v-if="item.type =='2' && orderInfo.pay_type == item.id*1" class="type nocur">
                                    <Col span="4" class="bg"><i class="iconfont iconfont icon-ZFBZD blue"></i>{{lang[local].aliPay}}</Col>
                                    <Col span="4" style="padding-left:15px">{{item.name}}</Col>
                                    <Col span="8">{{lang[local].transferModeTip10}}：{{item.branch}}</Col>
                                    <Col span="4"><Button type="text" size="large" class="blue" @click="seeQR">{{lang[local].c2cDetailTxt4}}</Button></Col>
                                    <Col span="4"></Col>
                                </Row>

                                <Row v-if="item.type =='3' && orderInfo.pay_type == item.id*1" class="type nocur">
                                    <Col span="4" class="bg"><i class="iconfont icon-ai-weixin green"></i>{{lang[local].weChat}}</Col>
                                    <Col span="4" style="padding-left:15px">{{item.name}}</Col>
                                    <Col span="8">{{lang[local].c2cDetailTxt5}}：{{item.branch}}</Col>
                                    <Col span="4"><Button type="text" size="large" class="blue" @click="seeQR">{{lang[local].c2cDetailTxt4}}</Button></Col>
                                    <Col span="4"></Col>
                                </Row>
                                <Row v-if="item.type =='4' && orderInfo.pay_type == item.id*1" class="type nocur">
                                    <Col span="4" class="bg"><i class="iconfont icon-paynow org"></i>PayNow</Col>
                                    <Col span="4" style="padding-left:15px">{{item.name}}</Col>
                                    <Col span="8">PayNow {{local == 'en' ? '' : lang[local].safety22}}：{{item.branch}}</Col>
                                    <!-- <Col span="4"><Button type="text" size="large" class="blue" @click="seeQR">{{lang[local].c2cDetailTxt4}}</Button></Col> -->
                                    <Col span="4"></Col>
                                </Row>

                                <Row v-if="item.type =='5' && orderInfo.pay_type == item.id*1" class="type nocur">
                                    <Col span="4" class="bg"><i class="iconfont icon-race org"></i>Interace</Col>
                                    <Col span="4" style="padding-left:15px">{{item.name}}</Col>
                                    <Col span="8">Interace-transfer {{local == 'en' ? '' : lang[local].safety22}}：{{item.branch}}</Col>
                                    <!-- <Col span="4"><Button type="text" size="large" class="blue" @click="seeQR">{{lang[local].c2cDetailTxt4}}</Button></Col> -->
                                    <Col span="4"></Col>
                                </Row>

                                <Row v-if="item.type =='6' && orderInfo.pay_type == item.id*1" class="type nocur">
                                    <Col span="4" class="bg"><i class="iconfont icon-paypal blue"></i>Paypal</Col>
                                    <Col span="4" style="padding-left:15px">{{item.name}}</Col>
                                    <Col span="8">Paypal {{local == 'en' ? '' : lang[local].safety22}}：{{item.branch}}</Col>
                                    <!-- <Col span="4"><Button type="text" size="large" class="blue" @click="seeQR">{{lang[local].c2cDetailTxt4}}</Button></Col> -->
                                    <Col span="4"></Col>
                                </Row>

                                <Row v-if="item.type =='7' && orderInfo.pay_type == item.id*1" class="type nocur">
                                    <Col span="4" class="bg"><i class="iconfont icon-uip org"></i>UPI</Col>
                                    <Col span="4" style="padding-left:15px">{{item.name}}</Col>
                                    <Col span="8">UPI {{local == 'en' ? '' : lang[local].safety22}}：{{item.branch}}</Col>
                                    <Col span="4"><Button type="text" size="large" class="blue" @click="seeQR">{{lang[local].c2cDetailTxt4}}</Button></Col>
                                    <Col span="4"></Col>
                                </Row>
                            </div>

                            <!-- <div v-if="orderInfo.bank_card && orderInfo.pay_type ==1" @click="handlePayType('bank')" >
                                <Row class="type nocur">
                                    <Col span="4" class="bg"><i class="iconfont icon-yinxingqia org"></i> {{lang[local].bankCard}}</Col>
                                    <Col span="4" style="padding-left:15px">{{orderInfo.truename}}</Col>
                                    <Col span="8">{{orderInfo.bank_card}}</Col>
                                    <Col span="4">{{orderInfo.bank_name}}</Col>
                                    <Col span="4">{{orderInfo.bank_branch}}</Col>
                                </Row>
                            </div>
                            <div v-if="orderInfo.alipay_account && orderInfo.pay_type ==2" @click="handlePayType('alipay')">
                                <Row class="type nocur">
                                    <Col span="4" class="bg"><i class="iconfont iconfont icon-ZFBZD blue"></i>{{lang[local].aliPay}}</Col>
                                    <Col span="4" style="padding-left:15px">{{orderInfo.wxpay_name}}</Col>
                                    <Col span="8">{{lang[local].transferModeTip10}}：{{orderInfo.alipay_account}}</Col>
                                    <Col span="4"><Button type="text" size="large" class="blue" @click="seeQR">{{lang[local].c2cDetailTxt4}}</Button></Col>
                                    <Col span="4"></Col>
                                </Row>
                            </div>
                            <div v-if="orderInfo.wxpay_account && orderInfo.pay_type ==3" @click="handlePayType('wxpay')">
                                <Row class="type nocur">
                                    <Col span="4" class="bg"><i class="iconfont icon-ai-weixin green"></i>{{lang[local].weChat}}</Col>
                                    <Col span="4" style="padding-left:15px">{{orderInfo.wxpay_name}}</Col>
                                    <Col span="8">{{lang[local].c2cDetailTxt5}}：{{orderInfo.wxpay_account}}</Col>
                                    <Col span="4"><Button type="text" size="large" class="blue" @click="seeQR">{{lang[local].c2cDetailTxt4}}</Button></Col>
                                    <Col span="4"></Col>
                                </Row>
                            </div> -->
                        </template>
                    </div>
                    <div class="card" v-if="orderInfo.status==2">
                        <div>
                            <Row class="type none">
                                <Col span="24" class="bg">{{lang[local].c2cDetailTxt6}}</Col>
                            </Row>
                        </div>                       
                    </div>
                    <div class="payinfo" v-if="orderInfo.status==3 && orderInfo.type == 2 && local !='en'">{{lang[local].c2cDetailTxt7}} <span class="sell">{{leftTime}}</span>  {{lang[local].c2cDetailTxt8}}</div>
                    <div class="payinfo" v-if="orderInfo.status==3 && orderInfo.type == 2 && local =='en'">{{lang[local].c2cDetailTxt7}}   {{lang[local].c2cDetailTxt8}} <span class="sell">{{leftTime}}</span></div>
                    <div class="payinfo" v-if="orderInfo.status==1 && orderInfo.type == 1 && local !='en'">{{lang[local].c2cDetailTxt9}} <span class="sell">{{leftTime}}</span>  {{lang[local].c2cDetailTxt10}} {{orderInfo.nickname}} {{lang[local].c2cDetailTxt11}} {{moneyFormat}} {{orderInfo.currency}}</div>
                    <div class="payinfo" v-if="orderInfo.status==1 && orderInfo.type == 1 && local =='en'">{{lang[local].c2cDetailTxt9}} pay {{moneyFormat}} {{orderInfo.currency}} to {{orderInfo.nickname}}  within <span class="sell">{{leftTime}}</span> </div>
                    <div class="payinfo" v-if="orderInfo.status==3 && orderInfo.type == 1">{{lang[local].c2cDetailTxt12}} {{orderInfo.nickname}} {{lang[local].c2cDetailTxt13}} <span class="tbuy"> {{orderInfo.amount}} {{orderInfo.symbol && orderInfo.symbol.toUpperCase()}}</span></div>
                    <div class="payinfo" v-if="orderInfo.status==5 && orderInfo.appeal_display" >{{lang[local].c2cDetailTxt14}} <Button type="text" size="large" class="blue" style="padding:0px;font-size:20px;font-weight:bold;margin-top:-5px;" @click="gotoUrl('appeal',orderInfo.appeal_id)">{{lang[local].c2cDetailTxt15}}</Button></div>
                    <div class="pay" v-if="orderInfo.type != 1">{{lang[local].c2cDetailTxt16}} <span>{{orderInfo.code}}</span> {{lang[local].c2cDetailTxt17}}</div>
                    <div class="pay" v-if="orderInfo.type == 1">{{lang[local].c2cDetailTxt16}} <span>{{orderInfo.code}}</span> {{lang[local].c2cDetailTxt19}}</div>
                    <div class="btn" v-if="orderInfo.status==4"><h2> <span v-if="orderInfo.type == 2"> {{lang[local].c2cType4}}</span><span v-if="orderInfo.type == 1">{{lang[local].c2cDetailTxt20}} <Button type="text" size="large" class="blue" style="padding:0px;font-size:20px;font-weight:bold;margin-top:-5px;" @click="gotoUrl('c2c')">{{lang[local].c2cDetailTxt21}}</Button></span></h2></div>
                    <div class="btn" v-if="orderInfo.status==2"><h2>{{lang[local].c2cDetailTxt22}}</h2></div>
                    <div class="btn" v-if="orderInfo.status==3 && orderInfo.type == 2">
                        <Button @click="payModal=true" type="primary" size="large">{{lang[local].c2cDetailTxt23}}</Button>
                        <Button type="text" size="large" class="blue" @click="appealModal = true">{{lang[local].c2cDetailTxt24}}</Button>
                    </div>
                    <div class="btn" v-if="orderInfo.status==5 && orderInfo.type == 2">
                        <Button @click="payModal=true" type="primary" size="large">{{lang[local].c2cDetailTxt23}}</Button>
                    </div> 
                    <div class="btn" v-if="orderInfo.status==1 && orderInfo.type== 2">
                        <Button type="primary" size="large" disabled>{{lang[local].c2cDetailTxt26}}...</Button>
                    </div>
                    <div class="btn" v-if="orderInfo.status==5 && orderInfo.type== 1">
                        <Button type="primary" size="large" disabled style="margin-bottom:15px;">{{lang[local].c2cDetailTxt27}}...</Button>
                    </div>
                    <div class="btn" v-if="orderInfo.status==3 && orderInfo.type== 1">
                        <Button type="primary" size="large" disabled style="margin-bottom:15px;">{{lang[local].c2cDetailTxt27}}...</Button>
                        <Button type="text" size="large" class="org" @click="cancelModal = true">{{lang[local].c2cDetailTxt28}}</Button>
                        <Button type="text" size="large" class="blue" @click="appealModal = true">{{lang[local].c2cDetailTxt24}}</Button>
                    </div> 
                    <p style="margin:15px 0" v-if="orderInfo.status==1 && orderInfo.type==1"><Checkbox v-model="agree" size="large"> {{lang[local].loginAgree}} </Checkbox> <a :href="tourl + '/list/c2c_legal_service_greement'" target="_blank" class="org">{{lang[local].addOrderTip11}}</a></p>
                    <div class="btn" v-if="orderInfo.status==1 && orderInfo.type==1"><Button type="primary" size="large" @click="goPay">{{lang[local].c2cDetailTxt29}}</Button> <Button type="text" size="large" class="blue" @click="cancelModal = true">{{lang[local].c2cDetailTxt28}}</Button> </div>                    
                    <div class="btn" v-if="orderInfo.status==5 && orderInfo.type==1">
                        <Button type="text" size="large" class="org" @click="cancelModal = true">{{lang[local].c2cDetailTxt28}}</Button>
                    </div> 
                    <p style="margin-top:15px" v-if="orderInfo.status!=1 ">{{lang[local].c2cDetailTxt30}}  <a :href="tourl + '/list/c2c_legal_service_greement'" target="_blank" class="org">{{lang[local].addOrderTip11}}</a></p>
                </div>
                <div class="faq">
                    <div class="tit">{{lang[local].c2cDetailTxt31}} <i class="iconfont icon-wenhao"></i></div>
                    <ul v-if="orderInfo.type ==1">
                        <li :class="curFaq == 1 ? 'cur':''" @click="curFaq = 1">
                            <p class="ask"><i class="iconfont" :class="curFaq == 1 ? 'icon-fangxiang':'icon-fangxiang1'"></i>{{lang[local].c2cDetailTxt32}} </p>   
                            <p class="ctx">{{lang[local].c2cDetailTxt33}} </p>
                        </li>
                        <li :class="curFaq == 2 ? 'cur':''" @click="curFaq = 2">
                            <p class="ask"><i class="iconfont" :class="curFaq == 2 ? 'icon-fangxiang':'icon-fangxiang1'"></i>{{lang[local].c2cDetailTxt34}} </p>   
                            <p class="ctx">{{lang[local].c2cDetailTxt35}} </p>
                        </li>
                        <li :class="curFaq == 3 ? 'cur':''" @click="curFaq = 3">
                            <p class="ask"><i class="iconfont" :class="curFaq == 3 ? 'icon-fangxiang':'icon-fangxiang1'"></i>{{lang[local].c2cDetailTxt36}} </p>   
                            <p class="ctx">
                                {{lang[local].c2cDetailTxt37}} <br/>
                                {{lang[local].c2cDetailTxt38}} <br/>
                                {{lang[local].c2cDetailTxt39}} <br/>
                            </p>
                        </li>                        
                    </ul>
                    <ul v-if="orderInfo.type!=1">
                        <li :class="curFaq == 4 ? 'cur':''" @click="curFaq = 4">
                            <p class="ask"><i class="iconfont" :class="curFaq == 4 ? 'icon-fangxiang':'icon-fangxiang1'"> </i>{{lang[local].c2cDetailTxt40}} </p>   
                            <p class="ctx">{{lang[local].c2cDetailTxt41}}</p>
                        </li>
                        <li :class="curFaq == 5 ? 'cur':''" @click="curFaq = 5">
                            <p class="ask"><i class="iconfont" :class="curFaq == 5 ? 'icon-fangxiang':'icon-fangxiang1'"> </i>{{lang[local].c2cDetailTxt42}}</p>   
                            <p class="ctx">{{lang[local].c2cDetailTxt43}}</p>
                        </li>
                        <li :class="curFaq == 6 ? 'cur':''" @click="curFaq = 6">
                            <p class="ask"><i class="iconfont" :class="curFaq == 6 ? 'icon-fangxiang':'icon-fangxiang1'"> </i>{{lang[local].c2cDetailTxt44}}</p>   
                            <p class="ctx">{{lang[local].c2cDetailTxt45}}</p>
                        </li>
                    </ul>
                </div>
            </section>
        </div>   
        <div class="right">
            <p class="tit">{{lang[local].appealOrderInfo}}</p>
            <table>
                <tr>
                    <td width="100">{{lang[local].c2cOrderNO}}：</td>
                    <td>{{orderInfo.orderid}}</td>
                </tr>
                <tr>
                    <td>{{lang[local].c2cTit1}}：</td>
                    <td class="torg">{{orderInfo.status==1? lang[local].c2cType1 : orderInfo.status==2?lang[local].c2cType2:orderInfo.status==3?lang[local].c2cType3:orderInfo.status==4?lang[local].c2cType4:lang[local].c2cType5}}</td>
                </tr>
                <tr>
                    <td colspan="2" class="border"></td>
                </tr>
                <tr>
                    <td style="padding-top:15px">{{lang[local].appealCreateTime}}：</td>
                    <td style="padding-top:15px">{{localDate(orderInfo.createtime)}}</td>
                </tr>
                <tr v-if="orderInfo.status==3 || orderInfo.status==4">
                    <td >{{lang[local].c2cDetailTxt46}}：</td>
                    <td >{{localDate(orderInfo.paytime)}}</td>
                </tr>
                <tr v-if="orderInfo.status==2">
                    <td >{{lang[local].c2cDetailTxt47}}：</td>
                    <td >{{localDate(orderInfo.canceltime)}}</td>
                </tr>
                <tr v-if="orderInfo.status==4">
                    <td >{{lang[local].c2cDetailTxt48}}：</td>
                    <td >{{localDate(orderInfo.shiptime)}}</td>
                </tr>
            </table>
        </div>
        <Modal
            v-model="payModal"
            :closable = false
            :footer-hide = true
            class-name="vertical-center-modal">            
            <Row class="payModal" v-if="orderInfo.type==2">     <!-- 放币 -->
                <Col span="18"><h1 style="color:#666;font-size:24px">{{lang[local].c2cDetailTxt49}}</h1></Col>
                <Col span="6" class="leftTime" style="text-align:right"><i class="iconfont icon-shijian"></i> {{leftTime}}</Col>
                <Col span="24" style="height:20px"></Col>
                <Col span="12" class="f15" style="color:#999;font-size:14px">{{lang[local].c2cDetailTxt50}}</Col>
                <Col span="12" class="f15" style="color:#999;font-size:14px">{{lang[local].c2cDetailTxt51}}</Col>
                <Col span="12" class="torg">{{orderInfo.amount}} {{orderInfo.symbol && orderInfo.symbol.toUpperCase()}}</Col>
                <Col span="12" class="torg">{{moneyFormat}} {{orderInfo.currency}}</Col>
                <Col span="24" style="margin:10px 0"><hr style="border:none;border-top:1px dotted #ccc"></Col>
                <Col span="24" class="f15" style="color:#999;font-size:14px">{{lang[local].c2cDetailTxt52}}</Col>
                <Col span="6" offset="2" >{{lang[local].apply19}} </Col>
                <Col span="16">{{orderInfo.truename}}</Col>
                <Col span="24" style="height:20px"></Col>
                <Col span="24" class="f15" style="color:#999;font-size:14px">{{lang[local].c2cDetailTxt53}}</Col>
                <Col span="22" offset="2">
                    <Row class="input">
                        <!-- <Col span="12">可用：</Col>
                        <Col span="12">6.00098 ETH</Col> -->
                        <Col span="7" v-html="lang[local].payPassword"></Col>
                        <Col span="17"><Input type="password" v-model="payPassword" size="large"/></Col>
                        <Col span="7" v-html="lang[local].icoVerify"></Col>
                        <Col span="17" style="margin-top:8px;"><Input v-model="emailVerify" size="large" :placeholder="lang[local].emailVerifCode" ><span slot="append" class="blue cursor" @click="sendCode">{{verifyCodeTimeText === -1 ? lang[local].getVerifCode + '...' : verifyCodeTimeText ? verifyCodeTimeText : lang[local].getVerifCode}}</span></Input></Col>
                    </Row>
                </Col>
                <Col span="24" style="margin:15px 0"><hr style="border:none;border-top:1px dotted #ccc"></Col>
                <Col span="24" > <Checkbox v-model="bAgree" size="large"> {{lang[local].c2cDetailTxt55}} </Checkbox></Col>
                <Col span="24" class="sell" style="font-size:14px;">{{lang[local].c2cDetailTxt56}}</Col>
                <Col span="24" style="height:50px"></Col>
                <Col span="12" style="text-align:center"><Button type="text" size="large" @click="payModal = false">{{lang[local].c2cDetailTxt57}}</Button></Col>
                <Col span="12" style="text-align:center"><Button type="primary" size="large" @click="confirmReceivable">{{lang[local].apply36}}</Button></Col>
            </Row>
            <!-- 打款 -->
            <Row class="payModal" v-if="payType == '1' && orderInfo.type==1">
                <Col span="18"><h1 style="color:#666;font-size:24px">{{lang[local].c2cDetailTxt58}}</h1></Col>
                <Col span="6" class="leftTime"><i class="iconfont icon-shijian"></i> {{leftTime}}</Col>
                <Col span="24" style="height:20px"></Col>
                <Col span="24" class="f15">{{lang[local].c2cDetailTxt59}}</Col>
                <Col span="24" class="tbuy">{{moneyFormat }} {{orderInfo.currency && orderInfo.currency.toUpperCase()}}</Col>
                <Col span="24" style="margin:10px 0"><hr style="border:none;border-top:1px dotted #ccc"></Col>                
                    <Row>
                        <Col span="24">
                            <Row >
                                <Col span="24" style="color:#999;font-size:14px">{{lang[local].c2cDetailTxt60}} </Col>
                                <Col span="24" >{{curPay.account}}</Col>
                                <Col span="8">{{curPay.name}}</Col>
                                <Col span="8">{{curPay.bank}} </Col>
                                <Col span="8">{{curPay.branch}}</Col>
                                <Col span="24" style="color:#999;font-size:14px;margin-top:15px"> {{lang[local].c2cDetailTxt16}} <span style="font-size:12px">{{lang[local].c2cDetailTxt19}}</span> </Col>
                                <Col span="8" class="f15">{{orderInfo.code}}</Col>
                            </Row>
                        </Col>
                    </Row>                
                <Col span="24" style="margin:10px 0"><hr style="border:none;border-top:1px dotted #ccc"></Col>
                <Col span="24" class="sell" style="font-size:14px">{{lang[local].c2cDetailTxt61}}</Col>
                <Col span="24" style="height:50px"></Col>
                <Col span="12" style="text-align:center;"><Button type="text" size="large" @click="payModal = false">{{lang[local].c2cDetailTxt62}}</Button></Col>
                <Col span="12" style="text-align:center;"><Button type="primary" size="large" @click="confirmPay">{{lang[local].c2cDetailTxt63}}</Button></Col>
            </Row>

            <Row class="payModal" v-if="payType == '2' && orderInfo.type==1 ">
                <Col span="18"><h1 style="color:#666;font-size:24px">{{lang[local].c2cDetailTxt58}}</h1></Col>
                <Col span="6" class="leftTime"><i class="iconfont icon-shijian"></i> {{leftTime}}</Col>
                <Col span="24" style="height:20px"></Col>
                <Col span="24" style="color:#999;font-size:14px">{{lang[local].c2cDetailTxt59}}</Col>
                <Col span="24" class="tbuy">{{moneyFormat}} {{orderInfo.currency && orderInfo.currency.toUpperCase()}}</Col>
                <Col span="24" style="margin:10px 0"><hr style="border:none;border-top:1px dotted #ccc"></Col>                
                    <Row>
                        <Col span="16">
                            <Row v-if="payType == 'alipay'">
                                <Col style="color:#999;font-size:14px">{{lang[local].c2cDetailTxt64}}</Col>
                                <Col >{{curPay.branch}}</Col>
                                <Col>{{curPay.name}}</Col>
                                <Col style="color:#999;font-size:14px;margin-top:15px"> {{lang[local].c2cDetailTxt16}} <span style="font-size:12px">{{lang[local].c2cDetailTxt19}}</span> </Col>
                                <Col class="f15">{{orderInfo.code}}</Col>
                            </Row>
                        </Col>
                        <Col span="6" offset="2">
                            <img :src="curPay.account" alt="" style="width:120px;height:120px">
                        </Col>
                    </Row>                
                <Col span="24" style="margin:10px 0"><hr style="border:none;border-top:1px dotted #ccc"></Col>
                <Col span="24" class="sell" style="font-size:14px">{{lang[local].c2cDetailTxt61}}</Col>
                <Col span="24" style="height:50px"></Col>
                <Col span="12" style="text-align:center;"><Button type="text" size="large" @click="payModal = false">{{lang[local].c2cDetailTxt62}}</Button></Col>
                <Col span="12" style="text-align:center;"><Button type="primary" size="large" @click="confirmPay" >{{lang[local].c2cDetailTxt63}}</Button></Col>
            </Row>

            <Row class="payModal" v-if="payType == '3' && orderInfo.type==1 ">
                <Col span="18"><h1 style="color:#666;font-size:24px">{{lang[local].c2cDetailTxt58}}</h1></Col>
                <Col span="6" class="leftTime"><i class="iconfont icon-shijian"></i> {{leftTime}}</Col>
                <Col span="24" style="height:20px"></Col>
                <Col span="24" style="color:#999;font-size:14px">{{lang[local].c2cDetailTxt59}}</Col>
                <Col span="24" class="tbuy">{{moneyFormat}} {{orderInfo.currency && orderInfo.currency.toUpperCase()}}</Col>
                <Col span="24" style="margin:10px 0"><hr style="border:none;border-top:1px dotted #ccc"></Col>                
                    <Row>
                        <Col span="16">
                            <Row>
                                <Col style="color:#999;font-size:14px">{{lang[local].c2cDetailTxt65}} </Col>
                                <Col >{{curPay.branch}}</Col>
                                <Col>{{curPay.name}}</Col>
                                <Col style="color:#999;font-size:14px;margin-top:15px"> {{lang[local].c2cDetailTxt16}} <span style="font-size:12px">{{lang[local].c2cDetailTxt19}}</span> </Col>
                                <Col class="f15">{{orderInfo.code}}</Col>
                            </Row>
                        </Col>
                        <Col span="6" offset="2">
                            <img :src="curPay.account" alt="" style="width:120px;height:120px">
                        </Col>
                    </Row>                
                <Col span="24" style="margin:10px 0"><hr style="border:none;border-top:1px dotted #ccc"></Col>
                <Col span="24" class="sell" style="font-size:14px">{{lang[local].c2cDetailTxt61}}</Col>
                <Col span="24" style="height:50px"></Col>
                <Col span="12" style="text-align:center;"><Button type="text" size="large" @click="payModal = false">{{lang[local].c2cDetailTxt62}}</Button></Col>
                <Col span="12" style="text-align:center;"><Button type="primary" size="large" @click="confirmPay" >{{lang[local].c2cDetailTxt63}}</Button></Col>
            </Row>

            <Row class="payModal" v-if="payType == '4' && orderInfo.type==1 ">
                <Col span="18"><h1 style="color:#666;font-size:24px">{{lang[local].c2cDetailTxt58}}</h1></Col>
                <Col span="6" class="leftTime"><i class="iconfont icon-shijian"></i> {{leftTime}}</Col>
                <Col span="24" style="height:20px"></Col>
                <Col span="24" style="color:#999;font-size:14px">{{lang[local].c2cDetailTxt59}}</Col>
                <Col span="24" class="tbuy">{{moneyFormat}} {{orderInfo.currency && orderInfo.currency.toUpperCase()}}</Col>
                <Col span="24" style="margin:10px 0"><hr style="border:none;border-top:1px dotted #ccc"></Col>                
                    <Row>
                        <Col span="16">
                            <Row>
                                <Col style="color:#999;font-size:14px">{{lang[local].other}} PayNow {{lang[local].safety22}}</Col>
                                <Col >{{curPay.branch}}</Col>
                                <Col>{{curPay.name}}</Col>
                                <Col style="color:#999;font-size:14px;margin-top:15px"> {{lang[local].c2cDetailTxt16}} <span style="font-size:12px">{{lang[local].c2cDetailTxt19}}</span> </Col>
                                <Col class="f15">{{orderInfo.code}}</Col>
                            </Row>
                        </Col>
                        <!-- <Col span="6" offset="2">
                            <img :src="curPay.account" alt="" style="width:120px;height:120px">
                        </Col> -->
                    </Row>                
                <Col span="24" style="margin:10px 0"><hr style="border:none;border-top:1px dotted #ccc"></Col>
                <Col span="24" class="sell" style="font-size:14px">{{lang[local].c2cDetailTxt61}}</Col>
                <Col span="24" style="height:50px"></Col>
                <Col span="12" style="text-align:center;"><Button type="text" size="large" @click="payModal = false">{{lang[local].c2cDetailTxt62}}</Button></Col>
                <Col span="12" style="text-align:center;"><Button type="primary" size="large" @click="confirmPay" >{{lang[local].c2cDetailTxt63}}</Button></Col>
            </Row>

            <Row class="payModal" v-if="payType == '5' && orderInfo.type==1 ">
                <Col span="18"><h1 style="color:#666;font-size:24px">{{lang[local].c2cDetailTxt58}}</h1></Col>
                <Col span="6" class="leftTime"><i class="iconfont icon-shijian"></i> {{leftTime}}</Col>
                <Col span="24" style="height:20px"></Col>
                <Col span="24" style="color:#999;font-size:14px">{{lang[local].c2cDetailTxt59}}</Col>
                <Col span="24" class="tbuy">{{moneyFormat}} {{orderInfo.currency && orderInfo.currency.toUpperCase()}}</Col>
                <Col span="24" style="margin:10px 0"><hr style="border:none;border-top:1px dotted #ccc"></Col>                
                    <Row>
                        <Col span="16">
                            <Row>
                                <Col style="color:#999;font-size:14px">{{lang[local].other}} Interace-transfer {{lang[local].safety22}}</Col>
                                <Col >{{curPay.branch}}</Col>
                                <Col>{{curPay.name}}</Col>
                                <Col style="color:#999;font-size:14px;margin-top:15px"> {{lang[local].c2cDetailTxt16}} <span style="font-size:12px">{{lang[local].c2cDetailTxt19}}</span> </Col>
                                <Col class="f15">{{orderInfo.code}}</Col>
                            </Row>
                        </Col>
                        <!-- <Col span="6" offset="2">
                            <img :src="curPay.account" alt="" style="width:120px;height:120px">
                        </Col> -->
                    </Row>                
                <Col span="24" style="margin:10px 0"><hr style="border:none;border-top:1px dotted #ccc"></Col>
                <Col span="24" class="sell" style="font-size:14px">{{lang[local].c2cDetailTxt61}}</Col>
                <Col span="24" style="height:50px"></Col>
                <Col span="12" style="text-align:center;"><Button type="text" size="large" @click="payModal = false">{{lang[local].c2cDetailTxt62}}</Button></Col>
                <Col span="12" style="text-align:center;"><Button type="primary" size="large" @click="confirmPay" >{{lang[local].c2cDetailTxt63}}</Button></Col>
            </Row>

            <Row class="payModal" v-if="payType == '6' && orderInfo.type==1 ">
                <Col span="18"><h1 style="color:#666;font-size:24px">{{lang[local].c2cDetailTxt58}}</h1></Col>
                <Col span="6" class="leftTime"><i class="iconfont icon-shijian"></i> {{leftTime}}</Col>
                <Col span="24" style="height:20px"></Col>
                <Col span="24" style="color:#999;font-size:14px">{{lang[local].c2cDetailTxt59}}</Col>
                <Col span="24" class="tbuy">{{moneyFormat}} {{orderInfo.currency && orderInfo.currency.toUpperCase()}}</Col>
                <Col span="24" style="margin:10px 0"><hr style="border:none;border-top:1px dotted #ccc"></Col>                
                    <Row>
                        <Col span="16">
                            <Row>
                                <Col style="color:#999;font-size:14px">{{lang[local].other}} Paypal {{lang[local].safety22}}</Col>
                                <Col >{{curPay.branch}}</Col>
                                <Col>{{curPay.name}}</Col>
                                <Col style="color:#999;font-size:14px;margin-top:15px"> {{lang[local].c2cDetailTxt16}} <span style="font-size:12px">{{lang[local].c2cDetailTxt19}}</span> </Col>
                                <Col class="f15">{{orderInfo.code}}</Col>
                            </Row>
                        </Col>
                        <!-- <Col span="6" offset="2">
                            <img :src="curPay.account" alt="" style="width:120px;height:120px">
                        </Col> -->
                    </Row>                
                <Col span="24" style="margin:10px 0"><hr style="border:none;border-top:1px dotted #ccc"></Col>
                <Col span="24" class="sell" style="font-size:14px">{{lang[local].c2cDetailTxt61}}</Col>
                <Col span="24" style="height:50px"></Col>
                <Col span="12" style="text-align:center;"><Button type="text" size="large" @click="payModal = false">{{lang[local].c2cDetailTxt62}}</Button></Col>
                <Col span="12" style="text-align:center;"><Button type="primary" size="large" @click="confirmPay" >{{lang[local].c2cDetailTxt63}}</Button></Col>
            </Row>

            <Row class="payModal" v-if="payType == '7' && orderInfo.type==1 ">
                <Col span="18"><h1 style="color:#666;font-size:24px">{{lang[local].c2cDetailTxt58}}</h1></Col>
                <Col span="6" class="leftTime"><i class="iconfont icon-shijian"></i> {{leftTime}}</Col>
                <Col span="24" style="height:20px"></Col>
                <Col span="24" style="color:#999;font-size:14px">{{lang[local].c2cDetailTxt59}}</Col>
                <Col span="24" class="tbuy">{{moneyFormat}} {{orderInfo.currency && orderInfo.currency.toUpperCase()}}</Col>
                <Col span="24" style="margin:10px 0"><hr style="border:none;border-top:1px dotted #ccc"></Col>                
                    <Row>
                        <Col span="16">
                            <Row>
                                <Col style="color:#999;font-size:14px">{{lang[local].other}} UPI {{lang[local].safety22}} </Col>
                                <Col >{{curPay.branch}}</Col>
                                <Col>{{curPay.name}}</Col>
                                <Col style="color:#999;font-size:14px;margin-top:15px"> {{lang[local].c2cDetailTxt16}} <span style="font-size:12px">{{lang[local].c2cDetailTxt19}}</span> </Col>
                                <Col class="f15">{{orderInfo.code}}</Col>
                            </Row>
                        </Col>
                        <Col span="6" offset="2">
                            <img :src="curPay.account" alt="" style="width:120px;height:120px">
                        </Col>
                    </Row>                
                <Col span="24" style="margin:10px 0"><hr style="border:none;border-top:1px dotted #ccc"></Col>
                <Col span="24" class="sell" style="font-size:14px">{{lang[local].c2cDetailTxt61}}</Col>
                <Col span="24" style="height:50px"></Col>
                <Col span="12" style="text-align:center;"><Button type="text" size="large" @click="payModal = false">{{lang[local].c2cDetailTxt62}}</Button></Col>
                <Col span="12" style="text-align:center;"><Button type="primary" size="large" @click="confirmPay" >{{lang[local].c2cDetailTxt63}}</Button></Col>
            </Row>

        </Modal>
        <Modal
            v-model="qrModal"
            :closable = false
            :footer-hide = true
            class-name="vertical-center-modal">
            <h1>{{lang[local].c2cDetailTxt66}}</h1>
            <hr style="margin-top:20px">
            <img :src="curPay.account" alt="" style="width:250px;height:250px;margin:40px auto;display:block;">
            <div style="text-align:center">
                <Button type="primary" size="large" @click="qrModal = false">{{lang[local].c2cClose}}</Button>
            </div>
        </Modal>
        <Modal
            v-model="appealModal"
            :closable = false
            :footer-hide = true
            class-name="vertical-center-modal">
            <h1>{{lang[local].c2cDetailTxt24}}</h1>
            <p style="margin:15px 0;">{{lang[local].c2cDetailTxt67}}</p>
            <table>
                <tr>
                    <td width="130">{{lang[local].c2cDetailTxt68}}</td>
                    <td>
                        <Select v-model="appealType" size="large" style="width:300px" :placeholder="lang[local].gu_finance100">
                            <Option v-for="item in appealTypeList" :value="item.type_id" :key="item.type_id">{{ item.type_name }}</Option>
                        </Select>
                    </td>
                </tr>
                <tr>
                    <td>{{lang[local].c2cDetailTxt69}}</td>
                    <td>
                        <textarea v-model="txt" type="textarea" :rows="4" :placeholder="lang[local].c2cDetailTxt70" @input='validateTxt'/><span style="color:#bbb">{{lang[local].addOrderTip9}} {{ 200 - txt.length}} {{lang[local].addOrderTip10}}</span>
                    </td>
                </tr>
            </table>
            <div style="margin-top:50px;">
                <Button type="primary" size="large" @click="appealCreate">{{lang[local].apply36}}</Button>
                <Button type="text" size="large" @click="appealModal = false" style="float:right;">{{lang[local].cancel}}</Button>
            </div>
        </Modal>
        <Modal
            v-model="cancelModal"
            :closable = false
            :footer-hide = true
            class-name="vertical-center-modal">
            <h1>{{lang[local].c2cDetailTxt28}}</h1>
            <div class="txt">{{lang[local].c2cDetailTxt71}}</div>
            <div class="tip">
                <p>{{lang[local].c2cDetailTxt72}}：</p>
                <p>{{lang[local].c2cDetailTxt73}}</p>
            </div>
            <div>
                <Row>
                    <Col span="12" style="text-align:center"><Button type="primary" size="large" @click="cancelOrder">{{lang[local].appealCancelTxt4}}</Button></Col>
                    <Col span="12" style="text-align:center"><Button type="text" size="large" @click="cancelModal = false">{{lang[local].appealCancelTxt5}}</Button></Col>
                </Row>
            </div>
        </Modal>
    </section>
</template>

<script>
export default {
    data(){
        return{
            active:null,
            payType:'bank',
            payModal:false,
            qrModal:false,
            appealModal:false,
            cancelModal:false,
            curPay:{},
            bank:{
                name:'',
                card:'',
                type:'',
            },
            alipay:{

            },
            wxpay:{},
            wxpayQR:{},
            alipayQR:{},
            orderInfo:{},
            transferMode:{},
            curFaq:1,
            sendCodeStatus:false,
            sendCodeCount:0,
            emailVerify:'',
            payPassword:'',
            leftTime:'',
            agree:false,
            tourl:'',
            appealType:'',
            appealTypeList:[],
            txt:'',
            loopask:0,
            bAgree:false,
        }
    },
    mounted(){
        this.orderDetail()
        this.getAppealType()
        this.tourl = process.env.NODE_ENV == 'development' ? '/article.html' : '/home/article'
    },
    watch:{
        "orderInfo.money" (n,o){            
            this.orderInfo.money = `${n}`.replace(/(d{3})+(?!d)/g, ',')
        }
    },
    computed:{
        moneyFormat (){
            return this.formatNum(`${this.orderInfo.money}`)
        }
    },
    methods:{
        formatNum(str) {
            var newStr = "";
            var count = 0;
            // 当数字是整数
            if (str.indexOf(".") == -1) {
                for (var i = str.length - 1; i >= 0; i--) {
                    if (count % 3 == 0 && count != 0) {
                        newStr = str.charAt(i) + "," + newStr;
                    } else {
                        newStr = str.charAt(i) + newStr;
                    }
                    count++;
                }
                str = newStr + ".00"; //自动补小数点后两位
                return str;
            }
            // 当数字带有小数
            else {
                for (var i = str.indexOf(".") - 1; i >= 0; i--) {
                    if (count % 3 == 0 && count != 0) {
                        newStr = str.charAt(i) + "," + newStr;
                    } else {
                        newStr = str.charAt(i) + newStr; //逐个字符相接起来
                    }
                    count++;
                }
                str = newStr + (str + "00").substr((str + "00").indexOf("."), 3);
                return str;
            }
        },
        handlePayType(ojb){
            this.curPay = ojb
            this.payType = ojb.type            
        },
        seeQR(){
            this.qrModal = true;
        },
        orderDetail(){
            this.axios({
                url : this.api.orderDetail,
                data : {
                    id:this.$route.query.id
                }
            }).then(res=>{
                this.orderInfo = res.data.info
                this.curPay = res.data.info.pays[0] || {}
                this.payType = res.data.info.pays[0].type || ''
                console.log(this.curPay);
                
                let loop
                // clearInterval(loopask)
                // this.transferMode = res.data.info.transfer_mode
                if((this.orderInfo.status==3 && this.orderInfo.type== 1) || (this.orderInfo.status==1 && this.orderInfo.type== 2)){
                    if(!this.loopask){
                        loop = setInterval(()=>{                        
                            this.orderDetail()
                        },30000)
                    }
                    this.loopask = 1
                    return
                }else{
                    clearInterval(loop)
                }
                let time = res.data.info.time
                if(time > 0){
                    setInterval(()=>{
                        let M = Math.floor(time/60%60)
                        let S = Math.floor(time%60)
                        this.leftTime = `${M}:${S<10 ? '0' + S :S}`
                        time--
                        if(M < 0 && S < 0){
                            clearInterval()
                            this.payModal=false
                            this.orderDetail()
                            // this.getAppealType()
                        }
                    },1000) 
                }
            }).catch( err=>{
                this.$store.commit('msg/err', err.message);
                console.log(err);
                
                setTimeout(function () {
                    if(this.loginGetStatus && this.loginStatus){
                        location.href = process.env.NODE_ENV == 'development' ? '/finance.html/c2cOrder' : '/home/finance/c2cOrder'
                    }else{
                        location.href = process.env.NODE_ENV == 'development' ? '/login.html' : '/home/login'
                    }
                },2000)
                
            })
        },
        getAppealType(){
            this.axios({
                url : this.api.appealType,
                data : {
                }
            }).then(res=>{
                this.appealTypeList = res.data.list
            }).catch( err=>{
                this.$store.commit('msg/err', err.message);
            })
        },
        appealCreate(){
            if(!this.txt){
                this.$store.commit('msg/err', this.lang[this.local].c2cDetailTxt74)
                return
            }
            if(!this.appealType){
                this.$store.commit('msg/err', this.lang[this.local].c2cDetailTxt75)
                return
            }
            this.axios({
                url : this.api.appealCreate,
                data : {
                    id:this.orderInfo.id,
                    type_id:this.appealType,
                    reason:this.txt,
                }
            }).then(res=>{
                location.href = process.env.NODE_ENV == 'development' ? '/finance.html/appealDetail?id=' + res.data.appeal_id : '/home/finance/appealDetail?id=' + res.data.appeal_id
            }).catch( err=>{
                this.$store.commit('msg/err', err.message);
                this.orderDetail()
            })
        },
        cancelOrder(){
            this.axios({
                url : this.api.cancelOrder,
                data : {
                    id:this.orderInfo.id
                }
            }).then(res=>{
                this.cancelModal = false
                this.orderDetail()
            }).catch( err=>{
                this.$store.commit('msg/err', err.message);
                this.orderDetail()
            })
        },
        goPay(){
            if(this.agree){
                this.payModal = true
            }else{
                this.$store.commit('msg/err', this.lang[this.local].c2cDetailTxt76);
            }
        },
        confirmPay(){
            this.axios({
                url : this.api.confirmPay,
                data : {
                    id:this.orderInfo.id,
                    pay_type:this.curPay.id
                }
            }).then(res=>{
                this.payModal = false
                this.$store.commit('msg/add', res.message);
                this.orderDetail()
            }).catch( err=>{
                this.$store.commit('msg/err', err.message);
            })
        },
        confirmReceivable(){
            if(!this.bAgree){
                this.$store.commit('msg/err', this.lang[this.local].c2cDetailTxt77);
                return
            }
            this.axios({
                url : this.api.confirmReceivable,
                data : {
                    id:this.orderInfo.id,
                    password:this.payPassword,
                    code:this.emailVerify,
                }
            }).then(res=>{
                this.payModal = false
                this.$store.commit('msg/add', res.message);
                this.orderDetail()
            }).catch( err=>{
                this.$store.commit('msg/err', err.message);
            })
        },
        sendCode(){
            if(this.verifyCodeTimeText){
                return false;
            };
            this.verifyCodeTimeText = -1;
            this.axios({
                url : this.api.sendCaptcha,
                data : {
                    type:8,
                }
            }).then((res) => {
                this.sendCodeStatus = true;
                this.sendCodeCount ++;
                this.verifyCodeDown();
            }).catch((err) => {
                this.$store.commit('msg/err', err.message);
                this.verifyCodeTimeText = '';
                this.sendCodeStatus = false;
            });
            return true;
        },
        validateTxt(){
            if(this.txt.length > 200){
                this.txt = this.txt.substring(0,200)
            }        
        },
        gotoUrl(val,id){
            switch (val) {
                case 'c2c':
                    this.$router.push('/index')
                    break;
                case 'appeal':
                    this.$router.push(`/appealDetail?id=${id}`)
                    break;            
                default:
                    break;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .detail{
        margin-top:60px;
        overflow: hidden;
        min-height:80vh;
        .left{
            background:#fff;
            box-shadow:0 0 8px rgba(0,0,0,.3);
            padding:15px 30px;
            float: left;
            width:calc(100% - 335px);
            .tit{
                font-weight: bold;
                font-size:16px;
            }
            .info{
                .price{
                    font-size:20px;
                    font-weight:bold;
                    margin-top: 20px;
                }
                .user{                    
                    border-top:1px dashed #ccc;
                    border-bottom:1px dashed #ccc;
                    margin:20px 0;
                    padding:10px 0;
                    p{
                        line-height: 40px;
                    }
                }
            }
            .transferType{
                .card{
                    white-space:nowrap;
                    text-overflow:hidden;
                    overflow: hidden;
                    margin-bottom:20px;
                    .type{
                        border-bottom:2px solid #E4E4E4;
                        background: #F7F7F7;
                        height:60px;
                        line-height:60px;
                        margin-top:20px;
                        cursor: pointer;
                        .bg{
                            background: #EFEFEF;
                            text-align: left;
                            padding-left:10px;
                            height: 58px;
                            i{
                                display: inline-block;
                                width:40px;
                                text-align: center;
                            }
                        }
                        &:hover, &.cur{
                            border:1px solid #FF6600;
                        }
                        &.none{
                            border:none;
                            cursor:default;
                        }
                        &.cur{
                            .iconfont{
                                color:#fff;
                            }
                            .bg{
                                background: #FF6600;
                                color:#fff;
                            }
                        }
                        
                    }
                }
                .payinfo{
                    font-size:20px;
                    font-weight: bold;
                    margin-top:20px;
                }
                .pay{
                    font-size:15px;
                    margin:30px 0;
                    overflow: hidden;
                    span{
                        background: #959595;color:#fff;padding:5px 15px;display: inline-block;
                    }
                }
            }
            .faq{
                margin:100px 0 30px 0;
                .iconfont{
                    font-size:20px;
                    top:1px;
                }
                li{
                    margin:15px 0;
                    line-height:26px;                    
                    .ask{
                        font-size:15px;font-weight:bold;
                        cursor: pointer;
                    }
                    .ctx{
                        margin-left:40px;
                        display: none;
                    }
                    &.cur{
                        .ask{
                            color: #0095FD;
                        }
                        .ctx{
                            display:block;
                        }
                    }                    
                }

            }
        }
        .right{
            background:#fff;
            box-shadow:0 0 8px rgba(0,0,0,.3);
            padding:25px 30px;
            float: left;
            margin-left:15px;
            width:320px;
            .tit{font-size:20px;color: #8E8E8E;margin-bottom:15px;}
            table{
                width:100%;
                tr{
                    & td:first-child{
                        text-align:right;
                    }
                }
                td{
                    height:40px;
                    line-height: 40px;
                    font-size:15px;
                    &.border{border-bottom:1px dotted #ccc;height:1px;line-height: 1px;padding-bottom:15px}

                }
            }
        }
    }
    .payModal{
        font-size:16px;
        line-height: 30px;
        .leftTime{
            color:#FF6600;font-size:16px;font-weight: bold
        }
        .input{
            color:#A6A6A6;
            font-size:15px;
            div{
                min-height:36px;
                line-height:36px;
            }
        }
    }
    .f15{
        font-size:15px;
    }
    .cursor{
        cursor: pointer;
    }
    .type.nocur{
        &:hover{
            border:none!important;
            cursor: default!important;
        }
    }
    .iconfont{font-size:26px;font-weight:normal;margin-right:10px;position: relative;top:3px;}
    .vertical-center-modal{
        p{font-size:15px;line-height:26px;margin:0px 0;}
        table{
            width:100%;
            font-size:15px;
            td{padding:10px 0;}
        }
        textarea{
            border:1px solid #E7E7E7;
            border-radius: 4px;
            width:100%;
            outline: none;
            padding:10px;
            line-height:28px;
            transition: all .3s;
            &:hover, &:focus{
                border-color: #FF6600
            }
        }
        .txt{font-size:16px;color:red;margin:20px 0;}
        .tip{margin-bottom:50px;font-size:15px;color:#333;line-height:26px}
    }
</style>
