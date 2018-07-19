<template>
    <div class="finance-coinBalance" style="display:none">
        <span>
            <small>{{lang[local].totalAmount}} {{upperCase(coin)}}</small>
            <b>{{numDecimals(balance.tol || (balance.xnb + balance.xnbd + balance.xnblock))}}</b>
        </span>
        <span>
            <small>{{lang[local].usable}} {{upperCase(coin)}}</small>
            <b>{{numDecimals(balance.xnb)}}</b>
        </span>
        <span>
            <small>{{lang[local].freeze}} {{upperCase(coin)}}</small>
            <b>{{numDecimals(balance.xnbd)}}</b>
        </span>
        <span>
            <small>{{lang[local].lock}} {{upperCase(coin)}}</small>
            <b>{{numDecimals(balance.xnblock)}}</b>
        </span>
    </div>
</template>

<script>
    export default {
        name: "balance",
        data (){
            return {
                balance : {
                    xnb: 0,
                    xnbd: 0,
                    xnblock: 0,
                    fee: 0,
                    minZc: 0,
                    maxZc: 0,
                    state : 0
                },
            }
        },
        props : ['coin'],
        watch : {
            coin (n, o){
                this.myCoin();
            },
        },
        created (){
            this.$emit('input', this.balance);
            this.myCoin();
        },
        methods : {
            myCoin (){
                this.axios({
                    url : this.api.myCoin,
                    data : {
                        coin : this.lowerCase(this.coin)
                    },
                }).then((res) => {
                    this.balance = res.data;
                    this.balance.state = 1;
                    this.$emit('input', this.balance);
                }).catch((err) => {
                    this.balance.state = 2;
                    console.log(err);
                });
            },
        }
    }
</script>

<style scoped>

</style>
