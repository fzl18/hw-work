<template>
    <section class="appDownload-box">
        <section class="appDownload-img">
            <img class="app-img1" src="../../index/assets/images/app_img1.png" alt="">
            <img class="app-img2" src="../../index/assets/images/app_img2.png" alt="">
            <h4>{{lang.appDownloadTitle}}</h4>
            <p>{{lang.appDownloadDescribe2}}</p>
        </section>
        <section class="app-btn-box">
            <div class="app-btn-list">
                <a href="itms-services://?action=download-manifest&url=https://www.rbtc.io/Upload/app/ios/RBTC.plist"><span>App Store</span></a>
                <a href="https://www.rbtc.io/Upload/ueditor/file/20180625/1529914786536287.pdf" ><span>{{lang.IOSInstallGuide}}</span></a>
                <a :href="apkUrl" ><span>Android</span></a>
            </div>
        </section>
        <section class="browser-download" v-if="state == 2">
            {{lang.appDownloadWeChat}}
        </section>
    </section>
</template>

<script>
    export default {
        name: "appDownload",
        data (){
            return {
                state : 1
            }
        },
        created (){
            this.micromessenger();
        },
        methods : {
            iosDown (){
                this.$store.commit('msg/err', 'iOS 敬请期待！');
            },
            micromessenger (){
                if(/micromessenger/gi.test(navigator.userAgent)){
                    this.state = 2;
                }
            }
        }
    }
</script>
