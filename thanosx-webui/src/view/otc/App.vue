<template>
    <section class="otc-box main-box">
        <header-component active="otc" />
        <section class="inner-header">
            <h4>
                <router-link to="/"><span>{{lang.otc}}</span></router-link>
            </h4>
        </section>
        <router-view/>
        <msg />
    </section>
</template>

<script>
    export default {
        name: "app",
    }
</script>
