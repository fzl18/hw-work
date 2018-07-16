<template>
    <section>
        <h4 class="finance-title">
            <slot>
                <span>{{lang.finance}}</span>
            </slot>
        </h4>
        <!--<section class="finance-hint" v-if="hint && !loginInfo.paypassword">-->
        <section class="finance-hint" v-if="loginStatus && hint && !loginInfo.paypassword">
            {{lang.gu_finance41}}
        </section>
    </section>
</template>

<script>
    export default {
        name: "finance-header",
        props : {
            hint : {
                default : true
            }
        }
    }
</script>
