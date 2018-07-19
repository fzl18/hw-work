<template>
    <section class="selectMy">
        <label class="select-box" ref="box" :class="selectActiveClass()">
            <select v-model="val" @click.stop="">
                <option v-for="v in list" :value="typeof v != 'object' ? v : v[0]">{{typeof v != 'object' ? v : v[1]}}</option>
            </select>
            <span class="select-input" :class="val ? 'active' : ''" @click.stop="focusSelect">{{valText}}</span>
            <ul class="select-list" v-if="active">
                <li v-for="v in list" @click.stop="changeSelect(v)">{{typeof v != 'object' ? v : v[1]}}</li>
            </ul>
        </label>
    </section>
</template>

<script>
    export default {
        name: "select-my",
        data (){
            return {
                active : false,
                val : '',
                valText : '',
            }
        },
        props : {
            list : {
                type : Array,
                default : function () {
                    return [['', this.lang.gu_finance100]];
                },
            },
            selected : {
                default : '',
            },
            disabled : {
                default : false,
            }
        },
        watch : {
            list (n, o){
                this.initList();
            }
        },
        created (){
            this.initList();
            document.querySelector('body').addEventListener('click', this.blurSelect.bind(this), false);
        },
        beforeDestroy (){
            document.querySelector('body').removeEventListener('click', this.blurSelect.bind(this), false);
        },
        methods : {
            initList (){
                var list = this.list;
                if(list.length){
                    if(typeof list[0] == 'object'){
                        list.forEach((item) => {
                            if(item[0] == this.selected){
                                this.valText = item[1];
                            };
                        })
                    }else{
                        this.valText = this.selected;
                    };
                    this.val = this.selected;
                };
            },
            selectActiveClass (){
                var top = this.offsetTop(this.$refs.box);
                if(top + 200 > document.querySelector('body').clientHeight){
                    return this.active ? 'active top' : '';
                };
                return this.active ? 'active' : '';
            },
            blurSelect (){
                this.active = false;
            },
            focusSelect (){
                if(!!!this.disabled){
                    this.active = !this.active;
                };
            },
            changeSelect (n){
                this.active = false;
                var s = typeof n != 'object' ? true : false;
                this.valText = s ? n : n[1];
                this.val = s ? n : n[0];
                this.$emit('input', s ? n : n[0]);
                this.$emit('change', n);
            }
        }
    }
</script>

<style lang="scss">
    @import "../assets/css/var.scss";
    $borderColor : #cccccc;
    $maxHeight : 200px;
    .selectMy{
        display: inline-block;
        height: 30px;
        position: relative;
        z-index: 20;
        vertical-align: middle;
        label{
            display: inline-block;
            position: relative;
            height : 100%;
            select{
                width: 0;
                height: 0;
                position: absolute;
                z-index: 0;
                opacity: 0;
            }
            & > span{
                display: inline-block;
                min-width: 80px;
                position: relative;
                z-index: 10;
                background: $bg;
                cursor: pointer;
                height: 30px;
                line-height: 30px;
                padding: 0 10px;
                border: solid 1px $borderColor;
                &:after{
                    display: inline-block;
                    position: absolute;
                    right: 15px;
                    content: '\e632';
                    @include iconfont(14px);
                    transform-origin: 50% 50%;
                    @include transitionCommon(transform, 0.3s);
                }
            }
            & > ul{
                display: block;
                position: absolute;
                top: 100%;
                left: 0;
                background: $bg;
                border: solid 1px $borderColor;
                border-top: none;
                min-width: 100%;
                max-height: $maxHeight;
                overflow: auto;
                box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
                li{
                    display: block;
                    padding: 5px 10px;
                    line-height: 1;
                    cursor: pointer;
                }
            }
            &.active.top > ul{
                top: auto;
                bottom: 100%;
                border-top: solid 1px $borderColor;
                border-bottom: none;
            }
            &.active > span:after {
                transform: rotateZ(180deg);
            }
            &.active.top > span:after {
                transform: rotateZ(180deg);
            }
        }
    }
</style>
