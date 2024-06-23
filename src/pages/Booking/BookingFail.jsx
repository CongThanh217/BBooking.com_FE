import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom'; // Ensure you are using react-router-dom v5 or below
import {useEffect} from 'react';
import { paypalPending } from '../../api/api';

const BookingPending = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const bookingId = params.get('bookingId');
 

        if (bookingId) {
     
            callPendingApi(bookingId);
        }
    }, [location]);

    
    
    const callPendingApi = async (bookingId) => {
        try {
            const resultPaypal =  await paypalPending({bookingId});
    
          

        
        } catch (error) {
            console.error('Error calling API:', error);
        }
    };
    const goToHome = () => {
        navigate('/');
    };


    
    const goBooking = () => {
        navigate('/booking');
    };

    return (
        <div className="over">
            <div className="container__set" style={{ textAlign: 'center', marginTop: '25px' , marginBottom : "100px"}}>
            <FontAwesomeIcon style={{fontSize : "100px", color : "#003b95", marginBottom: "20px"}} icon={faClockRotateLeft} spin spinReverse/>
                <h1 className="text-2xl font-bold">Đặt phòng của bạn đang bị hoãn!</h1>
                <p className="mt-4">Vui lòng hoàn tất thanh toán trong vòng 2 giờ kể từ khi đặt phòng để hoàn tất quá trình đặt phòng</p>
                <p className="mt-4">Truy cập vào trang <a style={{color : "#003b95", cursor : "pointer"}} onClick={()=>{goBooking()}}>quản lý đặt phòng</a> để thanh toán. Đặt phòng của bạn sẽ bị hủy sau 2 giờ.</p>

                <button className="mt-8 btn-primary" onClick={goToHome} style={{color : "#003b95"}}>
                    Quay lại trang chủ
                </button>
            </div>
        </div>
    );
};

export default BookingPending;
