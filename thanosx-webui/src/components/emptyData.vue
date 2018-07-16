<template>
    <section class="empty-data">
        <slot>
            <span>{{lang.emptyData}}</span>
        </slot>
    </section>
</template>

<script>
    export default {
        name: "empty-data"
    }
</script>

<style scoped lang="scss">
    @import "../assets/css/var.scss";
    .empty-data{
        color: $viceFontColor;
        text-align: center;
        padding: 30px 0;
    }
</style>
