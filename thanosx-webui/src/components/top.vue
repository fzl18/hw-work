<template>
    <ul class="home-top-right">
        <!--<li class="wx">
            <span>{{lang.followWechat}}</span>
            <div class="ewm">
                <img src="../assets/images/app_ewm.png" alt="">
            </div>
        </li>-->
        <li class="app">
            <span>{{lang.appDownload}}</span>
            <div class="ewm">
                <ewm :value="api.appDownload" :size="200"></ewm>
            </div>
        </li>
        <li class="lang">
            <span>简体中文</span>
            <ul>
                <li><a href="javascript:;">简体中文</a></li>
                <li><a href="javascript:;">繁体中文</a></li>
                <li><a href="javascript:;">English</a></li>
            </ul>
        </li>
    </ul>
</template>

<script>
    export default {
        name: "top-component"
    }
</script>
