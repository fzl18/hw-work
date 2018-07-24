<template>
    <section>
        <section  class="safety-block">
            <financeHeader>
                <span>{{lang[local].nameAuth1}}</span>
            </financeHeader>
            
            <section class="safety-form text">
                <section class="form-group">
                    {{lang[local].nameAuth3}} ：
                    <span>
                        {{userBasicinfo.dcType}}
                    </span>
                </section>
                <section class="form-group">
                    {{lang[local].nameAuth5}} ：
                    <span>
                        {{userBasicinfo.truename}}
                    </span>
                </section>
                <section class="form-group">
                    {{lang[local].nameAuth6}} ：
                    <span>
                        {{userBasicinfo.idcard}}
                    </span>
                </section>
                <section class="form-group">
                    {{lang[local].nameAuth9}} ：
                    <span>
                        <img :src="imgUrl(userBasicinfo.idcardpic1)" alt="">
                    </span>
                </section>
                <section class="form-group">
                    {{lang[local].nameAuth10}} ：
                    <span>
                        <img :src="imgUrl(userBasicinfo.idcardpic2)" alt="">
                    </span>
                </section>
                <section class="form-group">
                    {{lang[local].nameAuth11}} ：
                    <span>
                        <img :src="imgUrl(userBasicinfo.idcardpic3)" alt="">
                    </span>
                </section>
                <section class="form-group">
                    {{lang[local].nameAuth26}} ：
                    <span>
                        {{
                        userBasicinfo.nameauthstatus == '0' && userBasicinfo.idcard
                        ? lang[local].nameAuth27
                        : userBasicinfo.nameauthstatus == '1' && userBasicinfo.idcard
                        ? lang[local].certified
                        : userBasicinfo.nameauthstatus == '2' && userBasicinfo.idcard
                        ? lang[local].nameAuth31
                        :lang[local].unauthorized
                        }}
                    </span>
                </section>
                <section class="form-group form-group-btn" v-if="userBasicinfo.nameauthstatus == '2' && userBasicinfo.idcard">
                    <router-link to="/nameAuth" class="form-submit-btn white">{{lang[local].nameAuth32}}</router-link>
                </section>
            </section>
        </section>
    </section>
</template>

<script>
    export default {
        name: "name-auth-details"
    }
</script>

