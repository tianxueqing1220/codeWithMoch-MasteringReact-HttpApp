import axios from 'axios';
import logger from "./logService";
import { toast } from 'react-toastify';

axios.interceptors.response.use(null, error => {
  const expectdError = error.response && error.response.status >= 400 && error.response.status < 500
  if (!expectdError) {
    logger.log('Logging the error.', error);
    toast('An unexpected error occurred.')
  }
  return Promise.reject(error);
})

export default {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete
}