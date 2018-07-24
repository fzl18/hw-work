<template>
    <section>
        <section  class="safety-block">
            <h4 class="safety-title"><span>{{lang[local].safetyIssue1}}</span></h4>
            <section class="safety-hint">
                {{lang[local].safetyIssue2}}
            </section>
            <section class="safety-form">
                <section class="form-group">
                    <select-my class="safety-issue-select" v-model="questionid" :list="issueList" selected="" @change="issueChange" />
                </section>
                <section class="form-group">
                    <input type="text" @keyup.enter="submit" v-model="answer" name="safety-answer" :placeholder="lang[local].safetyIssue3" />
                </section>
                <section class="form-group form-group-btn">
                    <a href="javascript:;" @click="submit" class="form-submit-btn">{{lang[local].confirm}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                </section>
            </section>
        </section>
    </section>
</template>

<script>
    export default {
        name: "issue",
        data (){
            return {
                issueList : [],
                questionid : '',
                answer : '',
            };
        },
        created (){
            this.question();
        },
        methods : {
            submit (){
                if(!!!this.questionid){
                    this.$store.commit('msg/err', this.lang[this.local].safetyIssue4);
                    return false;
                };
                if(this.answer.length <= 0){
                    this.$store.commit('msg/err', this.lang[this.local].safetyIssue5);
                    return false;
                };
                var {answer, questionid} = this;
                this.getStart();
                this.axios({
                    url : this.api.upquestion,
                    data : {
                        answer,
                        questionid
                    }
                }).then((res) => {
                    this.getSuccess();
                    this.$store.commit('msg/add', this.lang[this.local].safetyIssue6);
                    this.$router.push('./');
                }).catch((err) => {
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang[this.local].safetyIssue6);
                });
            },
            issueChange (val){
                if(val[0]){
                    this.$store.commit('msg/delMsg', this.lang[this.local].safetyIssue4);
                }else{
                    this.$store.commit('msg/err', this.lang[this.local].safetyIssue4);
                };
            },
            question (){
                this.axios({
                    url : this.api.question,
                }).then((res) => {
                    var data = res.data || [];
                    var question = [['', this.lang[this.local].safetyIssue4]];
                    data.forEach((q) => {
                        question.push([q.id, q.question]);
                    });
                    this.issueList = question;
                }).catch((err) => {
                    console.log(err);
                });
            }
        },
    }
</script>

