import axios from 'axios'  // https://alligator.io/vuejs/rest-api-axios/

export const HTTP_REST_API = axios.create({
  baseURL: 'http://10.42.100.179:5050/api/'
})
