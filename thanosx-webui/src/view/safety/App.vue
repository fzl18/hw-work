<template>
    <section class="safety-box main-box">
        <header-component active="safety" />
        <section class="inner-header">
            <h4>
                <router-link to="/"><span>{{lang.safety}}</span></router-link>
            </h4>
        </section>
        <load v-if="!userBasicinfo.userid && $route.name != 'index'" />
        <router-view/>
        <msg />
    </section>
</template>

<script>
    export default {
        name: "app",
    }
</script>
