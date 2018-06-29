import axios from 'axios'
const ajax = axios.create({
    baseURL:'http://54.199.247.61:7111/v2',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    timeout: 20000,
})
export default ajax