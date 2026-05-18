import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const API_BASE_URL = 'http://localhost:8000/api/v1';
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let authInterceptor: number | null = null;
export function setAuthToken(token: string | null) {
  if (authInterceptor !== null) {
    api.interceptors.request.eject(authInterceptor);
  }
  if (token) {
    authInterceptor = api.interceptors.request.use(config => {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  } else {
    authInterceptor = null;
  }
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
};

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error?.config;
    if (
      error?.response?.status === 401 &&
      originalRequest.url !== `${API_BASE_URL}/auth/refresh` &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = useAuthStore.getState().refreshToken;
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }
          const { accessToken } = (
            await api.post('/auth/refresh', { refreshToken })
          ).data;
          useAuthStore.getState().setAccessToken(accessToken);
          setAuthToken(accessToken);
          onRefreshed(accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          useAuthStore.getState().logout();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }
    return Promise.reject(error);
  },
);

// export const signUp = async (data: {
//   name: string;
//   email: string;
//   password: string;
// }) => {
//   console.log('Signing up with data in apiclient :', data);
//   return (await api.post('/auth/signup', data)).data;
// };

export const signUp = async (signUpData: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    // Log this to see exactly what Axios is about to send
    console.log('Sending to Axios:', signUpData); 
    
    const response = await api.post('/auth/signup', signUpData);
    console.log('Received from Axios:', response.data);
    return response.data;
  } catch (error:any) {
    // This will tell you if the error is 400, 500, or a Network Error
    console.error('Axios Error Details:', error.response?.data || error.message);
    throw error;
  }
};
export const login = async (data: { email: string; password: string }) =>
  (await api.post('/auth/login', data)).data;

export const googleLogin = async (idToken:string) => (
    await api.post('/auth/google-login', { idToken })
).data;

export const fetchProfile = async() => (
  await api.get('/users/profile')
).data;

export const updateProfile = async (data:{
  bio?:string;
  lookingTo?:string[];
  interests?:string[];
  aboutMe?:string[]
}) => (
  await api.patch("/users/profile",data)
).data;