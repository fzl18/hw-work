<template>
    <section class="link">
        <div class="container">
            <div class="tit">合作伙伴</div>
            <div class="flink">
                <a href=""><img src="../assets/images/link1.jpg" alt=""></a>        
                <a href=""><img src="../assets/images/link2.jpg" alt=""></a>        
                <a href=""><img src="../assets/images/link3.jpg" alt=""></a>        
                <a href=""><img src="../assets/images/link4.jpg" alt=""></a>                
                <a href=""><img src="../assets/images/link5.jpg" alt=""></a>                
                <a href=""><img src="../assets/images/link6.jpg" alt=""></a> 
            </div>
                           
        </div>        
    </section>
</template>

<script>
    export default {
        name: "Link",
        data (){
            return {
                list:[]
            }
        },
        created (){

        },
        mounted (){

        },
        methods : {

        },
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/css/var.scss";
    .link{margin:100px 0 50px 0;}
    .tit{color:#515151;font-size:22px;margin-bottom:20px;}
    .flink{
        background: #F9F9F9;
        height:70px;
        line-height:70px;
        box-shadow:0 3px 20px rgba(0, 0, 0, 0.1) inset;
        overflow: hidden;
        a{
            display:inline-block;
            padding:0 25px;
            margin:0 25px;
            opacity:.8;
            &:hover{
                opacity:1;
            }
            img{vertical-align: middle;}
        }
    }
</style>
