<template>
    <section>
        <load v-if="getStatus == getStateStart"/>
        <loadError v-if="getStatus == getStateError" @update="update" />
        <empty-data v-if="getStatus == getStateEmpty" />
    </section>
</template>

<script>
    export default {
        name: "list-load-template",
        props : ['getStatus'],
        data (){
            return {
            }
        },
        methods : {
            update (){
                this.$emit('update');
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../assets/css/var.scss";
</style>
