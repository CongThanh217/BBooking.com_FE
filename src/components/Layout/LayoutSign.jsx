import React from 'react'
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';

const LayoutSign = () => {
    const navigate = useNavigate();
    const Home = () => {
        navigate("/");
    }
    return (
        <div>
            <div className='over over__header'>
                <div className='container__set'>
                    <div className='flex-between header__top'>
                        <img src={require('../../assets/img/logoBooking.svg').default} alt="React Logo" className='logo' onClick={Home} />
                        <div className='flex gap-2' >
                            <div className='header__top--item center'>
                                <img src={require('../../assets/img/icon_ngon_ngu.png')} alt="img Viet Nam" className='imgVN' />
                            </div>
                            <div style={{fontSize: "24px"}} className='header__top--item center'> <FontAwesomeIcon icon={faCircleQuestion} /> </div>
                        </div>
                    </div>
                </div>
            </div>
            <Outlet />
            <div className='over mt-4 '>
                <div className="container__set" style={{marginTop : "120px"}}>
                    <div style={{textAlign: 'center', width: 360, margin: "10px auto", fontSize: 12, transform: 'scale(1.2)'}}>
                        <p>Qua việc đăng nhập hoặc tạo tài khoản, bạn đồng ý với các <span style={{color:'#006ce4', cursor: 'pointer'}}>Điều khoản và Điều kiện</span> cũng như <span style={{color:'#006ce4', cursor: 'pointer'}}>Chính sách An toàn và Bảo mật</span> của chúng tôi</p>
                        <p>Bảo lưu mọi quyền.</p>
                        <p>Bản quyền (2006 - 2024) - Booking.com™</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LayoutSign
