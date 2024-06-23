import { AreaChartOutlined, CalendarOutlined, FolderOpenOutlined, HomeOutlined, ProfileOutlined, UserOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { Avatar, Popover } from 'antd';
import Cookies from 'js-cookie'
import { infoUser } from '../../api/api';



const LayoutAdmin = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [dataUser, setDataUser] = useState('')

    const Home = () => {
        navigate("/");
    }

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };

    const selectMenu = () => {
        setOpen(false)
        navigate("/");
        Cookies.remove('dataLogin')
        window.location.reload();
    }

    const content = (
        <div style={{ width: '120px', flexDirection: 'column' }} className='flex gap-4'>
            <div className='flex gap-4 items-center' style={{ cursor: 'pointer' }} onClick={() => selectMenu()}>
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
        <div>
            <div className='over over__header'>
                <div className='container__set'>
                    <div className='flex-between header__top'>
                        <img src={require('../../assets/img/logoBooking.svg').default} alt="React Logo" className='logo' onClick={Home} />
                        <div className='flex gap-2' >
                            <div className='header__top--item center'>
                                <img src={require('../../assets/img/icon_ngon_ngu.png')} alt="img Viet Nam" className='imgVN' />
                            </div>
                            <div className='header__top--item center'>
                                <FontAwesomeIcon icon={faCircleQuestion} />
                            </div>
                            <Popover content={content} trigger="click" open={open} onOpenChange={handleOpenChange}>
                                <div className='flex gap-4 items-center' style={{ cursor: 'pointer' }}>
                                    <Avatar shape="square" size={40} icon={<UserOutlined />} />
                                    <div>
                                        <p style={{ color: '#FFF', fontWeight: 500 }}>{dataUser?.account?.username}</p>
                                        <p style={{ color: '#febb02', fontSize: 12 }}>Genius cấp 1</p>
                                    </div>
                                </div>
                            </Popover>
                        </div>
                    </div>
                    <div className='flex' style={{ justifyContent: 'center' }}>
                        <div className='flex gap-16 mb-4' style={{ color: '#FFF' }}>
                            <div onClick={() => navigate("/admin")} className='flex gap-2' style={{ flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                                <HomeOutlined style={{ fontSize: '20px' }} />
                                <p>Khách sạn</p>
                            </div>
                            <div onClick={() => navigate("/detail-hotel")} className='flex gap-2' style={{ flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                                <FolderOpenOutlined style={{ fontSize: '20px' }} />
                                <p>Danh sách phòng</p>
                            </div>
                            <div onClick={() => navigate("/list-booking")} className='flex gap-2' style={{ flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                                <ProfileOutlined style={{ fontSize: '20px' }} />
                                <p>Danh sách đặt phòng</p>
                            </div>
                            <div onClick={() => navigate("/calendar")} className='flex gap-2' style={{ flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                                <CalendarOutlined style={{ fontSize: '20px' }} />
                                <p>Lịch</p>
                            </div>
                            <div onClick={() => navigate("/sales-report")} className='flex gap-2' style={{ flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                                <AreaChartOutlined style={{ fontSize: '20px' }} />
                                <p>Báo cáo doanh thu</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Outlet />
            <div className='over' style={{ backgroundColor: '#003b95', color: '#FFF' }}>
                <div className="container__set" style={{ fontSize: 14, padding: '30px 0 0 0' }}>
                    <div className='flex' style={{ justifyContent: 'space-between' }}>
                        <div className='flex gap-4'>
                            <p>Giới thiệu về chúng tôi</p>
                            <p>Chính sách bảo mật và Cookie</p>
                            <p>Các câu hỏi thường gặp</p>
                        </div>
                        <div className='flex gap-4'>
                            <button className='button__admin'>Thêm chỗ nghỉ mới</button>
                            <button className='button__admin'>Chia sẻ góp ý của quý vị</button>
                        </div>
                    </div>
                    <div style={{ padding: '50px 0 20px 0' }}>
                        Bản quyền <span style={{ color: '#3b85f7' }}>Booking.com</span> 2024
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LayoutAdmin
