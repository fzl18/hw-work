import axios from 'axios'
const ajax = axios.create({
    baseURL: 'https://wbtong_dataapi.hwelltech.com/v2' ,               //baseURL: 'https://dataapi.echain.world/v2',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    timeout: 20000,
})



export default ajax