<template>
  <view class="addWallet uni-padding-wrap">
    <view class="tab">
      <uni-segmented-control
        :current="current"
        :values="items"
        @clickItem="onClickItem"
        styleType="button"
        activeColor="#007aff"
      ></uni-segmented-control>
    </view>
    <text class="tit">{{lang[locale].addWallet.tit2}}</text>
    <view class="uni-card">
      <view class="uni-card-content">
        <view class="uni-card-content-inner">
          <input class type="text" v-model="name" :placeholder="lang[locale].addWallet.placeholder">
        </view>
      </view>
    </view>
    <view v-show="current">
      <text class="tit">{{lang[locale].addWallet.tit5}}</text>
      <text class="key" @tap="copy(createdAddress)">{{createdAddress}}</text>
      <text class="tit">{{lang[locale].addWallet.tit6}}</text>
      <text class="key" @tap="copy(createdKey)">{{createdKey}}</text>
    </view>
    <view v-if="!current">
      <text class="tit">{{lang[locale].addWallet.tit3}}</text>
      <view class="uni-card">
        <view class="uni-card-content">
          <view class="uni-card-content-inner">
            <textarea
              type="text"
              v-model="key"
              :placeholder="lang[locale].addWallet.placeholder2"
              style="font-size:30upx;height:120upx;"
            />
          </view>
        </view>
      </view>
    </view>
    <text class="tit">{{lang[locale].addWallet.tit4}}</text>
    <view class="uni-card">
      <view class="uni-card-content">
        <view class="uni-card-content-inner hr">
          <input
            type="password"
            v-model="password"
            :placeholder="lang[locale].addWallet.placeholder3"
          >
        </view>

        <view class="uni-card-content-inner">
          <input
            type="password"
            v-model="repassword"
            :placeholder="lang[locale].addWallet.placeholder4"
          >
        </view>
      </view>
    </view>
    <button
      type="primary"
      class="create"
      @tap="current==0 ? create() : newCreate()"
    >{{lang[locale].addWallet.btn3}}</button>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import uniSegmentedControl from "@/components/uni-segmented-control.vue";
export default {
  components: {
    uniSegmentedControl
  },
  data() {
    return {
      name: "",
      key: "",
      password: "",
      repassword: "",
      address: "",
      current: 0,
      items: [],
      createdAddress: "",
      createdKey: ""
    };
  },
  onNavigationBarButtonTap(e) {
    this.scan();
  },
  onLoad() {},
  computed: {
    ...mapState(["currentWalletIndex", "walletList", "lang", "locale"])
  },
  mounted() {
    uni.setNavigationBarTitle({
      title: this.lang[this.locale].addWallet.tit
	});
	this.items = [
      this.lang[this.locale].addWallet.btn,
      this.lang[this.locale].addWallet.btn2
    ];
  },
  methods: {
    ...mapMutations(["setCurWalletIndex", "addWallet", "setRefresh"]),
    scan() {
      this.rightDrawerVisible = false;
      uni.scanCode({
        success: res => {
          this.key = res.result;
        }
      });
    },
    handleInput(oj) {
      this[oj] = event.target.value;
    },
    // 生成新地址
    createAddress() {
      try {
        this.chainAPI.generateAddress();
      } catch (e) {
        console.log(e);
      }
      const newAddress = this.chainAPI.generateAddress();
      this.createdAddress = newAddress.wallet.address;
      this.createdKey = newAddress.wallet.secret;
    },
    onClickItem(index) {
      if (this.current !== index) {
        this.current = index;
        setTimeout(() => {
          if (index) {
            this.createAddress();
          }
        }, 50);
      }
    },
    create() {
      const { password, repassword, key, name, chainAPI, setRefresh } = this;
      let reg = /^([a-z0-9\@\!\#\$\%\^\&\*]){6,12}$/i;
      if (!name.length) {
        uni.showToast({ title: this.lang[this.locale].addWallet.toast,icon:'none' });
        return;
      }
      if(name.length > 16){
					uni.showToast({title:this.lang[this.locale].addWallet.toast9,icon:'none'})
					return
				}
      if (!key.length) {
        uni.showToast({ title: this.lang[this.locale].addWallet.toast2,icon:'none' });
        return;
      }
      if (key) {
        try {
          chainAPI.generateAddress(key);
        } catch (e) {
          uni.showToast({ title: this.lang[this.locale].addWallet.toast3,icon:'none' });
        }
        this.address = chainAPI.generateAddress(key).wallet.address; // 根据秘钥获取地址
      }
      if (password.length < 6) {
        uni.showToast({ title: this.lang[this.locale].addWallet.toast4,icon:'none' });
        return;
      }
      if(password.length >12){
					uni.showToast({title:this.lang[this.locale].addWallet.toast10,icon:'none'})
					return
				}
				if(!reg.test(password)){
					uni.showToast({title:this.lang[this.locale].addWallet.toast12,icon:'none'})
					return
				}
      if (!password || !repassword) {
        uni.showToast({ title: this.lang[this.locale].addWallet.toast5,icon:'none' });
        return false;
      } else if (password == repassword) {
        this.addWallet({
          key: this.address,
          sn: this.key,
          password,
          name
        });
        try {
          uni.setStorageSync("walletList", this.walletList);
          let last = this.walletList.length - 1;
          this.setCurWalletIndex(last);
          uni.setStorageSync("currentWalletIndex", last);
          setRefresh(true);
          uni.showToast({ title: this.lang[this.locale].addWallet.toast6 });
          setTimeout(() => {
            uni.navigateBack({
              delta: 5
            });
          }, 1000);
        } catch (e) {
          uni.showToast({ title: this.lang[this.locale].addWallet.toast7,icon:'none' });
        }
      } else {
        uni.showToast({ title: this.lang[this.locale].addWallet.toast8,icon:'none' });
        return;
      }
    },
    newCreate() {
      const { password, repassword, key, name, chainAPI, setRefresh } = this;
      let reg = /^([a-z0-9\@\!\#\$\%\^\&\*]){6,12}$/i;
      if (!name.length) {
        uni.showToast({ title: this.lang[this.locale].addWallet.toast,icon:'none' });
        return;
      }
      if (name.length > 16) {
        uni.showToast({ title: this.lang[this.locale].addWallet.toast9,icon:'none' });
        return;
      }
      if (password.length < 6) {
        uni.showToast({ title: this.lang[this.locale].addWallet.toast4,icon:'none' });
        return;
      }
      if (password.length > 12) {
        uni.showToast({ title: this.lang[this.locale].addWallet.toast10,icon:'none' });
        return;
      }
      if(!reg.test(password)){
					uni.showToast({title:this.lang[this.locale].addWallet.toast12,icon:'none'})
					return
				}
      if (!password || !repassword) {
        uni.showToast({ title: this.lang[this.locale].addWallet.toast5 });
        return false;
      } else if (password == repassword) {
        this.addWallet({
          key: this.createdAddress,
          sn: this.createdKey,
          password,
          name
        });
        try {
          uni.setStorageSync("walletList", this.walletList);
          let last = this.walletList.length - 1;
          this.setCurWalletIndex(last);
          uni.setStorageSync("currentWalletIndex", last);
          setRefresh(true);
          uni.showToast({ title: this.lang[this.locale].addWallet.toast6 });
          setTimeout(() => {
            uni.navigateBack({
              delta: 5
            });
          }, 1000);
        } catch (e) {
          uni.showToast({ title: this.lang[this.locale].addWallet.toast7,icon:'none' });
        }
      } else {
        uni.showToast({ title: this.lang[this.locale].addWallet.toast8,icon:'none' });
        return;
      }
    },
    copy(val) {
      uni.setClipboardData({
        data: val,
        success: function() {
          uni.showToast({ title: this.lang[this.locale].addWallet.toast11 });
        }
      });
    }
  }
};

</script>	
<style lang="less">
page {
  background: #eee;
}
.addWallet {
  padding-top: 20upx;
  .tab {
    margin: 20upx;
  }
  .tit {
    color: #515a6e;
    padding: 20upx;
    display: block;
  }
  .create {
    margin-top: 100upx;
    margin-bottom: 30upx;
  }
  .key {
    margin: 5upx 20upx;
    padding: 5upx 15upx;
    border: 1upx solid lightcoral;
    background: lemonchiffon;
    display: block;
    height: 50upx;
  }
  .hr {
    position: relative;
    &::after {
      content: "";
      width: 100%;
      height: 1px;
      position: absolute;
      background: #ddd;
      bottom: 0upx;
      left: 0;
    }
  }
}
</style>
