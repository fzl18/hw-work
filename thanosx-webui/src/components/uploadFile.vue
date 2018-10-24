<template>
    <label>
        <input style="display: none;" value="" type="file" @change="submit($event)" />
        <slot>
            <span>{{tit}}</span>
        </slot>
    </label>
</template>

<script>
    export default {
        name: "upload-file",
        props : {
            size : {
                default : 4
            },
            path : {
                default : ''
            },
            txt : {
                default : ''
            },
        },
        data (){
            return {
                fileData : {
                    state : -1,
                },
                origin : process.env.NODE_ENV == 'development' ? 'http://47.99.115.225/' : '',
            };
        },
        computed:{
            tit(){
                return this.txt ? this.txt : this.lang[this.local.upFiles]
            }
        },
        methods :{
            submit (e){
                if(this.fileData.state == this.getStateStart){
                    return false;
                };
                var file = e.target.files[0];
                if(!/\.jpg$|\.png$|\.gif$|\.jpeg$|\.webp$/.test(file.name)){
                    this.fileData = {
                        state : this.getStateError,
                        message : this.lang[this.local].imgFormatE,
                    };
                    this.$emit('input', this.fileData);
                    return;
                };
                if(file.size > (1024 * 1024 * this.size)){
                    this.fileData = {
                        state : this.getStateError,
                        message : this.lang[this.local].imgFormatSize.replace('{size}', this.size + 'M'),
                    };
                    this.$emit('input', this.fileData);
                    return;
                };
                let formData = new FormData();
                formData.append('file', file, file.name);
                formData.append('path', this.path);
                if(process.env.NODE_ENV == 'development'){
                    formData.append('cookie', document.cookie);
                };
                var fileVal = e.target.value;
                this.fileData = {
                    state : this.getStateStart,
                    message : this.lang[this.local].uploadFile0,
                    progress : 0,
                    file : fileVal
                };
                this.$emit('input', this.fileData);
                var self = this;
                this.axios({
                    url : this.api.upFiles,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    timeout : 120000,
                    onUploadProgress (progressEvent) {
                        self.$emit('input', Object.assign({}, self.fileData, {
                            progress : Math.floor(progressEvent.loaded / progressEvent.total * 100)
                        }));
                    },
                    data : formData
                }).then(res => {
                    e.target.value = '';
                    this.fileData = {
                        state : this.getStateSuccess,
                        data : res.data.url,
                        // origin : this.origin + res.data.url,
                        origin : res.data.url,
                        message : this.lang[this.local].uploadFile1,
                        file : fileVal,                        
                    };
                    this.$emit('input', this.fileData,);
                }).catch(err => {
                    e.target.value = '';
                    this.fileData = {
                        state : this.getStateError,
                        message : err.message,
                        file : fileVal
                    };
                    this.$emit('input', this.fileData);
                    console.log(err);
                });
            },
        }
    }
</script>

