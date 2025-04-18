import axios from "axios";
import { store } from "../redux";
import { userLogout, setCredentials } from "../redux/users/login-slice";
import { baseUrl } from "./helper";

const api = axios.create({
  baseURL: `${baseUrl}/api`,
});

api.interceptors.request.use((config) => {
  const { userInfo } = store.getState().login;
  if (userInfo?.accessToken) {
    config.headers!["Authorization"] = `Bearer ${userInfo.accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token!);
  });
  pendingQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalReq = err.config;
    if (err.response?.status === 401 && !originalReq._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then((token) => {
          originalReq.headers["Authorization"] = `Bearer ${token}`;
          return axios(originalReq);
        });
      }
      originalReq._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = store.getState().login.userInfo?.refreshToken;
        const { data } = await axios.post(`${baseUrl}/api/auth/refresh-token`, {
          refreshToken,
        });
        store.dispatch(setCredentials(data));
        processQueue(null, data.accessToken);
        originalReq.headers["Authorization"] = `Bearer ${data.accessToken}`;
        return axios(originalReq);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        store.dispatch(userLogout());
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  }
);

export default api;
