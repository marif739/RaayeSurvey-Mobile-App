import axios from 'axios'

export default axios.create({
    //baseURL: 'https://localhost/survey/api/',
    //baseURL: 'https://192.168.1.101/survey/api/',
    //baseURL: 'http://demo.digitrixsolutions.com/api/',
    baseURL: 'https://raaye.com.pk/Admin/api/',
    headers:{
        'Access-Control-Allow-Origin': '*',
        'token':'$2y$10$lh2WOGol2drQdzltSN2Y3ev9m.LdTOjfd8tUzt8zDdwOPheRwiE2O'
    }
});