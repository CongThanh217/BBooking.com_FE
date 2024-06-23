import axios from 'axios';
import Cookies from 'js-cookie'

// const token = () => {
//     if (Cookies.get('dataLogin')) {
//         var dataLogin = JSON.parse(Cookies.get('dataLogin'))
//         return dataLogin?.access_token
//     }
// }

const token = () => {
    const dataLogin = Cookies.get('dataLogin');
    if (dataLogin) {
        const parsedData = JSON.parse(dataLogin);
        return parsedData?.access_token;
    }
    return null;
}

const apiUser = axios.create({
    baseURL: 'https://shoee.click',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Sử dụng interceptor để thêm token vào mỗi request
apiUser.interceptors.request.use(
    (config) => {
        const accessToken = token();
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// const apiUser = axios.create({
//     baseURL: 'https://shoee.click',
//     headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token()}`
//     },
// });

const apiClient = axios.create({
    baseURL: 'https://shoee.click',
    headers: {
        'Content-Type': 'application/json',
    },
});

const apiClientLogin = axios.create({
    baseURL: 'https://shoee.click',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic YWJjX2NsaWVudDphYmMxMjM=`
    },
});

export const countHotel = async () => {
    try {
        const response = await apiClient.get('/v1/hotel/count-hotel');
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const signup = async (data) => {
    try {
        const response = await apiClient.post('/v1/user/signup', data);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const confirmOtp = async (data) => {
    try {
        const response = await apiClient.post('/v1/user/confirm_otp', data);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const login = async (data) => {
    try {
        const response = await apiClientLogin.post('/api/token', data);
        return response;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const recalOTP = async (data) => {
    try {
        const response = await apiClient.post('/v1/account/request-send-mail', data);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const paypalApi = async (data) => {
    try {
        const response = await apiClient.post('/v1/transaction/create', data);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const paypalSuccess = async (data) => {
    try {
        const response = await apiClient.get('/v1/transaction/deposit/success', { params: data });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const paypalPending = async (data) => {
    try {
        const response = await apiClient.get('/v1/transaction/deposit/cancel', { params: data });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};
export const listNation = async (data) => {
    try {
        const response = await apiClient.get(`/v1/nation/auto-complete`, { params: data });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const infoUser = async (token) => {
    try {
        const response = await apiClient.get(`/v1/user/get-myprofile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const filterHotel = async (query) => {
    try {
        const response = await apiClient.get(`/v1/hotel/filter-hotel`, { params: query });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const getMyBooking = async () => {
    try {
        const response = await apiUser.get('/v1/booking/get-my-booking');
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const getDetailHotel = async (id) => {
    try {
        const response = await apiClient.get(`/v1/hotel/get/${id}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const getImageHotel = async (id) => {
    try {
        const response = await apiClient.get(`/v1/image-of-room/get-by-hotel`, { params: { hotelId: id } });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const getEmptyRoom = async (query) => {
    try {
        const response = await apiClient.get(`/v1/kind-of-room/get-emptyRoom`, { params: query });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const getServiceRoom = async (query) => {
    try {
        const response = await apiClient.get(`/v1/service/get-by-kindId`, { params: query });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const getServiceHotel = async (query) => {
    try {
        const response = await apiClient.get(`/v1/service/get-by-HotelId`, { params: query });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const createBookingUser = async (data) => {
    try {
        const response = await apiUser.post('/v1/booking/create-for-user', data);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const createBookingGuest = async (data) => {
    try {
        const response = await apiUser.post('/v1/booking/create-for-guest', data);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};


export const createHotel = async (data) => {
    try {
        const response = await apiUser.post('/v1/hotel/create', data);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const getRoomByHotel = async () => {
    try {
        const response = await apiUser.get(`/v1/kind-of-room/list-by-hotel`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const createServiceHotel = async (data) => {
    try {
        const response = await apiUser.post('/v1/service/create-for-hotel', data);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const getBookingHotel = async () => {
    try {
        const response = await apiUser.get(`/v1/booking/get-for-hotel`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const updateStatusBooking = async (query) => {
    try {
        const response = await apiUser.post('/v1/booking/update-absent', null, { params: query });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const createKindRoom = async (data) => {
    try {
        const response = await apiUser.post('/v1/kind-of-room/create', data);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const updateKindRoom = async (data) => {
    try {
        const response = await apiUser.put('/v1/kind-of-room/update', data);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const getEmptyRoomID = async (id) => {
    try {
        const response = await apiClient.get(`/v1/empty-room/list?kindId=${id}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const updateEmptyRoom = async (data) => {
    try {
        const response = await apiUser.put('/v1/empty-room/update', data);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const createEmptyRoom = async (data) => {
    try {
        const response = await apiUser.post('/v1/empty-room/create', data);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const cancelBooking = async (query) => {
    try {
        const response = await apiUser.put('/v1/booking/cancel-booking', null, { params: query });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const getImageByKind = async (id) => {
    try {
        const response = await apiUser.get(`/v1/image-of-room/get-by-kind?id=${id}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const getMyHotel = async () => {
    try {
        const response = await apiUser.get(`/v1/hotel/my-hotel`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const updateHotel = async (data) => {
    try {
        const response = await apiUser.put('/v1/hotel/update', data);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const updateService = async (data) => {
    try {
        const response = await apiUser.post('/v1/service/update', data);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const getStatiticBooking = async (query) => {
    try {
        const response = await apiUser.get('/v1/statistical/statitics-booking', { params: query });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const getStatisticalMonth = async (query) => {
    try {
        const response = await apiUser.get('/v1/statistical/get-revenue-month', { params: query });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};

export const createServiceRoom = async (data) => {
    try {
        const response = await apiUser.post('/v1/service/create', data);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi api', error);
    }
};