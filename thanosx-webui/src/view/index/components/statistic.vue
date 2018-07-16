<template>
    <section class="statistic" :class="animateClass">
        <ul>
            <li>
                <i></i>
                <h4><span>{{totaluser}}</span>+</h4>
                <p>{{lang.totalUser}}</p>
            </li>
            <li>
                <i></i>
                <h4><span>{{totalincome}}</span>+</h4>
                <p>{{lang.totalIncome}}</p>
            </li>
            <li>
                <i></i>
                <h4><span>{{totaltrans}}</span>+</h4>
                <p>{{lang.totalTrans}}</p>
            </li>
            <li>
                <i></i>
                <h4><span>{{totaltime}}</span>+</h4>
                <p>{{lang.totalTime}}</p>
            </li>
        </ul>
    </section>
</template>

<script>
    export default {
        name: "statistic",
        data (){
            return {
                time : 1000,
                gapTime : 50,
                gapMax : 1100,
                totalincome : 0,
                totaltime : 0,
                totaltrans : 0,
                totaluser : 0,
                totalincomeTimer : null,
                totaltimeTimer : null,
                totaltransTimer : null,
                totaluserTimer : null,
                animateCount : 0,
            }
        },
        created (){
            this.getAppStatics();
        },
        mounted (){
            var self = this;
            var dom = document.querySelector('body').scrollTop ? document.querySelector('body') : document.querySelector('html');
            if(dom.scrollTop && document.querySelector('.statistic')){
                self.startScroll('.statistic', this.enterCallback, this.exitCallback);
            }else{
                setTimeout(() => {
                    self.startScroll('.statistic', this.enterCallback, this.exitCallback);
                }, 500);
            };
        },
        methods : {
            enterCallback (){
                this.numAnimate('totalincome', this.totalincome);
                this.numAnimate('totaltime', this.totaltime);
                this.numAnimate('totaltrans', this.totaltrans);
                this.numAnimate('totaluser', this.totaluser);
                this.animateCount = 1;
            },
            exitCallback (){
                this.animateCount = 0;
            },
            getAppStatics (){
                this.axios({
                    url : this.api.getAppStatics,
                }).then((res) => {
                    var data = res.data || {};
                    this.totalincome = data.totalincome || 0;
                    this.totaltime = data.totaltime || 0;
                    this.totaltrans = data.totaltrans || 0;
                    this.totaluser = data.totaluser || 0;
                    this.animateCount = 0;
                    this.enterCallback();
                }).catch((err) => {

                });
            },
            numAnimate (name, num){
                if(!num){
                    this.animateCount = 0;
                    return false;
                };
                if(this[name + 'Timer']) return;
                if(this.animateCount == 1) return;
                var gapMax = this.gapMax;
                var gap = num > gapMax ? gapMax : num;
                var startNum = num < gapMax ? 0 : num - gap;
                var endNum = num;
                this[name] = startNum;
                var i = Math.floor(gap / (this.time / this.gapTime));
                this[name + 'Timer'] = setInterval(() => {
                    this[name] = this[name] +  i;
                    if(this[name] >= endNum){
                        clearInterval(this[name + 'Timer']);
                        this[name] = endNum;
                        this[name + 'Timer'] = null;
                    };
                }, this.gapTime)
            },
        },
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/css/var.scss";
    .statistic{
        background: $bg;
        padding-top: 80px;
        ul{
            width: $webWidth;
            margin: 0 auto;
            display: block;
            overflow: hidden;
            li{
                display: block;
                float: left;
                width: 23%;
                padding-left: 60px;
                position: relative;
                &:before{
                    content: '';
                    position: absolute;
                    display: block;
                    left: 0px;
                    top: 0;
                    bottom: 0;
                    border-left: solid 1px $bg2;
                }
                i{
                    display: inline-block;
                    padding: 10px 0;
                    border-bottom: solid 2px $mainColor;
                    &:before{
                        content: '\e62b';
                        @include iconfont(45px);
                    }
                }
                h4{
                    font-size: 38px;
                    padding-top: 8px;
                    color: $mainColor;
                    line-height: 1.8;
                }
                p{
                    font-size: 16px;
                    color: $viceFontColor;
                }
                &:nth-child(1){
                    padding-left: 0;
                    &:before{
                        display: none;
                    }
                }
                &:nth-child(2){
                    width: 27%;
                    i:before{
                        content: '\e625';
                    }
                }
                &:nth-child(3){
                    width: 27%;
                    i:before{
                        content: '\e659';
                    }
                }
                &:nth-child(4){
                    i:before{
                        content: '\e626';
                    }
                }
            }
        }
    }
</style>
