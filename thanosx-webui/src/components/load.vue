<template>
    <div class="loading"></div>
</template>

<script>
    export default {
        name: "load"
    }
</script>

<style scoped lang="scss">
    @import "../assets/css/var.scss";

    .loading {
        min-height: 100px;
        position: relative;
        &.min{
            min-height: auto;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
        }
        &.min2{
            display: inline-block;
            vertical-align: middle;
            position: relative;
            min-height: auto;
            width: 20px;
            height: 20px;
            margin-left: 6px;
        }
    }
    .loading:before {
        width: 50px;
        height: 50px;
        border: 3px solid rgba($viceMainColor, 0.15);
        border-top-color: $mainColor;
        border-radius: 50%;
        margin: auto;
        z-index: 11;
        animation: loading .5s infinite linear;
    }
    .loading.min:before{
        width: 30px;
        height: 30px;
    }
    .loading.min2:before{
        width: 20px;
        height: 20px;
        border-width: 2px;
    }
    .loading-light-bg:after {
        background: #fff;
    }

    .loading:after {
        z-index: 10;
    }
    .loading:after, .loading:before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
    }

    @keyframes loading {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>
