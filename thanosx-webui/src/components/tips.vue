<template>
    <section class="tips-box">
        <section class="tips-item" :style="position(tip)" v-for="tip in tips" v-if="tip.status != false" :id="tip.text" :key="tip.text">
            <div class="tips">
                <component v-if="tip.component" :is="tip.component()" :param="tip.data" :tip="tip" @update="update"></component>
                {{tip.component ? '' : tip.text}}
            </div>
        </section>
    </section>
</template>

<script>
    import {mapState} from 'vuex';
    export default {
        name: "tips",
        computed : {
            ...mapState('tips', ['tips'])
        },
        methods : {
            position (tip){
                var p = {};                
                let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
                let isMobile = (flag && flag.length) >0 ? true : false
                if(tip.el && document.querySelector(tip.el)){
                    var el = document.querySelector(tip.el);                    
                    if(isMobile){
                        p.top = this.offsetTop(el) - 50 + 'px';
                        p.left = this.offsetLeft(el) + 'px';
                    }else{
                        p.top = this.offsetTop(el) + 'px';
                        p.left = this.offsetLeft(el) + 'px';
                    }
                    p.transform = 'translateY(-100%) translateX(0%)';
                    // if(tip.align == 'left'){
                    //     p.left = this.offsetLeft(el) + 'px';
                    //     p.transform = 'translateY(-100%) translateX(0%)';
                    // }else{
                    //     var elL = this.offsetLeft(el);
                    //     var l = this.offsetLeft(el) + (el.clientWidth / 2);
                    //     if(l > window.innerWidth * 0.5){
                    //         p.right = (window.innerWidth - elL - (el.clientWidth / 2)) + 'px';
                    //         p.transform = 'translateY(-100%) translateX(50%)';
                    //     }else{
                    //         p.left = l + 'px';
                    //     };
                    // };
                };
                return p;
            },
            update (data){
                this.$store.commit("tips/tipsData", data);
            }
        },
    }
</script>

<style scoped lang="scss">
    @import "../assets/css/var.scss";
    .tips-item{
        display: block;
        position: absolute;
        padding-bottom: 10px;
        transform: translateY(-100%) translateX(-50%);
        transition: all 1s;
        z-index: 99999;
        .tips{
            display: block;
            position: relative;
            z-index: 9999;
            padding: 15px 20px;
            background: $bg;
            box-shadow: 5px 5px 5px rgba(#000000, 0.5);
            border-radius: 5px;
            border: solid 1px $tipsBorderColor;
            color: #444444;
            &:before{
                content: '';
                display: block;
                position: absolute;
                width: 13px;
                height: 13px;
                top: 100%;
                left: 50%;
                background: $bg;
                box-shadow: 3px 3px 3px rgba(#000000, 0.1);
                transform: translateX(-100%) rotateZ(45deg) translateY(-90%);
            }
        }
    }
</style>
