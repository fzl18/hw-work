<template>
<section>
    <header-component active="login" />
    <section class="login-box main-box">
        <section class="login-bg">
            <img class="bg animated pulse" src="./assets/images/bg.jpg" alt="">
        </section>
        <section class="login-main">
            <section class="login-body">
                <div class="login-center">
                    <router-view/>
                    <tips />
                </div>                
            </section>            
        </section>        
    </section>
</section>
</template>

<script>
    export default {
        name: "App"
    }
</script>
