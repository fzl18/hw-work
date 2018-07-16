<template>
    <div class="loading-error">
        <slot>
            {{lang.loadError}}，
        </slot>
        <a href="javascript:;" @click="reload">{{lang.refresh}} <i :class="classActive(status)"></i></a>
    </div>
</template>

<script>
    export default {
        name: "load-error",
        data (){
            return {
                status : false
            };
        },
        watch : {
            status (n, o){
                if(n == true){
                    this.$emit('update', this.status);
                };
            },
        },
        methods : {
            reload (){
                this.status = true;
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../assets/css/var.scss";
    .loading-error{
        display: block;
        text-align: center;
        padding: 30px 0;
        a{
            i{
                display: inline-block;
                transform-origin: 50% 50%;
                &:after{
                    display: inline-block;
                    vertical-align: -10%;
                    margin-left: 6px;
                    content: '\e615';
                    @include iconfont(18px);
                    font-weight: bold;
                }
                &.active:after{
                    animation: icon 1s linear infinite;
                }
            }

        }
    }
    @keyframes icon {
        0% {
            transform: rotateZ(0);
        }
        100% {
            transform: rotateZ(360deg);
        }
    }
</style>
