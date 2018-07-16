<template>
    <section>
        <section  class="safety-block">
            <h4 class="safety-title"><span>{{lang.nameAuth1}}</span></h4>
            <section class="safety-form text">
                <section class="form-group">
                    <label>{{lang.nameAuth3}}</label>
                    <section class="text">
                        {{userBasicinfo.dcType}}
                    </section>
                </section>
                <section class="form-group">
                    <label>{{lang.nameAuth5}}</label>
                    <section class="text">
                        {{userBasicinfo.truename}}
                    </section>
                </section>
                <section class="form-group">
                    <label>{{lang.nameAuth6}}</label>
                    <section class="text">
                        {{userBasicinfo.idcard}}
                    </section>
                </section>
                <section class="form-group">
                    <label>{{lang.nameAuth9}}</label>
                    <section class="text">
                        <img :src="imgUrl(userBasicinfo.idcardpic1)" alt="">
                    </section>
                </section>
                <section class="form-group">
                    <label>{{lang.nameAuth10}}</label>
                    <section class="text">
                        <img :src="imgUrl(userBasicinfo.idcardpic2)" alt="">
                    </section>
                </section>
                <section class="form-group">
                    <label>{{lang.nameAuth11}}</label>
                    <section class="text">
                        <img :src="imgUrl(userBasicinfo.idcardpic3)" alt="">
                    </section>
                </section>
                <section class="form-group">
                    <label>{{lang.nameAuth26}}</label>
                    <section class="text">
                        {{
                        userBasicinfo.nameauthstatus == '0' && userBasicinfo.idcard
                        ? lang.nameAuth27
                        : userBasicinfo.nameauthstatus == '1' && userBasicinfo.idcard
                        ? lang.certified
                        : userBasicinfo.nameauthstatus == '2' && userBasicinfo.idcard
                        ? lang.nameAuth31
                        :lang.unauthorized
                        }}
                    </section>
                </section>
                <section class="form-group form-group-btn" v-if="userBasicinfo.nameauthstatus == '2' && userBasicinfo.idcard">
                    <router-link to="/nameAuth" class="form-submit-btn white">{{lang.nameAuth32}}</router-link>
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

