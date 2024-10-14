import axios from "axios";
import getCookie from "./cookie";


const csrftoken = getCookie('csrftoken')

let client = axios.create({
    baseURL: "http://localhost:8000",
})

client.defaults.withCredentials = true;
client.defaults.headers.common['X-CSRFToken'] = csrftoken;
client.defaults.headers.common['content-type'] = 'application/json';
client.defaults.headers.common['Sec-Fetch-Site'] = 'same-origin';

client.defaults.xsrfCookieName = 'csrftoken'
client.defaults.xsrfHeaderName = 'x-csrftoken'

export default client;