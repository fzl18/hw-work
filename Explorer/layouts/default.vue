
<template>
    <div class="layout">
        <Header />
        <div class="middle">
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
    }
}
</script>
<style scoped>
    .middle{min-height:70vh;background: #fff;}
    .content{padding:30px 0;background: #fff;}
</style>