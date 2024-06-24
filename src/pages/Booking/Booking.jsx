import { Popover, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { getMyBooking, cancelBooking, getImageHotel,paypalApi } from '../../api/api';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarMinus, faCopy , faCreditCard} from '@fortawesome/free-regular-svg-icons';
import { faListUl , faWallet } from '@fortawesome/free-solid-svg-icons';
import 'moment/locale/vi'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { Spin } from 'antd'; // Import Spin for loading indicator
const BookingFinal = () => {
    moment.locale('vi'); 
    const [dataBooking, setDataBooking] = useState([]);
    const [listImgBooking, setListImgBooking] = useState([]);
    const [openPopover, setOpenPopover] = useState(null); // Trạng thái cho Popover mở
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOpenChange = (newOpen, itemId) => {
        setOpenPopover(newOpen ? itemId : null);
    };

    const handleCancelBooking = async (item) => {
        setOpenPopover(null);
        await cancelBooking({ bookingId: item?.id }).then(result => {
            if (result?.result === true) {
                message.success(result?.message || `Hủy phòng thành công`);
                apiGetMyBooking();
            } else {
                message.error(result?.message || `Hủy phòng thất bại`);
            }
        });
    };

    const createPayPal = async (id) =>{
        
        try {
            setLoading(true);
            const dataPaypal = {
                bookingId: id,
                urlSuccess: 'https://b-booking-com-fe.vercel.app/booking-success',
                urlCancel: 'https://b-booking-com-fe.vercel.app/booking-pending',
            };
    
            const resultPaypal =  await paypalApi(dataPaypal);
            setLoading(false);

            if (resultPaypal?.result === true) {
                window.location.href = resultPaypal?.data;
            } else {
                console.error('PayPal creation failed:', resultPaypal);
            }
            setLoading(false);

        } catch (error) {
            console.error('Error creating PayPal payment:', error);
        }
    }
    const handleCopy = () => {
        navigator.clipboard.writeText(selectedBooking.bookingCode)
            .then(() => {
                message.info("Đã copy");
            })
            .catch(() => {
                message.error("Không thể copy");
            });
    };
    const content = (item) => {
        return (
            <div style={{ width: 200 }} className='flex flex-col gap-2'>
                <div className='menu__threeDot' onClick={() => handleCancelBooking(item)}>Hủy phòng</div>
            </div>
        );
    };

    const apiGetMyBooking = async () => {
        try {
            setListImgBooking([]);
            const result = await getMyBooking();

            if (result?.result === true) {
                setDataBooking(result?.data?.content);
                const dataBooking = result?.data?.content;

                const imagePromises = dataBooking.map(async (item) => {
                    const imageResult = await getImageHotel(item?.hotelDtoAuto?.id);
                    if (imageResult?.result === true) {
                        return imageResult?.data?.[0]?.link;
                    }
                    return null;
                });

                const images = await Promise.all(imagePromises);
                const filteredImages = images.filter((image) => image !== null);
                setListImgBooking(filteredImages);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        apiGetMyBooking();
    }, []);

    const showBookingDetails = (item) => {
        setSelectedBooking(item);
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        setIsModalVisible(false);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div className='over'>
            <div className='container__set'>
                <p style={{ fontSize: 32, fontWeight: 700 }} className='mt-4'>Đặt chỗ & chuyến đi</p>
                <p style={{ color: '#006ce4', fontSize: 14, textAlign: 'right', fontWeight: 500, cursor: 'pointer' }}>Bạn không tìm thấy đặt phòng?</p>
                <div className='flex flex-col mt-4 gap-8'>
                    {
                        dataBooking?.map((item, index) => (
                            <div key={item.id} style={{ borderRadius: 8, padding: 20, boxShadow: '0 2px 8px 0 rgba(26,26,26,0.16)', cursor: 'pointer' }} onClick={() => showBookingDetails(item)}>
                                <div className='flex justify-between'>
                                    <div className='flex gap-4' >
                                        <img style={{ width: 70, height: 70, borderRadius: 8 }} src={listImgBooking?.[index]} alt='img hotel' />
                                        <div>

                                            <p className='font-bold'>{item?.hotelDtoAuto?.name}</p>
                                            <p className='text-sm'>{moment(item?.startDate, 'DD/MM/YYYY HH:mm:ss').format('DD [tháng] MM YYYY')} . {item?.hotelDtoAuto?.provinceInfo?.name} 
                                            </p>
                                            
                                            {(() => {
                                                if (item?.status === 2) {
                                                    return <p className='text-sm' style={{ color: '#b9af09', fontWeight : 500 }}>Đã hủy</p>;
                                                } else if (item?.status === 3) {
                                                    return <p className='text-sm' style={{ color: '#008234' , fontWeight : 500}}>Đã hoàn thành</p>;
                                                } else if (item?.status === 1) {
                                                    return <p className='text-sm' style={{ color: '#008234', fontWeight : 500 }}>Đã xác nhận</p>;
                                                } else if (item?.status === 5){
                                                    return <p className='text-sm' style={{ color: '#4f4c10', fontWeight : 500 }}>Vắng mặt</p>;
                                                }
                                            })()}
                                        </div>
                                    </div>
                                    <div className='flex gap-4'>
                                    <div style={{ width: '100%' }}>
                                    <p style={{ width: '100%', textAlign: 'right', fontWeight: 'bold', fontSize: '24px' }}>
    VND {item?.price?.toString().replace(/(?=(?!\b)(\d{3})+$)/g, ',')}
    {
        
            ((item?.paymentStatus === false && item?.paymentMethod === 1) ? (
                <p style={{ width: '100%', textAlign: 'right', color: '#ff0000', fontWeight: "500", fontSize: '14px' }}>
                  Chưa thanh toán PayPal
                </p> ) : null)
    }
  </p>
</div>

                                     
                                        {
                                            item?.status === 1 ?
                                                <Popover content={() => content(item)} trigger="click" placement='bottomRight' open={openPopover === item.id} onOpenChange={(newOpen) => handleOpenChange(newOpen, item.id)}>
                                                    <img src={require('../../assets/img/threeDot.svg').default} alt='three dot' style={{ width: '24px', height: '24px', cursor: 'pointer' }} onClick={(e) => e.stopPropagation()} />
                                                </Popover>
                                                :
                                                <img src={require('../../assets/img/threeDot.svg').default} alt='three dot' style={{ width: '24px', height: '24px', opacity: 0.3 }} onClick={(e) => e.stopPropagation()} />
                                        }
                                    </div>
                                </div>
                                <div className='flex items-center gap-4 mt-4' onClick={() => showBookingDetails(item)}>
                                    <img src={require('../../assets/img/dichuyen.svg').default} alt='di chuyen' style={{ width: '24px', height: '24px', cursor: 'pointer' }} />
                                    <p>Kiểm tra các phương tiện đến chỗ nghỉ này</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <p className='mt-8 text-3xl font-bold'>Tiếp theo ta lên kế hoạch gì đây?</p>
                <div className='mt-4 mb-8 gap-4 flex'>
                    <div style={{ borderRadius: 4, padding: 20, width: 280, boxShadow: '0 2px 8px 0 rgba(26,26,26,0.16)', cursor: 'pointer' }} className='inline-flex gap-4'>
                        <img src={require('../../assets/img/didau.svg').default} alt='di dau' style={{ width: '24px', height: '24px', cursor: 'pointer' }} />
                        <div>
                            <p className='font-medium'>Đi đâu làm gì</p>
                            <p className='text-sm'>Giá vé từ VND 120.000</p>
                        </div>
                    </div>
                    <div style={{ borderRadius: 4, padding: 20, width: 280, boxShadow: '0 2px 8px 0 rgba(26,26,26,0.16)', cursor: 'pointer' }} className='inline-flex gap-4'>
                        <img src={require('../../assets/img/thuexe.svg').default} alt='di dau' style={{ width: '24px', height: '24px', cursor: 'pointer' }} />
                        <div>
                            <p className='font-medium'>Thuê xe</p>
                            <p className='text-sm'>Nhận xe ở sân bay quốc tế Cam Ranh</p>
                        </div>
                    </div>
                    <div style={{ borderRadius: 4, padding: 20, width: 280, boxShadow: '0 2px 8px 0 rgba(26,26,26,0.16)', cursor: 'pointer' }} className='inline-flex gap-4'>
                        <img src={require('../../assets/img/dattaxi.svg').default} alt='di dau' style={{ width: '24px', height: '24px', cursor: 'pointer' }} />
                        <div>
                            <p className='font-medium'>Đặt taxi sân bay riêng</p>
                            <p className='text-sm'>Tài xế sẽ đợi để đưa bạn đến chỗ nghỉ</p>
                        </div>
                    </div>
                </div>
            </div>
            <Modal title="Thông tin đặt phòng" visible={isModalVisible} onOk={handleModalOk} onCancel={handleModalCancel} style={{width: "400px"}}>
                {selectedBooking && (
            //        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', width: '470px', backgroundColor: '#f9f9f9' }}>
            //        <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>Thông tin đặt phòng</p>
            //        <p style={{ fontSize: '14px', margin: '5px 0' }}><strong>Mã đặt phòng:</strong> {selectedBooking?.bookingCode}</p>
            //        <p style={{ fontSize: '14px', margin: '5px 0' }}><strong>Khách sạn:</strong> {selectedBooking.hotelDtoAuto?.name}</p>
            //        <p style={{ fontSize: '14px', margin: '5px 0' }}><strong>Địa chỉ:</strong> {selectedBooking.hotelDtoAuto?.address}</p>
            //        <p style={{ fontSize: '14px', margin: '5px 0' }}><strong>Ngày nhận phòng:</strong> {selectedBooking.startDate}</p>
            //        <p style={{ fontSize: '14px', margin: '5px 0' }}><strong>Ngày trả phòng:</strong> {selectedBooking.endDate}</p>
            //        <p style={{ fontSize: '14px', margin: '5px 0' }}><strong>Giá:</strong> VND {selectedBooking.price?.toString().replace(/(?=(?!\b)(\d{3})+$)/g, '.')}</p>
            //        <p style={{ fontSize: '14px', margin: '5px 0' }}><strong>Phương thức thanh toán:</strong> {selectedBooking?.paymentMethod === 0 ? "Trực tiếp" : "PayPal"}</p>
            //        <p style={{ fontSize: '14px', margin: '5px 0' }}><strong>Trạng thái thanh toán:</strong> {selectedBooking?.paymentStatus === false ? "Chưa thanh toán" : "Đã thanh toán" }</p>

            //        <p style={{ fontSize: '14px', margin: '5px 0' }}><strong>Trạng thái đặt phòng:</strong> {(() => {
            //            if (selectedBooking?.status === 4) {
            //                return 'Đã hủy';
            //            } else if (selectedBooking?.status === 3) {
            //                return 'Đã hoàn thành';
            //            } else if (selectedBooking?.status === 1) {
            //                return 'Đã xác nhận';
            //            } else {
            //                return 'Vắng mặt';
            //            }
            //        })()}</p>
            //    </div>
            <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', margin: 0, padding: 0, justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', maxWidth: '800px', width: '100%', padding: '20px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '60px' }}>
            <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 20px' }}>
                    {selectedBooking.hotelDtoAuto?.name} 
                    <span style={{ marginLeft : "9px", color: 'gold' }}>★★★</span> 
                    <span style={{marginLeft : "9px", backgroundColor: '#0066cc', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '14px' }}>Genius</span>
                </h1>
            </div>
            <div style={{ marginBottom: '20px', border: "#008234 1px solid", width: '250px', height: '50px', backgroundColor: "#f1fef6", padding: "15px 20px", display: 'flex', alignItems: 'center' }}>
                <p style={{ marginLeft : 10 }}>
                    <span style={{ fontWeight: 400, fontSize: '14px' }}>Mã xác nhận: </span>
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>{selectedBooking.bookingCode}</span>
                    <FontAwesomeIcon onClick={handleCopy} icon={faCopy} style={{ width: '16px', height: '16px', cursor: "pointer", marginLeft: '5px' }} />
                </p>
            </div>
        </div>

                <div style={{ display: 'flex', flexDirection: 'column', fontFamily : "BlinkMacSystemFont,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif" }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px', gap: "10px" }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <FontAwesomeIcon icon={faCalendarMinus} style={{ width: '24px', height: '24px', marginRight: '10px'}} />
                        <div style={{marginRight : "10px"}}>
                            <p  style={{ margin: 0 , fontSize : "14px", fontWeight: 400}}>Nhận phòng</p>
                            {
                               
                                <p style={{ margin: 0, fontWeight: 700, fontSize : "16px" }}>
                                {moment(selectedBooking.startDate, 'DD/MM/YYYY HH:mm:ss').format('ddd, D [tháng] M, YYYY') }
                            </p>
                            }
                            <p style={{ margin: 0, fontWeight: 400 }}>14:00 - 18:00</p>
                            <a href="#" style={{ color: '#0066cc', fontSize: '14px' }}>Thay đổi ngày tháng</a>
                        </div>
                    </div>
                    <div style={{width: "2px", height: "100px", background: "#e7e7e7"}}></div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
                        <div style={{marginLeft : "10px"}}>
                        <p  style={{ margin: 0 , fontSize : "14px", fontWeight: 400}}>Trả phòng</p>
                            {
                               
                                <p style={{ margin: 0, fontWeight: 700, fontSize : "16px" }}>
                                {moment(selectedBooking.endDate, 'DD/MM/YYYY HH:mm:ss').format('ddd, D [tháng] M, YYYY') }
                            </p>
                            }
                            <p style={{ margin: 0, fontWeight: 400 }}>14:00 - 18:00</p>
                        </div>
                    </div>
                    <img src={listImgBooking?.[1]} alt='img hotel' style={{ width: 250, height: 180 , borderRadius: "6px"} } />
                    </div>
                 
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', marginTop: '15px' }}>
            <FontAwesomeIcon icon={faListUl} style={{ width: '24px', height: '24px', marginRight: '10px', transform: "translateY(-5px)"}} />
            <div>
                <p style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>Chi tiết đặt phòng</p>
                <p style={{ fontSize: '14px', fontWeight: 400, margin: 0 }}>2 người lớn - {selectedBooking?.listBookingDetail[0]?.roomNumber} phòng</p>
            </div>
         
        </div>
        
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <FontAwesomeIcon icon={faLocationDot}style={{ width: '24px', height: '24px', marginRight: '10px', transform: "translateY(-1px)"}} />
                        <div>
                            <p style={{ margin: 0 , fontSize: '14px', fontWeight: 700}}>Địa chỉ</p>
                            <p style={{ margin: 0, fontSize: '14px', fontWeight: 400 }}>{selectedBooking?.hotelDtoAuto?.address}</p>
                            <a href="#" style={{ color: '#0066cc', fontSize: '14px', marginRight: '10px' }}>Hiển thị đường đi</a>
                            <a href="#" style={{ color: '#0066cc', fontSize: '14px' }}>Kiểm tra các phương án đi lại</a>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: "20px" }}>
                    <FontAwesomeIcon icon={faCreditCard}style={{ width: '24px', height: '24px', marginRight: '10px', transform: "translateY(-1px)"}} />
                        <div>
                            <p style={{ margin: 0 , fontSize: '14px', fontWeight: 700}}>Phương thức thanh toán</p>
                            <p style={{ margin: 0, fontSize: '14px', fontWeight: 400 }}>{selectedBooking?.paymentMethod === 0 ? "Trực tiếp" : "PayPal"}</p>
                            
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: "20px" }}>
                    <FontAwesomeIcon icon={faWallet}style={{ width: '24px', height: '24px', marginRight: '10px', transform: "translateY(-1px)"}} />
                        <div>
                            <p style={{ margin: 0 , fontSize: '14px', fontWeight: 700}}>Trạng thái thanh toán</p>
                            <p style={{ margin: 0, fontSize: '14px', fontWeight: 400 }}>
                {selectedBooking?.paymentStatus === false ? "Chưa thanh toán" : "Đã thanh toán"}
                
                {
                     (selectedBooking?.paymentStatus === false && selectedBooking?.status === 1 && selectedBooking?.paymentMethod == 1)  ?
                        (loading ? <Spin size="small" /> :   <span onClick={() => { createPayPal(selectedBooking?.id) }} style={{ color: "#0066cc", cursor: "pointer" }}> - Nhấn vào đây để thanh toán</span>) :null}

  </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
               
                )}
            </Modal>
        </div>
    );
};

export default BookingFinal;
