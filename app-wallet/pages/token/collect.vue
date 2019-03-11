<template>
  <view class="addWallet" v-if="walletList[currentWalletIndex]">
    <view class="uni-padding-wrap">
      <view class="uni-card">
        <view class="uni-card-content box">
          <view class="uni-card-content-inner">
            <qrcode :val="walletList[currentWalletIndex].key" :size="250" ref="qr"></qrcode>
          </view>
          <view class="copy">
            {{lang[locale].collect.accountAddr}}：
            <view class>{{walletList[currentWalletIndex].key}}</view>
          </view>
        </view>
      </view>
      <button type="primary" class="del" @tap="setClipboard">{{lang[locale].collect.copy}}</button>
    </view>
  </view>
</template>

<script>
import qrcode from "@/components/qrcode/qrcode.vue";
import { mapState, mapMutations } from "vuex";
export default {
  components: {
    qrcode
  },
  data() {
    return {
      name: "",
      key: ""
    };
  },
  onLoad(option) {},
  mounted() {
    this.$refs.qr.creatQrcode();
  },
  mounted() {
    uni.setNavigationBarTitle({
      title: this.lang[this.locale].collect.tit
    });
  },
  computed: {
    ...mapState(["walletList", "currentWalletIndex", "lang", "locale"])
  },
  methods: {
    ...mapMutations(["setCurWalletIndex", "delWallet", "setCurWalletIndex"]),
    setClipboard() {
      uni.setClipboardData({
        data: this.walletList[this.currentWalletIndex].key,
        success: function() {
          uni.showToast({ title: this.lang[this.locale].collect.toast });
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
  .tit {
    color: #515a6e;
    padding: 20upx;
    display: block;
  }
  .del {
    margin-top: 100upx;
    margin-bottom: 30upx;
  }
  .box {
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 20upx;
  }
  .copy {
    background: lightblue;
    margin-bottom: 30upx;
    padding: 10upx;
    word-break: break-all;
  }
}
</style>
