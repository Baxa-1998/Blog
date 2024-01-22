import axios from "axios"; 

const instance = axios.create({ 
  //  prod url 'https://blog-sever-ezqp.onrender.com'
  baseURL: 'https://blog-sever-ezqp.onrender.com',
})
instance.interceptors.request.use((config)=>{
  config.headers.Authorization = window.localStorage.getItem('token')
  return config
})

export default instance