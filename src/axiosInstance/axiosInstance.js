import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const excludePatterns = process.env.EXCLUDE_PATTERNS ? process.env.EXCLUDE_PATTERNS.split(',').map(pattern => new RegExp(pattern)) : [];

const shouldExclude = (url) => {
    return excludePatterns.some(pattern => pattern.test(url));
};


const createAxiosInstance = (baseURL) => {
    const axiosInstance = axios.create({
        baseURL: baseURL,
    });

    axiosInstance.interceptors.request.use(request => {
        if (!shouldExclude(request.url)) {
            console.log('Request:', request);
        }
        return request;
    }, error => {
        return Promise.reject(error);
    });

    axiosInstance.interceptors.response.use(response => {
        if (!shouldExclude(response.config.url)) {
            console.log('Response:', response);
        }
        return response;
    }, error => {
        if (error.config && !shouldExclude(error.config.url)) {
            console.log('Response Error:', error);
        }
        return Promise.reject(error);
    });

    return axiosInstance;
};

export default createAxiosInstance;
