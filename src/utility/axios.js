import Authorization from './authorization';
import axios from 'axios';

axios.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const {
      config,
      response: {
        status,
        data: { error: errorMsg }
      }
    } = error;
    const originalRequest = config;

    if (
      status === 401 &&
      errorMsg !== 'You have entered an invalid username or password'
    ) {
      await Authorization.refreshAccessToken(
        () => {},
        () => {
          return Promise.reject(error);
        }
      );

      let accessToken = Authorization.getAccessToken();
      originalRequest.headers.Authorization = accessToken;
      let response = await axios(originalRequest).then(response => {
        return response;
      });

      return response;
    } else {
      return Promise.reject(error);
    }
  }
);

export default axios;
