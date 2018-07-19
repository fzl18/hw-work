<template>
    <section class="register-pas-tip">
        <div class="register-pas-tip-1" :class="'type' + type">
            <span></span><span></span><span></span>
            <b>{{type == 1 ? lang[local].weak : type == 2 ? lang[local].medium : lang[local].strong}}</b>
        </div>
        <div class="register-pas-tip-2" :class="len ? 'active' : ''"><i></i>{{lang[local].password1}}</div>
        <div class="register-pas-tip-2"  :class="numLetter ? 'active' : ''"><i></i>{{lang[local].password2}}</div>
    </section>
</template>

<script>
    export default {
        name: "register-pas-tip",
        props : ['param', 'tip'],
        data (){
            return {
                type : 1,
                len : false,
                numLetter : false
            }
        },
        watch : {
            param (n, o){
                this.matchPassword(n);
            }
        },
        created (){
        },
        mounted (){
            this.matchPassword(this.param);
        },
        methods : {
            matchPassword (n){
                if(n.length >= this.passwordMinLen && n.length <= this.passwordMaxLen){
                    this.len = true;
                    this.type = 1;
                }else{
                    this.len = false;
                };

                if(/^(?=.*[0-9])(?=.*[a-zA-Z])(.*)$/g.test(n)){
                    this.numLetter = true;
                }else{
                    this.numLetter = false;
                    this.type = 1;
                };

                if(this.numLetter && this.len){
                    this.type = 2;
                };

                if(this.numLetter && this.len && n.length >= 10){
                    this.type = 3;
                };
                this.update();
            },
            update (){
                var {type, len, numLetter} = this;
                this.$emit("update", {tip : this.tip, tipsData : {type, len, numLetter}});
            }
        }

    }
</script>

<style scoped lang="scss">
    @import "../../../assets/css/var.scss";
    .register-pas-tip{
        font-size: 12px;
    }
    .register-pas-tip-1{
        overflow: hidden;
        span{
            display: inline-block;
            width: 28px;
            height: 10px;
            background: $registerPasTipIntensityBg;
            margin-right: 12px;
            transition: background-color 0.4s;
        }
        &.type1{
            span:nth-child(1){
                background: $mainColor;
            }
        };
        &.type2{
            span:nth-child(1){
                background: $mainColor;
            }
            span:nth-child(2){
                background: $mainColor;
            }
        };
        &.type3{
            span{
                background: $mainColor;
            }
        };
        b{
            font-weight: normal;
            color: $mainColor;
        }
    }
    .register-pas-tip-2{
        margin-top: 8px;
        color: $fontColor;
        &:before{
            display: inline-block;
            vertical-align: middle;
            margin-right: 6px;
            content: '\e685';
            @include iconfont(16px);
            color: $mainColor;
            transition: all 0.4s;
        }
        &.active:before{
            content: '\e60f';
            color: inherit;
        }
    }
</style>
