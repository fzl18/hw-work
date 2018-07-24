<template>
    <div class="copy-component" v-clipboard:copy="val" v-clipboard:success="onCopy" v-clipboard:error="onError"><slot>{{lang.copy}}</slot></div>
</template>

<script>
    import Vue from 'vue';
    import VueClipboard from 'vue-clipboard2';
    Vue.use(VueClipboard);
    export default {
        name: "copy",
        props : {
            val : {
                default : ''
            }
        },
        methods : {
            onCopy (e){
                this.$store.commit('msg/add', this.lang[this.local].copySuccess);
            },
            onError (e){
                this.$store.commit('msg/add', e.message || this.lang[this.local].copyError);
            },
        }
    }
</script>

<style scoped>
    .copy-component{
        display: inline-block;
        font-style: normal;
    }
</style>
