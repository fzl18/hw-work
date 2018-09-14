
<template>
    <div class="layout">
        <Header />
        <div class="middle" :style="this.$route.name === 'index' && 'margin-top:-100px'">
            <div class="main">
                <nuxt />
            </div>
        </div>
        <Footer />
    </div>    
</template>
<script>
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
export default {
    
    components: {
        Footer,
        Header,
    },
    mounted(){

    }
}
</script>
<style scoped>
    .middle{min-height:70vh}
    .content{padding:30px 50px;background: #fff;}
</style>