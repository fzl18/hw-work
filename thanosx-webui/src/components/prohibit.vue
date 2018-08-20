<template>
    <section class="prohibit">
        <img src="../assets/images/pic.png" alt="">
        <div v-if="!status">
            <p>{{lang[local].noway1}}({{ip}}){{lang[local].noway2}}{{lang[local][country]}}</p>
            <p>{{lang[local].noway3}}</p>
        </div>
    </section>
</template>

<script>
    export default {
        name: "prohibit",
        data(){
            return {
                country:'',
                ip:'',
                status:false,
            }
        },
        created(){
            this.comeFrom()
        },
        methods:{
            comeFrom (){
                this.axios({
                    url : this.api.ipfrom,
                }).then((res) => {
                   this.ip = res.data.ip
                   this.country = res.data.country == '美国' ? 'country1' : 'country2'
                   if(res.data.status =='success'){
                       this.status = true
                       location.href = '/'
                   }else{
                       this.status = false
                   }
                }).catch((err) => {
                    console.log(err);
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    .prohibit{
        margin-top:20vh;
        height:65vh;
        text-align: center;
        p{font-size:18px;color:#707070;margin-top:20px;}
    }
</style>
