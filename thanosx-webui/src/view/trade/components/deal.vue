<template>
    <section class="deal">
        <dl class="deal-head">
            <dd>{{lang[local].tradeType}}</dd>
            <dd>{{lang[local].unitPrice}}</dd>
            <dd>{{lang[local].tradeVolume}}</dd>
            <dd>{{lang[local].time}}</dd>
        </dl>
        <load class="deal-load" v-if="!dealState" />
        <transition-group v-if="dealState" name="deal" tag="section" class="deal-body">
            <dl v-for="item in deal" :key="item[4]" @click="clickItem(item)">
                <dd :class="item[1] + 'Color'">{{lang[local][item[1]]}}</dd>
                <dd :class="item[1] + 'Color'">{{priceAccuracy(item[2])}}</dd>
                <dd>{{numAccuracy(item[3])}}</dd>
                <dd>{{localDate(item[0], true)}}</dd>
            </dl>
        </transition-group>
    </section>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        name: "deal",
        data (){
            return {
            };
        },
        computed : {
            ...mapState(['deal', 'dealState', 'dealTeam']),
        },
        watch : {
        },
        created (){
        },
        methods : {
            clickItem (item){
                this.$store.commit('clickData', [item[1], item[2], item[3]]);
            },
        }
    }
</script>

<style lang="scss">
    @import "../../../assets/css/var.scss";

    .deal{
        width: calc(50% - 5px);
        height: 100%;
        float: left;
        margin-right: 5px;
        background: #2C2C2C;
        // border-right: solid 1px $tradeBorderColor;
        position: relative;
        dl{
            display: block;
            overflow: hidden;
            dd{
                display: block;
                float: left;
                &:nth-child(1){
                    width: 20%;
                    text-align: center;
                }
                &:nth-child(2){
                    width: 20%;
                    text-align: center;
                }
                &:nth-child(3){
                    width: 30%;
                    text-align: right;
                    padding-right: 5px;
                }
                &:nth-child(4){
                    width: 30%;
                    text-align: right;
                    padding-right: 5px;
                }
                @media screen and (max-width: $tradeMedia1){
                    &:nth-child(1){
                        width: 22%;
                        text-align: center;
                    }
                    &:nth-child(2){
                        display: none;
                    }
                    &:nth-child(3){
                        width: 39%;
                    }
                    &:nth-child(4){
                        width: 39%;
                    }
                }
            }
            &.deal-head{
                // border-bottom: solid 1px $tradeBorderColor;
                background: #313131;
                color: #7d7d7d;
                text-align: center;
                height: $tradeHeadH;
                line-height: $tradeHeadH;
            }
        }
        .deal-body{
            position: absolute;
            top: $tradeHeadH + 5px;
            bottom: 5px;
            left: 0;
            right: 0;
            @include scroll1;
            dl{
                cursor: pointer;
                transition: transform 0.5s ease;
                &:hover{
                    background: $tradeMainColor;
                }
                dd{
                    font-size: 12px;
                    color: #ffffff;
                    height: 24px;
                    line-height: 24px;
                }
            }
        }
    }
</style>
