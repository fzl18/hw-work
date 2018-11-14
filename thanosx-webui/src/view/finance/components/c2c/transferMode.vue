<template>
    <section>
        <financeHeader :hint="false">
            <span>{{lang[local].transferMode}}</span>
        </financeHeader>
        <div style="margin:10px 0">
            <span class="org">*</span> {{lang[local].transferModeTip1}}
        </div>
        <section class="card">
            <Row class="row" v-if="!hasTransferMode" style="margin-top:30px;height:60px;line-height:60px">
                <Col span="24" style="textAlign:center"><Button type="text" size="large" @click="isAuth"> <i class="iconfont icon-jia" style="fontSize:20px"></i> {{lang[local].apply49}}  </Button></Col>
            </Row>
            <!-- <span class="flag">{{lang[local].transferModeTip2}}</span> -->
            <template v-for="(item,index) in list">
                <Row class="row" :class="active == item.id ?'cur':''" v-if="item.type == 1">
                    <Col span="4" class="type"><i class="iconfont icon-yinxingqia org" /> {{lang[local].bankCard}}</Col>
                    <Col span="20" class="name"> {{ item.bank ? `${item.bank } (${lang[local].transferModeTip3}：${item.account ? item.account.slice(-4):''})` : lang[local].accunbind }}  
                        <span style="float:right;">
                            <template >
                                <Button v-if="active != item.id "  size="large" type="text" @click="active = item.id;edit(item) " style="padding:8px 10px">{{lang[local].accbtn}}</Button>
                                <Button v-if="active == item.id "  size="large" type="text" @click="handleCancel">{{lang[local].cancel}}</Button>
                                <Button v-if="active != item.id " size="large" type="text" @click="unbindTransferMode(item.type,item.id)">{{lang[local].del}}</Button>
                                <i-switch v-model="item.enabled" true-value="1" false-value="0" size="large" v-if="active != item.id " @on-change="handleChange(item.id,item.enabled)">
                                    <span slot="open">ON</span>
                                    <span slot="close">OFF</span>
                                </i-switch>
                            </template>
                        </span>
                    </Col>
                    <Col span="24" class="con" v-if=" active == item.id ">
                        <table>
                            <tr>
                                <td>{{lang[local].transferModeTip4}}</td>
                                <td>{{realname}}</td>
                            </tr>
                            <tr>
                                <td>{{lang[local].transferModeTip5}}</td>
                                <td><Input :maxlength="50" v-model="bank.bank" size="large" /></td>
                            </tr>
                            <tr>
                                <td>{{lang[local].transferModeTip6}}</td>
                                <td><Input :maxlength="50" v-model="bank.branch" size="large" /></td>
                            </tr>
                            <tr>
                                <td>{{lang[local].transferModeTip7}}</td>
                                <td class="ka"><input v-model="bank.account" size="large" /></td>
                            </tr>
                            <tr>
                                <td>{{lang[local].transferModeTip8}}</td>
                                <td class="ka"><input v-model="review" size="large" /></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td align="center"><Button size="large" type="primary" @click="transferModeSet(item.type,item.id)"> {{lang[local].c2cSave}} </Button></td>
                            </tr>
                        </table>
                    </Col>
                </Row>
                <Row class="row" :class="active == item.id?'cur':''" v-if="item.type == 2">
                    <Col span="4" class="type"><i class="iconfont icon-ZFBZD blue" /> {{lang[local].aliPay}}</Col>
                    <Col span="20" class="name"> {{ item.branch }} 
                        <span style="float:right;">
                            <template>
                                <Button v-if="active != item.id" size="large" type="text" @click="active = item.id;edit(item)" style="padding:8px 10px">{{lang[local].accbtn}}</Button>
                                <Button v-if="active == item.id" size="large" type="text" @click="handleCancel">{{lang[local].cancel}}</Button>
                                <Button v-if="active != item.id" size="large" type="text" @click="unbindTransferMode(item.type,item.id)">{{lang[local].del}}</Button>
                                <i-switch v-model="item.enabled" true-value="1" false-value="0" size="large" v-if="active != item.id" @on-change="handleChange(item.id,item.enabled)">
                                    <span slot="open">ON</span>
                                    <span slot="close">OFF</span>
                                </i-switch>
                            </template>
                        </span>
                    </Col>
                    <Col span="24" class="con" v-if=" active == item.id ">
                        <table>
                            <tr>
                                <td>{{lang[local].transferModeTip9}}</td>
                                <td>{{realname}}</td>
                            </tr>
                            <tr>
                                <td>{{lang[local].transferModeTip10}}</td>
                                <td><Input :maxlength="50" v-model="alipay.branch" size="large" /></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <div class="qr">
                                        <div class="pic">
                                            <uploadFile path="nameAuth" v-model="alipayQR" :class="alipayQR.state == getStateStart ? 'focus' : ''">
                                                <i class="iconfont icon-erweima"></i>
                                                <em :style="{backgroundImage : 'url(' + alipayQR.origin + ')'}"></em>
                                                <div class="progress" v-if="alipayQR.state == getStateStart">
                                                    <b :style="{height : alipayQR.progress + '%'}"></b>
                                                    <div>{{alipayQR.progress + '%'}}</div>
                                                </div>
                                                <!-- <div class="btn"><span>{{lang[local].uploadpicbtn}}</span></div> -->
                                            </uploadFile>
                                        </div>
                                        <div v-if="!alipayQR.origin" style="font-size:14px">{{lang[local].transferModeTip14}}</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td align="center"><Button size="large" type="primary" @click="transferModeSet(item.type,item.id)"> {{lang[local].c2cSave}} </Button></td>
                            </tr>
                        </table>
                    </Col>
                </Row>
                <Row class="row" :class="active == item.id?'cur':''" v-if="item.type == 3">
                    <Col span="4" class="type"><i class="iconfont icon-ai-weixin green" /> {{lang[local].weChat}}</Col>
                    <Col span="20" class="name"> {{item.branch }} 
                        <span style="float:right;">
                            <template>
                                <Button v-if="active != item.id" size="large" type="text" @click="active = item.id;edit(item)" style="padding:8px 10px">{{lang[local].accbtn}}</Button>
                                <Button v-if="active == item.id" size="large" type="text" @click="handleCancel">{{lang[local].cancel}}</Button>
                                <Button v-if="active != item.id" size="large" type="text" @click="unbindTransferMode(item.type,item.id)">{{lang[local].del}}</Button>
                                <i-switch v-model="item.enabled" true-value="1" false-value="0" size="large" v-if="active != item.id" @on-change="handleChange(item.id,item.enabled)">
                                    <span slot="open">ON</span>
                                    <span slot="close">OFF</span>
                                </i-switch>
                            </template>
                        </span>
                    </Col>
                    <Col span="24" class="con" v-if=" active == item.id ">
                        <table>
                            <tr>
                                <td>{{lang[local].transferModeTip9}}</td>
                                <td>{{realname}}</td>
                            </tr>
                            <tr>
                                <td>{{lang[local].transferModeTip11}}</td>
                                <td><Input :maxlength="50" v-model="wxpay.branch" size="large" /></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <div class="qr">
                                        <div class="pic">
                                            <uploadFile path="nameAuth" v-model="wxpayQR" :class="wxpayQR.state == getStateStart ? 'focus' : ''">
                                                <i class="iconfont icon-erweima"></i>
                                                <em :style="{backgroundImage : 'url(' + wxpayQR.origin + ')'}"></em>
                                                <div class="progress" v-if="wxpayQR.state == getStateStart">
                                                    <b :style="{height : wxpayQR.progress + '%'}"></b>
                                                    <div>{{wxpayQR.progress + '%'}}</div>
                                                </div>
                                                <!-- <div><span>{{lang[local].uploadpicbtn}}</span> </div> -->
                                            </uploadFile>
                                        </div>
                                        <div v-if="!wxpayQR.origin" style="font-size:14px">{{lang[local].transferModeTip14}}</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td align="center"><Button size="large" type="primary" @click="transferModeSet(item.type,item.id)"> {{lang[local].c2cSave}} </Button></td>
                            </tr>
                        </table>
                    </Col>
                </Row>
                <Row class="row" :class="active == item.id ?'cur':''" v-if="item.type == 4">
                    <Col span="4" class="type"><i class="iconfont icon-paynow org" /> PayNow</Col>
                    <Col span="20" class="name"> {{ item.branch}}  
                        <span style="float:right;">
                            <template >
                                <Button v-if="active != item.id "  size="large" type="text" @click="active = item.id;edit(item) " style="padding:8px 10px">{{lang[local].accbtn}}</Button>
                                <Button v-if="active == item.id "  size="large" type="text" @click="handleCancel">{{lang[local].cancel}}</Button>
                                <Button v-if="active != item.id " size="large" type="text" @click="unbindTransferMode(item.type,item.id)">{{lang[local].del}}</Button>
                                <i-switch v-model="item.enabled" true-value="1" false-value="0" size="large" v-if="active != item.id " @on-change="handleChange(item.id,item.enabled)">
                                    <span slot="open">ON</span>
                                    <span slot="close">OFF</span>
                                </i-switch>
                            </template>
                        </span>
                    </Col>
                    <Col span="24" class="con" v-if=" active == item.id ">
                        <table>
                            <tr>
                                <td width="130">{{lang[local].transferModeTip9}}：</td>
                                <td>{{realname}}</td>
                            </tr>
                            <tr>
                                <td>PayNow {{local == 'en' ? '': lang[local].safety22}}：</td>
                                <td><Input :maxlength="50" v-model="PayNow.branch" size="large" /></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td align="center"><Button size="large" type="primary" @click="transferModeSet(item.type,item.id)"> {{lang[local].c2cSave}} </Button></td>
                            </tr>
                        </table>
                    </Col>
                </Row>
                <Row class="row" :class="active == item.id ?'cur':''" v-if="item.type == 5">
                    <Col span="4" class="type"><i class="iconfont icon-race org" /> Interace</Col>
                    <Col span="20" class="name"> {{ item.branch }}  
                        <span style="float:right;">
                            <template >
                                <Button v-if="active != item.id "  size="large" type="text" @click="active = item.id;edit(item) " style="padding:8px 10px">{{lang[local].accbtn}}</Button>
                                <Button v-if="active == item.id "  size="large" type="text" @click="handleCancel">{{lang[local].cancel}}</Button>
                                <Button v-if="active != item.id " size="large" type="text" @click="unbindTransferMode(item.type,item.id)">{{lang[local].del}}</Button>
                                <i-switch v-model="item.enabled" true-value="1" false-value="0" size="large" v-if="active != item.id " @on-change="handleChange(item.id,item.enabled)">
                                    <span slot="open">ON</span>
                                    <span slot="close">OFF</span>
                                </i-switch>
                            </template>
                        </span>
                    </Col>
                    <Col span="24" class="con" v-if=" active == item.id ">
                        <table>
                            <tr>
                                <td width="200">{{lang[local].transferModeTip9}}：</td>
                                <td>{{realname}}</td>
                            </tr>
                            <tr>
                                <td>Interace-Transfer {{local == 'en' ? '': lang[local].safety22}}：</td>
                                <td><Input :maxlength="50" v-model="Interace.branch" size="large" /></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td align="center"><Button size="large" type="primary" @click="transferModeSet(item.type,item.id)"> {{lang[local].c2cSave}} </Button></td>
                            </tr>
                        </table>
                    </Col>
                </Row>
                <Row class="row" :class="active == item.id ?'cur':''" v-if="item.type == 6">
                    <Col span="4" class="type"><i class="iconfont icon-paypal blue" /> Paypal</Col>
                    <Col span="20" class="name"> {{ item.branch}}  
                        <span style="float:right;">
                            <template >
                                <Button v-if="active != item.id "  size="large" type="text" @click="active = item.id;edit(item) " style="padding:8px 10px">{{lang[local].accbtn}}</Button>
                                <Button v-if="active == item.id "  size="large" type="text" @click="handleCancel">{{lang[local].cancel}}</Button>
                                <Button v-if="active != item.id " size="large" type="text" @click="unbindTransferMode(item.type,item.id)">{{lang[local].del}}</Button>
                                <i-switch v-model="item.enabled" true-value="1" false-value="0" size="large" v-if="active != item.id " @on-change="handleChange(item.id,item.enabled)">
                                    <span slot="open">ON</span>
                                    <span slot="close">OFF</span>
                                </i-switch>
                            </template>
                        </span>
                    </Col>
                    <Col span="24" class="con" v-if=" active == item.id ">
                        <table>
                            <tr>
                                <td width="120">{{lang[local].transferModeTip9}}：</td>
                                <td>{{realname}}</td>
                            </tr>
                            <tr>
                                <td>Paypal {{local == 'en' ? '': lang[local].safety22}}：</td>
                                <td><Input :maxlength="50" v-model="Paypal.branch" size="large" /></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td align="center"><Button size="large" type="primary" @click="transferModeSet(item.type,item.id)"> {{lang[local].c2cSave}} </Button></td>
                            </tr>
                        </table>
                    </Col>
                </Row>
                <Row class="row" :class="active == item.id?'cur':''" v-if="item.type == 7">
                    <Col span="4" class="type"><i class="iconfont icon-uip org" /> UPI</Col>
                    <Col span="20" class="name"> {{item.branch }} 
                        <span style="float:right;">
                            <template>
                                <Button v-if="active != item.id" size="large" type="text" @click="active = item.id;edit(item)" style="padding:8px 10px">{{lang[local].accbtn}}</Button>
                                <Button v-if="active == item.id" size="large" type="text" @click="handleCancel">{{lang[local].cancel}}</Button>
                                <Button v-if="active != item.id" size="large" type="text" @click="unbindTransferMode(item.type,item.id)">{{lang[local].del}}</Button>
                                <i-switch v-model="item.enabled" true-value="1" false-value="0" size="large" v-if="active != item.id" @on-change="handleChange(item.id,item.enabled)">
                                    <span slot="open">ON</span>
                                    <span slot="close">OFF</span>
                                </i-switch>
                            </template>
                        </span>
                    </Col>
                    <Col span="24" class="con" v-if=" active == item.id ">
                        <table>
                            <tr>
                                <td width="90">{{lang[local].transferModeTip9}}：</td>
                                <td>{{realname}}</td>
                            </tr>
                            <tr>
                                <td>UPI {{local == 'en' ? '': lang[local].safety22}}：</td>
                                <td><Input :maxlength="50" v-model="UPI.branch" size="large" /></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <div class="qr">
                                        <div class="pic">
                                            <uploadFile path="nameAuth" v-model="UPIQR" :class="UPIQR.state == getStateStart ? 'focus' : ''">
                                                <i class="iconfont icon-erweima"></i>
                                                <em :style="{backgroundImage : 'url(' + UPIQR.origin + ')'}"></em>
                                                <div class="progress" v-if="UPIQR.state == getStateStart">
                                                    <b :style="{height : UPIQR.progress + '%'}"></b>
                                                    <div>{{UPIQR.progress + '%'}}</div>
                                                </div>
                                                <!-- <div><span>{{lang[local].uploadpicbtn}}</span> </div> -->
                                            </uploadFile>
                                        </div>
                                        <div v-if="!UPIQR.origin" style="font-size:14px">{{lang[local].transferModeTip14}}</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td align="center"><Button size="large" type="primary" @click="transferModeSet(item.type,item.id)"> {{lang[local].c2cSave}} </Button></td>
                            </tr>
                        </table>
                    </Col>
                </Row>
            </template>
            
            <div style="margin:20px 0 150px 0" v-if="hasTransferMode">
                <Button type="text" size="large" class="blue" style="float:right;" @click="isAuth"> <i class="iconfont icon-jia" style="fontSize:18px"></i> {{lang[local].apply49}}  </Button>
            </div>
        </section>
        <Modal
            v-model="authModle"
            :closable = false
            :footer-hide = true
            :mask-closable = false
            class-name="vertical-center-modal">            
            <div>
                <h2>
                    {{lang[local].transferModeTip13}}   
                </h2>
                <div style="text-align:right;">
                 <Button type="primary" size="large" style="font-size:16px" @click="go()"> {{lang[local].apply48}} </Button>
                </div>
            </div>
        </Modal>
        <Modal
            v-model="addModle"
            :closable = false
            :footer-hide = true
            class-name="vertical-center-modal">            
            <div>
                <h1>
                    {{lang[local].apply49}}   
                </h1>
                <table style="margin-top:30px">
                    <tr>
                        <td width="90">{{lang[local].transferMode}}：</td>
                        <td>
                            <Select v-model="chooseTransferMode" size="large" style="width:100%" :placeholder="lang[local].apply50" clearable>
                                <Option v-for="item in transferModeListArray" :value="item.type" :key="item.type">{{ item.name }}</Option>
                            </Select>
                        </td>
                    </tr>
                </table>
                <table v-if="chooseTransferMode == '1'">
                    <tr>
                        <td :width="local=='en'? 140 : 90">{{lang[local].transferModeTip4}}：</td>
                        <td>{{realname}}</td>
                    </tr>
                    <tr>
                        <td>{{lang[local].transferModeTip5}}：</td>
                        <td><Input :maxlength="50" v-model="bank.bank" size="large" /></td>
                    </tr>
                    <tr>
                        <td>{{lang[local].transferModeTip6}}：</td>
                        <td><Input :maxlength="50" v-model="bank.branch" size="large" /></td>
                    </tr>
                    <tr>
                        <td>{{lang[local].transferModeTip7}}：</td>
                        <td class="ka"><input v-model="bank.account" size="large" /></td>
                    </tr>
                    <tr>
                        <td>{{lang[local].transferModeTip8}}：</td>
                        <td class="ka"><input v-model="review" size="large" /></td>
                        </tr>
                </table>
                <table v-if="chooseTransferMode == '2'">
                    <tr>
                        <td width="90">{{lang[local].transferModeTip9}}：</td>
                        <td>{{realname}}</td>
                    </tr>
                    <tr>
                        <td>{{lang[local].transferModeTip10}}：</td>
                        <td><Input :maxlength="50" v-model="alipay.branch" size="large" /></td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding:10px 0">
                            <div class="qr">
                                <div class="pic">
                                    <uploadFile path="nameAuth" v-model="alipayQR" :class="alipayQR.state == getStateStart ? 'focus' : ''">
                                        <i class="iconfont icon-erweima"></i>
                                        <em :style="{backgroundImage : 'url(' + alipayQR.origin + ')'}"></em>
                                        <div class="progress" v-if="alipayQR.state == getStateStart">
                                            <b :style="{height : alipayQR.progress + '%'}"></b>
                                            <div>{{alipayQR.progress + '%'}}</div>
                                        </div>
                                        <!-- <div class="btn"><span>{{lang[local].uploadpicbtn}}</span></div> -->
                                    </uploadFile>
                                </div>
                                <div v-if="!alipayQR.origin" style="font-size:14px">{{lang[local].transferModeTip14}}</div>
                            </div>
                        </td>
                    </tr>
                </table>
                <table v-if="chooseTransferMode == '3'">
                    <tr>
                        <td width="120">{{lang[local].transferModeTip9}}：</td>
                        <td>{{realname}}</td>
                    </tr>
                    <tr>
                        <td>{{lang[local].transferModeTip11}}：</td>
                        <td><Input v-model="wxpay.branch" size="large" /></td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding:10px 0">
                            <div class="qr">
                                <div class="pic">
                                    <uploadFile path="nameAuth" v-model="wxpayQR" :class="wxpayQR.state == getStateStart ? 'focus' : ''">
                                        <i class="iconfont icon-erweima"></i>
                                        <em :style="{backgroundImage : 'url(' + wxpayQR.origin + ')'}"></em>
                                        <div class="progress" v-if="wxpayQR.state == getStateStart">
                                            <b :style="{height : wxpayQR.progress + '%'}"></b>
                                            <div>{{wxpayQR.progress + '%'}}</div>
                                        </div>
                                        <!-- <div><span>{{lang[local].uploadpicbtn}}</span> </div> -->
                                    </uploadFile>
                                </div>
                                <div v-if="!wxpayQR.origin" style="font-size:14px">{{lang[local].transferModeTip14}}</div>
                            </div>
                        </td>
                    </tr>
                </table>
                <table v-if="chooseTransferMode == '4'">
                    <tr>
                        <td width="90">{{lang[local].transferModeTip9}}</td>
                        <td>{{realname}}</td>
                    </tr>
                    <tr>
                        <td colspan="2">PayNow {{lang[local].safety22}}：</td>
                    </tr>
                    <tr>
                        <td colspan="2"><Input :maxlength="50" size="large" v-model="PayNow.branch" :placeholder="lang[local].c2cIput" style="width:100%"/></td>
                    </tr>
                </table>
                <table v-if="chooseTransferMode == '5'">
                    <tr>
                        <td width="90">{{lang[local].transferModeTip9}}：</td>
                        <td>{{realname}}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Interace-Transfer {{lang[local].safety22}}：</td>
                    </tr>
                    <tr>
                        <td colspan="2"><Input :maxlength="50" size="large" v-model="Interace.branch" :placeholder="lang[local].c2cIput" style="width:100%"/></td>
                    </tr>
                </table>
                <table v-if="chooseTransferMode == '6'">
                    <tr>
                        <td width="150">{{lang[local].transferModeTip9}}：</td>
                        <td>{{realname}}</td>
                    </tr>
                    <tr>
                        <td>Paypal {{lang[local].safety22}}：</td>
                        <td><Input :maxlength="50" size="large" v-model="Paypal.branch" :placeholder="lang[local].c2cIput" style="width:100%"/></td>
                    </tr>
                </table>
                <table v-if="chooseTransferMode == '7'">
                    <tr>
                        <td width="90">{{lang[local].transferModeTip9}}：</td>
                        <td>{{realname}}</td>
                    </tr>
                    <tr>
                        <td colspan="2">UPI {{lang[local].safety22}} / MobileID：</td>
                    </tr>
                    <tr>
                        <td colspan="2"><Input :maxlength="50" size="large" v-model="UPI.branch" :placeholder="lang[local].c2cIput" style="width:100%"/></td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding:10px 0">
                            <div class="qr">
                                <div class="pic">
                                    <uploadFile path="nameAuth" v-model="UPIQR" :class="UPIQR.state == getStateStart ? 'focus' : ''">
                                        <i class="iconfont icon-erweima"></i>
                                        <em :style="{backgroundImage : 'url(' + UPIQR.origin + ')'}"></em>
                                        <div class="progress" v-if="UPIQR.state == getStateStart">
                                            <b :style="{height : UPIQR.progress + '%'}"></b>
                                            <div>{{UPIQR.progress + '%'}}</div>
                                        </div>
                                        <!-- <div><span>{{lang[local].uploadpicbtn}}</span> </div> -->
                                    </uploadFile>
                                </div>
                                <div v-if="!UPIQR.origin" style="font-size:14px">{{lang[local].transferModeTip14}}</div>
                            </div>
                        </td>
                    </tr>
                </table>
                <div style="margin-top:50px;">
                 <Button type="primary" size="large" style="font-size:16px" @click="transferModeSet(chooseTransferMode)"> {{lang[local].c2cSave}} </Button> <Button type="text" size="large" style="font-size:16px;float:right;paddingRight:0" @click="addModle = false;"> {{lang[local].c2cClose}} </Button>
                </div>
            </div>
        </Modal>
    </section>
</template>

<script>
import {toUrl} from "../../../../common/api/api"
export default {
    data(){
        return{
            active:null,
            bank:{
                branch:'',
                bank:'',
                account:'',
            },
            alipay:{
                real_name:'',
                branch:''
            },
            wxpay:{
                real_name:'',
                branch:''
            },
            UPI:{
                real_name:'',
                branch:''
            },
            Paypal:{
                real_name:'',
                branch:''
            },
            Interace:{
                real_name:'',
                branch:''
            },
            PayNow:{
                real_name:'',
                branch:''
            },
            wxpayQR:{},
            alipayQR:{},
            UPIQR:{},
            realname:'',
            authModle:false,
            review:'',
            isBindAli:false,
            isBindWx:false,
            account2:'',
            addModle:false,
            hasTransferMode:false,
            chooseTransferMode:null,
            transferModeListArray:[],
            list:[],
        }
    },
    watch:{
        "bank.account" (n,o){
            let numlength = 0
            let v = ''
            for(let k=0;k<numlength;k++){
                v += '\\d'
            }
            let re = new RegExp("^(\-)*(\\d+)\\.("+ v +").*$")
            this.bank.account = n && (n + '').replace(/[^\-?\d.]/g,'').replace(re,'$1$2.$3')
            
            if(this.bank.account.length>19){
                this.bank.account = this.bank.account.substring(0,19)
            }
        },
        "review" (n,o){
            let numlength = 0
            let v = ''
            for(let k=0;k<numlength;k++){
                v += '\\d'
            }
            let re = new RegExp("^(\-)*(\\d+)\\.("+ v +").*$")
            this.review = n && (n + '').replace(/[^\-?\d.]/g,'').replace(re,'$1$2.$3')
        }
    },
    created(){
        this.transferMode()
    },
    mounted(){
        // if(this.userBasicinfo.nameauthstatus == 1 && this.userBasicinfo.idcard){
            // this.transferMode()
        // }
    },
    methods:{
        isAuth(){
            if(this.userBasicinfo.nameauthstatus != 1){
                if(this.userBasicinfo.nameauthstatus == 0){
                    this.$store.commit('msg/err', this.lang[this.local].transferModeErr4)
                }else{
                    this.authModle = true
                }
            }else{
                this.clean()
                this.transferModeList()
                this.addModle = true
            }
        },
        go(){
            this.authModle = false
            location.href = toUrl.financeUrl + '/nameAuth'
            // window.history.back()
        },
        transferMode(){
            this.axios({
                url : this.api.transferMode,
                data : {
                }
            }).then(res=>{
                this.realname = res.data.real_name
                this.list = res.data.list
                this.hasTransferMode = res.data.list.length > 0 ? true : false
                if(res.data.bank){
                    this.bank = res.data.bank
                    this.account2 = res.data.bank.account
                }
                if(res.data.alipay){
                    this.alipay = res.data.alipay
                    this.alipayQR.origin = res.data.alipay.account
                    this.isBindAli = true
                }
                if(res.data.wechat){
                    this.wxpay = res.data.wechat
                    this.wxpayQR.origin = res.data.wechat.account
                    this.isBindWx = true
                }
            }).catch( err=>{
                console.log(err)
            })
        },
        clean(){
            this.active=null,
            this.bank={
                branch:'',
                bank:'',
                account:'',
            },
            this.alipay={
                real_name:'',
                branch:''
            },
            this.wxpay={
                real_name:'',
                branch:''
            },
            this.UPI={
                real_name:'',
                branch:''
            },
            this.Paypal={
                real_name:'',
                branch:''
            },
            this.Interace={
                real_name:'',
                branch:''
            },
            this.PayNow={
                real_name:'',
                branch:''
            },
            this.wxpayQR={},
            this.alipayQR={},
            this.UPIQR={}
        },
        transferModeSet(type,id){
            if(type =='1'){
                console.log(this.bank);
                
                if(!this.bank.bank.trim() || !this.bank.branch.trim() || !this.bank.account.trim()){
                    this.$store.commit('msg/err', this.lang[this.local].transferModeErr1)
                    return
                }
                if(this.review.trim() != this.bank.account.trim()){
                    this.$store.commit('msg/err', this.lang[this.local].transferModeErr2)
                    return
                }
                this.save(type,id)
            }
            if(type =='2'){
                if(!this.alipay.branch.trim()){
                    this.$store.commit('msg/err', this.lang[this.local].transferModeErr1)
                    return
                }
                if(!this.alipayQR.origin){
                    this.$store.commit('msg/err', this.lang[this.local].transferModeErr3)
                    return
                }
                this.save(type,id)
            }
            if(type =='3'){
                if(!this.wxpay.branch.trim()){
                    this.$store.commit('msg/err', this.lang[this.local].transferModeErr1)
                    return
                }
                if(!this.wxpayQR.origin){
                    this.$store.commit('msg/err', this.lang[this.local].transferModeErr3)
                    return
                }
                this.save(type,id)
            }
            if(type =='4'){
                if(!this.PayNow.branch.trim()){
                    this.$store.commit('msg/err', this.lang[this.local].transferModeErr1)
                    return
                }
                this.save(type,id)
            }
            if(type =='5'){
                if(!this.Interace.branch.trim()){
                    this.$store.commit('msg/err', this.lang[this.local].transferModeErr1)
                    return
                }
                this.save(type,id)
            }
            if(type =='6'){
                if(!this.Paypal.branch.trim()){
                    this.$store.commit('msg/err', this.lang[this.local].transferModeErr1)
                    return
                }
                this.save(type,id)
            }
            if(type =='7'){
                if(!this.UPI.branch.trim()){
                    this.$store.commit('msg/err', this.lang[this.local].transferModeErr1)
                    return
                }
                if(!this.UPIQR.origin){
                    this.$store.commit('msg/err', this.lang[this.local].transferModeErr3)
                    return
                }
                this.save(type,id)
            }
        },
        edit(ojb){

            switch (ojb.type) {
                case "1":
                    this.bank = {
                        ...ojb
                    }
                    break;
                case "2":
                    this.alipay ={
                        ...ojb
                    }
                    this.alipayQR.origin = ojb.account
                    break;
                case "3":
                    this.wxpay ={
                        ...ojb
                    }
                    this.wxpayQR.origin = ojb.account
                    break;
                case "4":
                    this.PayNow ={
                        ...ojb
                    }
                    break;
                case "5":
                    this.Interace ={
                        ...ojb
                    }
                    break;
                case "6":
                    this.Paypal ={
                        ...ojb
                    }
                    break;
                case "7":
                    this.UPI ={
                        ...ojb
                    }
                    this.UPIQR.origin = ojb.account
                    break;
            
                default:
                    break;
            }
            console.log(ojb)
            
        },
        save(type,id){            
            if(!this.userBasicinfo.nameauthstatus){
                this.$store.commit('msg/err', this.lang[this.local].transferModeErr4)
                return
            }
            let data = {}
            switch (type) {
                case '1':
                    data.bank = this.bank.bank.trim()
                    data.branch = this.bank.branch.trim()
                    data.account = this.bank.account.trim()
                    break;
                case '2':
                    data.branch = this.alipay.branch.trim()
                    data.account = this.alipayQR.origin
                    break;
                case '3':
                    data.branch = this.wxpay.branch.trim()
                    data.account = this.wxpayQR.origin
                    break;
                case '4':
                    data.branch = this.PayNow.branch.trim()
                    break; 
                case '5':
                    data.branch = this.Interace.branch.trim()
                    break; 
                case '6':
                    data.branch = this.Paypal.branch.trim()
                    break;
                case '7':
                    data.branch = this.UPI.branch.trim()
                    data.account = this.UPIQR.origin
                    break;  
                default:
                    break;
            }
            this.axios({
                url : this.api.transferModeSet,
                data : {
                    type,
                    id,
                    name:this.realname,
                    ...data
                }
            }).then(res=>{
                this.clean()
                this.transferMode()
                this.$store.commit('msg/add', res.message)
                this.addModle = false
            }).catch( err=>{
                this.$store.commit('msg/err', err.message)
            })  
        },

        unbindTransferMode(type,id){            
            this.axios({
                url : this.api.unbindTransferMode,
                data : {
                    type,
                    id,
                }
            }).then(res=>{
                this.active = null
                if(type==2){
                    this.alipay = {}
                    this.alipayQR = ''
                    this.isBindAli = false
                }
                if(type==3){
                    this.wxpay = {}
                    this.wxpayQR = ''
                    this.isBindWx = false
                }
                this.transferMode()
                this.$store.commit('msg/add', res.message)
            }).catch( err=>{
                this.$store.commit('msg/err', err.message)
            })
        },
        transferModeList(){            
            this.axios({
                url : this.api.transferModeList,
                data : {
                }
            }).then(res=>{
                this.transferModeListArray = res.data.list 
            }).catch( err=>{
                // this.$store.commit('msg/err', err.message)
                console.log(err.message)
                
            })
        },
        handleCancel(){
            this.clean()
        },
        handleChange(id,type){
            this.axios({
                url : this.api.enabled,
                data : {
                    type,
                    id,
                }
            }).then(res=>{
                this.transferMode()
                this.$store.commit('msg/add', res.message)
            }).catch( err=>{
                this.transferMode()
                this.active = null
                this.$store.commit('msg/err', err.message)                
            })
        },
    }
}
</script>

<style lang="scss" scoped>
    .card{        
        line-height:50px;
        position: relative;
        margin-bottom:20px;      
        .flag{position:absolute;top:0;left:0;background: red;display:block;padding:5px;color:#fff;z-index:999;font-size:12;line-height:12px;}
        .row{            
            margin-top:15px;
            border-bottom:2px solid #E3E3E3;
            background: #F6F4F5;
            font-size:16px;
            line-height:70px;
            &.cur{
                border:1px solid #FF6600
            }
            .type{
                text-align:left;
                padding-left:20px;
                font-weight:bold;
                background: #F0F0F0;
                height:68px;
                i{
                    width: 40px;
                    display: inline-block;
                    text-align:center
                }
            }
            .name{
                padding:0 30px;
            }
            .con{                
                border-top:2px solid #E3E3E3;
                table{
                    margin:20px auto;
                    width:50%;
                    td{
                        padding-right:10px;
                        .qr{
                            background: #EDEDED;
                            border:1px solid #dddee1;
                            text-align:center;
                            padding:20px 10px;
                            .pic{
                                position: relative;
                                .iconfont{
                                    font-size:150px;
                                    position:absolute;
                                    top:30%;
                                    left:26%;
                                    opacity:.5;
                                }                                
                            }
                            em{
                                height:200px;
                                width:200px;
                                display:block;
                                background-size: cover;
                                margin:0 auto;
                                position: relative;
                                z-index:88;
                                cursor: pointer;
                            }
                        }
                    }                    
                }
            }            
        }
    }
    .ka{
        input{
            border-radius:4px;
            border:1px solid #dddee1;
            line-height:32px;
            padding:0 10px;
            transition:all .3s;
            width:100%;
            &:focus, &:hover{
                border:1px solid #FF6600;
            }
        }
        span{
            border-radius:4px;
            border:1px solid #dddee1;
            border-left: none;
            line-height:32px;
            display: inline-block;
            padding:0 10px;
            background: #eee;
        }
    }
    .iconfont{font-size:26px;font-weight:normal;margin-right:10px;position: relative;top:3px;}
    .vertical-center-modal{
        table{
            width:100%;
            font-size:15px;
            td{
                line-height:46px;
                .qr{
                    background: #EDEDED;
                    border:1px solid #dddee1;
                    text-align:center;
                    padding:20px 10px;
                    .pic{
                        position: relative;
                        .iconfont{
                            font-size:150px;
                            position:absolute;
                            top:38%;
                            left:30%;
                            opacity:.5;
                        }                                
                    }
                    em{
                        height:180px;
                        width:180px;
                        display:block;
                        background-size: cover;
                        margin:0 auto;
                        position: relative;
                        z-index:88;
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>
