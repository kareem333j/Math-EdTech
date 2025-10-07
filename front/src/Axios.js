import axios from 'axios';

export const domain = 'your-api-url';
export const baseURLMedia = `${domain}/media/`;
export const baseURLMediaTypeImage = `${domain}`;
export const baseURL = `${domain}/api`;

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 60000,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
    },
});

let isRefreshing = false;
let failedQueue = [];
let redirecting = false;

function processQueue(error, token = null) {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
}

function redirectToLogin() {
    if (!redirecting) {
        redirecting = true;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.dispatchEvent(new Event("tokenExpired")); //

        if(window.location.pathname !== '/login'){
            window.location.href = '/login';
        }
    }
}

axiosInstance.interceptors.request.use((config) => {
    const publicEndpoints = ['/grades'];
    const isPublic = publicEndpoints.some((endpoint) => config.url.startsWith(endpoint));

    if (!isPublic) {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = 'JWT ' + token;
        }
    }

    return config;
}, (error) => Promise.reject(error));

function isTokenExpired(token) {
    try {
        const tokenParts = JSON.parse(atob(token.split('.')[1]));
        const now = Math.ceil(Date.now() / 1000);
        return tokenParts.exp < now;
    } catch (e) {
        return true;
    }
}

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (!error.response) {
            return Promise.reject(error);
        }

        if (error.response.status === 401) {
            // لو طلب تسجيل الدخول نفسه
            if (originalRequest.url.includes('/login')) {
                return Promise.reject(error);
            }

            // لو فشل تجديد التوكين
            if (originalRequest.url === baseURL + '/token/refresh/') {
                processQueue(new Error("Session expired"), null);
                isRefreshing = false;
                redirectToLogin();
                return Promise.reject(error);
            }

            // لو فيه تحديث للتوكين شغال حالياً
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers['Authorization'] = 'JWT ' + token;
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            // بدء محاولة تجديد التوكين
            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken && !isTokenExpired(refreshToken)) {
                try {
                    const response = await axios.post(baseURL + '/token/refresh/', { refresh: refreshToken });
                    localStorage.setItem('access_token', response.data.access);
                    // مهم: ما تحفظش refresh جديد لو السيرفر مرجعهولكش
                    if (response.data.refresh) {
                        localStorage.setItem('refresh_token', response.data.refresh);
                    }
                    axiosInstance.defaults.headers['Authorization'] = 'JWT ' + response.data.access;
                    originalRequest.headers['Authorization'] = 'JWT ' + response.data.access;

                    processQueue(null, response.data.access);
                    isRefreshing = false;
                    return axiosInstance(originalRequest);
                } catch (err) {
                    processQueue(err, null);
                    isRefreshing = false;
                    redirectToLogin();
                }
            } else {
                processQueue(new Error("Session expired"), null);
                isRefreshing = false;
                redirectToLogin();
            }

            // لو مفيش refresh token أو access token
            if (!localStorage.getItem('access_token') || !localStorage.getItem('refresh_token')) {
                processQueue(new Error("Session expired"), null);
                isRefreshing = false;
                redirectToLogin();
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
