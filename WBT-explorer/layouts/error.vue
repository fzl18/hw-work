
<template v-if="error.statusCode === 404 ">
    <Err :type='404'/>   
</template>
<script>
import Err from '~/components/Err.vue'
export default {
    props:['error'],
    components: {
        Err,
    },
    mounted(){
        // console.log(this.error.message,this.error.statusCode)
    }
}
</script>
<style scoped>

</style>