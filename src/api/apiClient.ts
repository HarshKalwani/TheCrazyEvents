import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const API_BASE_URL = "http://localhost:3000/api/v1";
export const api = axios.create({
    baseURL:API_BASE_URL,
    headers:{
        "Content-Type":"application/json"
    }
})

let authInterceptor:number| null = null;
export function setAuthToken(token:string | null){
    if(authInterceptor !== null){
        api.interceptors.request.eject(authInterceptor);
    };
    if(token){
        authInterceptor = api.interceptors.request.use((config) => {
            config.headers.Authorization = `Bearer ${token}`;
            return config;
        });
    }else{
        authInterceptor = null;
    }
}

let isRefreshing  = false;
let refreshSubscribers:((token:string)=> void)[] = [];

const onRefreshed = (token:string)=>{
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
}

api.interceptors.response.use(
    (response) => response,
    async(error) => {
        const originalRequest = error?.config
        if(error?.response?.status === 401 && originalRequest.url !== `${API_BASE_URL}/auth/refresh` && !originalRequest._retry){
            originalRequest._retry = true;
            if(!isRefreshing){
                isRefreshing = true;
                try {
                    const refreshToken = useAuthStore.getState().refreshToken;
                    if(!refreshToken){
                        throw new Error("No refresh token available");
                    }
                    const {accessToken} = (await api.post("/auth/refresh",{refreshToken})).data;
                    useAuthStore.getState().setAccessToken(accessToken);
                    setAuthToken(accessToken);
                    onRefreshed(accessToken);
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    useAuthStore.getState().logout();
                    return Promise.reject(refreshError);
                }finally{
                    isRefreshing = false;
                }
            }
        }
    }
)