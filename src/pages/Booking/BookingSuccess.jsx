import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom'; // Ensure you are using react-router-dom v5 or below
import {useEffect} from 'react';
import {paypalSuccess, paypalPending } from '../../api/api';

const BookingSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const bookingId = params.get('bookingId');
        const paymentId = params.get('paymentId');
        const PayerID = params.get('PayerID');

        if (paymentId  && PayerID && bookingId) {
            callSuccessApi(bookingId, paymentId, PayerID);
        }
      
    }, [location]);

    const callSuccessApi = async (bookingId, paymentId, PayerID) => {
        try {
            const resultPaypal =  await paypalSuccess({bookingId, paymentId, PayerID});
    
          

        
        } catch (error) {
            console.error('Error calling API:', error);
        }
    };
    
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

    return (
        <div className="over">
            <div className="container__set" style={{ textAlign: 'center', marginTop: '25px' , marginBottom : "100px"}}>
            <FontAwesomeIcon style={{fontSize : "100px", color : "#003b95", marginBottom: "20px"}} icon={faCheck} bounce/>
                <h1 className="text-2xl font-bold">Đặt phòng thành công!</h1>
                <p className="mt-4">Cảm ơn bạn đã đặt phòng. Chúng tôi sẽ liên hệ với bạn sớm nhất.</p>
                <button className="mt-8 btn-primary" onClick={goToHome} style={{color : "#003b95"}}>
                    Quay lại trang chủ
                </button>
            </div>
        </div>
    );
};

export default BookingSuccess;
