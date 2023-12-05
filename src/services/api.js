import axios from "axios"

const apiClient = axios.create({
    baseURL: "http://localhost:8002/",
    headers: {
        "Content-Type": "application/json"
    }
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token){
            config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
        }
        return config;
    }
);

export async function loginApi(data){
   
        const res = await apiClient.post(`login`, data, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        return res;
}

export async function registrationApi(data){
    const res = await apiClient.post(`user/create`, data);
    return res;
}

export async function uploadFileApi(data, params){
    const res = await apiClient.post(`datafile/upload`, data, {
    headers: {
        'Content-Type': 'multipart/form-data'    
    },
    params: params
    });
    return res;
}

export async function myDatafilesApi(){
    const res = await apiClient.get(`datafile/my`);
    return res;
}

export async function getFileApi(file_id){
    const res = await apiClient.get(`datafile/filestream/${file_id}`);
    return res;
}

export async function getMeApi(){
    const res = await apiClient('user/me');
    return res;
}