import axios from 'axios';
import { ClientID, ClientSecret } from '../configs/facekiConfig';

const baseURL = "https://sdk.faceki.com";

const service = axios.create({ baseURL });


service.interceptors.request.use(async (config) => {
    // const access_token = sessionStorage.getItem('access_token');

    let token = await axios.get(baseURL + `/auth/api/access-token?clientId=${ClientID}&clientSecret=${ClientSecret}`).then(res =>{
        return res.data
    })

    config.headers.Authorization = `Bearer ${token?.data?.access_token}`;
    return config;
});

export default service