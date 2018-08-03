<template>
    <section class="article-box main-box">
        <header-component active="article" />  
        <load v-if="getState == getStateStart" />
        <section class="article-main">
            <section class="container">
                <section class="article-left">
                    <dl class="article-menu">
                        <!-- <dd v-for="item in categories">
                            <router-link :class=" item.is_category ? item.type_id == (info.category && info.category.type_id || info.type_id ) ?  'active' : '' : item.id == info.id ? 'active' : ''   " 
                            :to="`/${item.is_category ? 'list/' + item.type_id :'info/' + item.id } ` ">
                            {{item.is_category ? item.type_name : item.title}}
                            </router-link>
                        </dd> -->
                        <dd v-for="(item,index) in categories">
                            <router-link :class=" (item.type_alias == curClass && 'active') || (item.type_alias == info.type_alias &&  'active') " 
                            :to="`/list/${item.type_alias }`">
                            {{item.is_category ? item.type_name : item.title}}
                            </router-link>
                        </dd>
                    </dl>
                </section>
                <router-view />
            </section>
        </section>        
        <footer-component />
    </section>
</template>

<script>
    import {mapState} from "vuex";
    export default {
        name: "app",
        data (){
            return {
                activeItem : {},
                categories:[],
            }
        },
        computed : {            
            curClass(){
                return this.$route.params.id
            },
            ...mapState(['info'])
        },
        watch : {
            activeItem (n, o){
                this.$store.commit('activeObject', n);
            },
            local(){
                // this.getCtegories()
            },
        },
        mounted(){
            // this.getCtegories()
            this.categories = this.lang[this.local].newslistside
            // console.log(this.categories)
        },
        methods : {
            // getCtegories (){
            //     this.getState = this.getStateStart;
            //     this.axios({
            //         url : this.api.categories,
            //         data : {
            //         }
            //     }).then((res) => {
            //         this.categories= res.data.list
            //         this.getState = this.getStateSuccess;
            //     }).catch((err) => {
            //         this.getState = this.getStateError;
            //         console.log(err);
            //     });
            // },
        }
    }
</script>
