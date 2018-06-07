import axios from 'axios'
const ajax = axios.create({
    baseURL:'http://hengwell.asuscomm.com:7111/v2',
    timeout: 20000,
})
export default ajax