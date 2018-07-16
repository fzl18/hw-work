<template>
    <section class="ewm">
        <img :src="url" alt="">
    </section>
</template>

<script>
    // import QArt from 'qartjs';
    // import logo from '../assets/images/logo.png'
    import QRCode from 'qrcode'

    export default {
        name: "ewm",
        data (){
            return {
                url : ''
            }
        },
        props : {
            value : {
                default : ''
            },
            size : {
                default : 150
            }
        },
        watch : {
            value (n, o){
                this.setEwm(n);
            }
        },
        mounted (){
            if(this.value){
                this.setEwm(this.value);
            };
        },
        methods : {
            setEwm (val){
                QRCode.toDataURL(val, {
                    margin : 1,
                    width : this.size
                })
                .then(url => {
                    this.url = url;
                })
                .catch(err => {
                    console.error(err)
                });
            },
        },
    }
</script>

<style scoped>

</style>
