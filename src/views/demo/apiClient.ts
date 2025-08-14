import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://172.16.10.202:3000',
});

apiClient.interceptors.request.use(async (config) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return config;
});

export default apiClient;
