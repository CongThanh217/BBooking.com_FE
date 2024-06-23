import React, { useEffect, useState } from 'react'
import LogoBooking from '../../assets/img/logoBooking.svg'
import ImgVN from '../../assets/img/icon_ngon_ngu.png'
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import { infoUser } from '../../api/api';
import { Avatar, Popover } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const Header = () => {
    const navigate = useNavigate();
    const [dataUser, setDataUser] = useState('')
    const [open, setOpen] = useState(false);

    const SignIn = () => {
        navigate("/login");
    }

    const SignUpHotel = () => {
        navigate("/signup", { state: { kindID: 2 } });
    }

    const SignUp = () => {
        navigate("/signup", { state: { kindID: 3 } });
    }

    const Home = () => {
        navigate("/");
    }

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };

    const selectMenu = (status) => {
        setOpen(false)
        switch (status) {
            case 1:
                console.log('quan ly tai khoan');
                break;
            case 2:
                navigate("/booking");
                break;
            case 3:
                navigate("/");
                Cookies.remove('dataLogin')
                window.location.reload();
                break;
            default:
                break;
        }
    }

    const content = (
        <div style={{ width: '230px', flexDirection: 'column' }} className='flex gap-4'>
            <div className='flex gap-4' style={{ cursor: 'pointer' }} onClick={() => selectMenu(1)}>
                <img src={require('../../assets/img/quanlytaikhoan.svg').default} style={{ width: 16, height: 16, objectFit: 'contain' }} alt='quanly' />
                <p>Quản lý tài khoản</p>
            </div>
            <div className='flex gap-4' style={{ cursor: 'pointer' }} onClick={() => selectMenu(2)}>
                <img src={require('../../assets/img/datchochuyendi.svg').default} style={{ width: 16, height: 16, objectFit: 'contain' }} alt='datcho' />
                <p>Đặt chỗ & Chuyến đi</p>
            </div>
            <div className='flex gap-4' style={{ cursor: 'pointer' }} onClick={() => selectMenu(3)}>
                <img src={require('../../assets/img/logout.svg').default} style={{ width: 16, height: 16, objectFit: 'contain' }} alt='logout' />
                <p>Đăng xuất</p>
            </div>
        </div>
    );

    useEffect(() => {
        if (Cookies.get('dataLogin')) {
            var dataLogin = JSON.parse(Cookies.get('dataLogin'))
            const getInfoUser = async () => {
                var result = await infoUser(dataLogin?.access_token)
                if (result?.result === true) {
                    Cookies.set('infoUser', JSON.stringify(result?.data))
                    setDataUser(result?.data)
                }
            }
            getInfoUser()
        }
    }, [])

    return (
        <div className='over over__header'>
            <div className='container__set'>
                <div className='flex-between header__top'>
                    <img src={LogoBooking} alt="React Logo" className='logo' onClick={Home} />
                    <div className='flex gap-2' >
                        <p className='header__top--item' >VND</p>
                        <div className='header__top--item center'>
                            <img src={ImgVN} alt="img Viet Nam" className='imgVN' />
                        </div>
                        {/* <p className='header__top--item' >icon</p> */}
                        <p className='header__top--item' onClick={SignUpHotel} >Đăng chỗ nghỉ của quý vị</p>
                        {
                            dataUser ?
                                <Popover content={content} trigger="click" open={open} onOpenChange={handleOpenChange}>
                                    <div className='flex gap-4 items-center' style={{ cursor: 'pointer' }}>
                                        <Avatar shape="square" size={40} icon={<UserOutlined />} />
                                        <div>
                                            <p style={{ color: '#FFF', fontWeight: 500 }}>{dataUser?.account?.username}</p>
                                            <p style={{ color: '#febb02', fontSize: 12 }}>Genius cấp 1</p>
                                        </div>
                                    </div>
                                </Popover>
                                :
                                <div className='flex gap-4'>
                                    <div className='header__top--button' onClick={SignUp} >
                                        Đăng ký
                                    </div>
                                    <div className='header__top--button' onClick={SignIn} >
                                        Đăng nhập
                                    </div>
                                </div>
                        }
                    </div>
                </div>
                <div className='header__menu'>
                    <div className='header__menu--item'>
                        <img src={require('../../assets/img/iconLuuTruWhite.svg').default} alt="icon luu tru" className='header__menu--icon' />
                        <p>Lưu trú</p>
                    </div>
                    <div className='header__menu--item'>
                        <img src={require('../../assets/img/iconChuyenBay.svg').default} alt="icon luu tru" className='header__menu--icon' />
                        <p>Chuyến bay</p>
                    </div>
                    <div className='header__menu--item'>
                        <img src={require('../../assets/img/iconChuyenBayVaKhachSan.svg').default} alt="icon luu tru" className='header__menu--icon' />
                        <p>Chuyến bay + Khách sạn</p>
                    </div>
                    <div className='header__menu--item'>
                        <img src={require('../../assets/img/iconThueXe.svg').default} alt="icon luu tru" className='header__menu--icon' />
                        <p>Thuê xe</p>
                    </div>
                    <div className='header__menu--item'>
                        <img src={require('../../assets/img/iconDiaDiemVaThamQuan.svg').default} alt="icon luu tru" className='header__menu--icon' />
                        <p>Địa điểm tham quan</p>
                    </div>
                    <div className='header__menu--item'>
                        <img src={require('../../assets/img/iconTaxiSanBay.svg').default} alt="icon luu tru" className='header__menu--icon' />
                        <p>Taxi sân bay</p>
                    </div>
                </div>
                <div className='header__des'>
                    <p className='header__des--title'>Tìm chỗ nghỉ tiếp theo</p>
                    <p className='header__des--content'>Tìm ưu đãi khách sạn, chỗ nghỉ dạng nhà và nhiều hơn nữa...</p>
                </div>
            </div>
        </div>
    )
}

export default Header