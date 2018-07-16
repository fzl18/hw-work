<template>
    <section class="app-download-box">
        <section class="app-download-icon">
            <img src="../assets/images/app-icon.png" alt="">
            <div>
                <h4>{{lang.webName}}</h4>
                <p>{{lang.appDownloadDescribe2}}</p>
            </div>
        </section>
        <a :href="appDownloadUrl" target="_blank" class="app-download-btn">
            {{lang.appDownload}}
        </a>
        <!--<span class="app-download-close"></span>-->
    </section>
</template>

<script>
    export default {
        name: "appDownload",
        methods : {
            down (){
                if(/Android/gi.test(navigator.userAgent)){
                    location.href = '';
                }else{
                    this.$store.commit('msg/err', 'iOS下载暂未开放');
                }
            }
        },
    }
</script>

