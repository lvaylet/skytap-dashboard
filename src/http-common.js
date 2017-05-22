import axios from 'axios'  // https://alligator.io/vuejs/rest-api-axios/

export const HTTP_REST_API = axios.create({
  baseURL: 'http://localhost:5080/api/'
})
