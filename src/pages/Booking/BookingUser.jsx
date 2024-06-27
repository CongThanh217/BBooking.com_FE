import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Form, Input, Select, message } from 'antd';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { infoUser, createBookingUser, createBookingGuest, paypalApi } from '../../api/api';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { faWallet, faHouse, faCreditCard, faCircleInfo, faCircleUser, faTags, faCarSide, faSquareParking, faWifi, faCircleCheck, faUserTie } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
dayjs.locale('zh-cn');
dayjs.extend(customParseFormat);

const BookingUser = () => {
    const [form] = Form.useForm();

    const navigate = useNavigate();
    const location = useLocation();
    const { dataRoomChoise, dataHotel } = location.state || {};
    const [messageApi, contextHolder] = message.useMessage();
    const [dataUser, setDataUser] = useState({});
    const [loading, setLoading] = useState(false);

    const [dataBooking, setDataBooking] = useState({
        checkIn: dataRoomChoise?.roomDtoList?.[0]?.startDate,
        email: dataUser?.account?.email,
        endDate: dataRoomChoise?.roomDtoList?.[0]?.endDate,
        gender: 0,
        hotelId: dataHotel?.id,
        kindToBookingList: [
            {
                emptyRoomId: dataRoomChoise?.roomDtoList?.[0]?.emptyRoomId,
                kindOfRoomId: dataRoomChoise?.id,
                quantity: dataRoomChoise?.room
            }
        ],
        name: dataUser?.account?.fullName,
        paymentMethod: 0,
        phone: dataUser?.account?.phone,
        startDate: dataRoomChoise?.roomDtoList?.[0]?.startDate
    });

    const changeCheckin = (value) => {
        var dataTemp = { ...dataBooking };
        dataTemp.checkIn = dayjs(dataTemp.checkIn, 'DD/MM/YYYY').format(`DD/MM/YYYY ${value}:00`);
        setDataBooking(dataTemp);
    };

    const SignIn = () => {
        navigate('/login');
    };

    const SignUpHotel = () => {
        navigate('/signup', { state: { kindID: 2 } });
    };

    useEffect(() => {
        form.setFieldsValue(dataBooking);
    }, [dataBooking, form]);

    const createBooking = async () => {
        try {
            // Wait for form validation
            await form.validateFields();

            // If validation passes, proceed with booking creation
            setLoading(true);

            let result = false;
            if (dataUser?.account) {
                if (dataBooking?.paymentMethod === 1) {
                    result = await createBookingUser(dataBooking);
                    if (result?.result === true && result?.data) {
                        var dataPaypal = {
                            bookingId: result?.data,
                            urlSuccess: 'https://b-booking-com-fe.vercel.app/booking-success',
                            urlCancel: 'https://b-booking-com-fe.vercel.app/booking-pending',
                        };
                        var resultPaypal = await paypalApi(dataPaypal);
                        if (resultPaypal?.result === true) {
                            window.location.href = resultPaypal?.data;
                        }
                    }
                } else {
                    result = await createBookingUser(dataBooking);
                }
            } else {
                result = await createBookingGuest(dataBooking);
            }

            setLoading(false);

            if (result?.result === true) {
                if (dataBooking?.paymentMethod !== 1) {
                    messageApi.open({
                        type: 'success',
                        content: 'Tạo phòng thành công',
                    });
                    navigate('/booking-success');
                }
            } else {
                messageApi.open({
                    type: 'error',
                    content: 'Tạo phòng thất bại',
                });
            }
        } catch (errorInfo) {
            console.log('Validation failed:', errorInfo);
        }
    };

    const layout = {
        labelCol: {
            span: 24,
        },
        wrapperCol: {
            span: 24,
        },
    };

    const onFinish = (values) => {
        console.log(values);
    };

    const validateMessages = {
        required: '${label} bắt buộc phải nhập!',
        types: {
            email: '${label} không hợp lệ!',
        },
    };

    useEffect(() => {
        if (Cookies.get('dataLogin')) {
            var dataLogin = JSON.parse(Cookies.get('dataLogin'));
            const getInfoUser = async () => {
                var result = await infoUser(dataLogin?.access_token);
                if (result?.result === true) {
                    Cookies.set('infoUser', JSON.stringify(result?.data));
                    setDataUser(result?.data);
                }
            };
            getInfoUser();
        }
    }, []);

    const handlePaymentMethodChange = (value) => {
    
        if (value === 1 && !dataUser?.account?.email) {
            console.log('Vui lòng đăng nhập để sử dụng phương thức thanh toán này')
            message.warning('Vui lòng đăng nhập để sử dụng phương thức thanh toán này');
            setDataBooking((prevDataBooking) => ({ ...prevDataBooking, paymentMethod: 0 }));
            form.setFieldsValue({ paymentMethod: 0 });
        } else {
            setDataBooking((prevDataBooking) => ({ ...prevDataBooking, paymentMethod: value }));
        }
    };

    const paymentOptions = [
        { value: 0, label: 'Trực tiếp' },
        { value: 1, label: 'PAYPAL' },
    ];

    useEffect(() => {
        setDataBooking({
            ...dataBooking,
            email: dataUser?.account?.email,
            name: dataUser?.account?.fullName,
            phone: dataUser?.account?.phone,
        });
    }, [dataUser]);

    return (
        <div className="over">
            {contextHolder}
            {dataUser ? (
                <div className="container__set">
                    <div className='flex gap-4 mt-4 mb-8'>
                        <div style={{ width: 350 }}>
                            <div className='p-4 border-inherit rounded-lg border'>
                                <div className='flex items-center gap-4'>
                                    <p className='text-sm'>Khách sạn</p>
                                    <div>
                                        <img src={require('../../assets/img/start.svg').default} style={{ width: 12, height: 12 }} alt='star' />
                                    </div>
                                </div>
                                <p style={{ fontSize: 20, fontWeight: 700 }}>{dataHotel?.name}</p>
                                <p style={{ fontSize: 14, marginTop: 5 }}>{dataHotel?.address}</p>
                                <div className='flex items-center gap-4 mt-2'>
                                    <p style={{ fontSize: 12 }}><FontAwesomeIcon style={{ padding: "2px", color: "green" }} icon={faWifi} />Wifi miễn phí</p>
                                    <p style={{ fontSize: 12 }}><FontAwesomeIcon style={{ padding: "2px", color: "green" }} icon={faCarSide} />Xe đưa đón sân bay</p>
                                    <p style={{ fontSize: 12 }}><FontAwesomeIcon style={{ padding: "2px", color: "green" }} icon={faSquareParking} />Chỗ đỗ xe</p>
                                </div>
                            </div>
                            <div className='p-4 border-inherit rounded-lg border mt-4'>
                                <p className='text-base font-bold'>Chi tiết đặt phòng của bạn</p>
                                <div className='flex justify-between gap-2 mt-4'>
                                    <div className='w-1/2'>
                                        <p style={{ fontSize: "14px" }}>Nhận phòng</p>
                                        <p className='text-base font-bold'>{moment(dataRoomChoise?.roomDtoList?.[0]?.startDate, 'DD/MM/YYYY HH:mm:ss').format('DD [tháng] MM YYYY')}</p>
                                        <p style={{ fontSize: "14px", color: "#595959", marginTop: "4px" }}>Từ 14:00</p>
                                    </div>
                                    <div className="separator" style={{ width: "2px", height: "70px", background: "#e7e7e7" }}></div>
                                    <div className='w-1/2'>
                                        <p style={{ fontSize: "14px" }}>Trả phòng</p>
                                        <p className='text-base font-bold'>{moment(moment(dataRoomChoise?.roomDtoList?.slice(-1)[0]?.endDate, 'DD/MM/YYYY HH:mm:ss')).format('DD [tháng] MM YYYY')}</p>
                                        <p style={{ fontSize: "14px", color: "#595959", marginTop: "4px" }}>Cho đến 12:00</p>
                                    </div>
                                </div>
                                <div className='mt-4'>
                                    <p style={{ fontSize: "14px" }}>Tổng thời gian lưu trú:</p>
                                    <p className='text-base font-bold'>1 đêm</p>
                                </div>
                                <div className="separator" style={{ width: "320px", height: "2px", background: "#e7e7e7", marginTop: "20px" }}></div>
                                <div className='mt-4'>
                                    <p style={{ fontSize: "14px", fontWeight: 450 }}>Bạn đã chọn</p>
                                    <p style={{ fontSize: "16px", fontWeight: 700 }} className='text-base font-bold'>{dataRoomChoise?.room} phòng cho {dataRoomChoise?.numberOfPeople} người lớn</p>
                                    <p style={{ fontSize: "14px", fontWeight: "500" }} className='text-sm font-medium mt-2'>{dataRoomChoise?.room} x {dataRoomChoise?.name}</p>
                                    <p className='text-sm font-medium' style={{ fontSize: "14px", fontWeight: "400" }}>2 người lớn</p>
                                </div>
                            </div>
                            <div className='p-4 border-inherit rounded-lg border mt-4'>
                                <p className='text-base font-bold'>Tóm tắt giá</p>
                                <div className=' justify-between flex ' style={{ backgroundColor: '#ebf3ff', padding: '20px 16px 30px', margin: '16px -16px 0' }}>
                                    <div>
                                        <p className='text-2xl font-bold'>Tổng</p>
                                        <p className='text-2xl font-bold'>cộng</p>
                                    </div>
                                    <div style={{ marginTop: '9px' }}>
                                    <p
    style={{
        fontSize: '24px',
        marginLeft: '59px',
        width: 'calc(100% - 59px)',
        textAlign: 'right',
        fontWeight: 'bold',
    }}
    className="text-2xl font-bold"
>
    VND {(
        Number(dataRoomChoise?.room) *
        dataRoomChoise?.roomDtoList?.reduce((total, room) => total + room.price, 0)
    )
        .toString()
        .replace(/(?=(?!\b)(\d{3})+$)/g, '.')}
</p>
                                        <p
                                            style={{
                                                color: '#595959',
                                                fontSize: '14px',
                                                marginLeft: '75px',
                                                marginTop: '2px',
                                                width: 'calc(100% - 75px)',
                                                textAlign: 'right',
                                            }}
                                        >
                                            Đã bao gồm thuế và phí
                                        </p>
                                    </div>
                                </div>
                                <div className='mt-4'>
                                    <p className='text-base font-bold'>Thông tin giá</p>
                                    <div className='mt-2 gap-4 flex justify-between '>
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <FontAwesomeIcon style={{ transform: "translateY(8px)" }} icon={faWallet} />
                                            <div style={{ flexGrow: 1, marginLeft: "2px" }}>
                                                <p style={{ fontSize: 14, color: '#1A1A1A' }}>Bao gồm phí và thuế</p>
                                                <p style={{ fontSize: 14, color: '#595959' }}>8% Thuế GTGT</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ flexGrow: 1 }}>
                            <div className='p-4 border-inherit rounded-lg border flex gap-4'>
                                <FontAwesomeIcon style={{ fontSize: "30px", transform: "translateY(7px)" }} icon={faCircleUser} />
                                <div>
                                    {dataUser?.account ? (
                                        <div>
                                            <p className='text-base font-bold'>Bạn đã được đăng nhập</p>
                                            <p style={{ fontSize: 14, color: '#595959' }}>{dataUser?.account?.email}</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <p style={{ fontSize: "14px", color: "#595959" }}>Tiết kiệm từ 10% trở lên cho lựa chọn này khi đăng nhập với Genius, chương trình khách hàng thân thiết của Booking.com</p>
                                            <div style={{ marginTop: "10px" }}>
                                                <a style={{ fontSize: "14px", color: "#006ce4", marginRight: "15px", cursor: "pointer" }} onClick={() => { SignIn() }}>Đăng nhập</a>
                                                <a style={{ fontSize: "14px", color: "#006ce4", cursor: "pointer" }} onClick={() => { SignUpHotel() }}>Đăng ký</a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='p-4 border-inherit rounded-lg border mt-4'>
                                <p style={{ fontSize: 20, fontWeight: 700 }}>Nhập thông tin chi tiết của bạn</p>
                                <div style={{ border: '1px solid #868686', borderRadius: 8, padding: 16, backgroundColor: '#f5f5f5' }} className='mt-4 flex gap-4'>
                                    <FontAwesomeIcon style={{ fontSize: "20px", transform: "translateY(6px)" }} icon={faCircleInfo} />
                                    <div>
                                        <p className='text-sm'>Gần xong rồi! Chỉ cần điền phần thông tin <span style={{ color: "red" }}>*</span> bắt buộc</p>
                                        <p className='text-sm mt-2'>Vui lòng điền thông tin bằng Tiếng Việt hoặc Tiếng Anh</p>
                                    </div>
                                </div>
                                <div className='mt-4'>
                                    <Form
                                        {...layout}
                                        name="nest-messages"
                                        layout='vertical'
                                        style={{ width: '100%', display: 'grid', gridTemplateColumns: 'auto auto', gap: '16px' }}
                                        onFinish={onFinish}
                                        validateMessages={validateMessages}
                                        form={form}
                                        initialValues={dataBooking}
                                    >
                                        <Form.Item
                                            name="name"
                                            label="Họ và tên (Tiếng Việt)"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng nhập họ và tên',
                                                },
                                            ]}
                                        >
                                            <Input value={dataBooking?.name} onChange={(e) => setDataBooking(prevDataBooking => ({ ...prevDataBooking, name: e.target.value }))} />
                                        </Form.Item>
                                        <Form.Item
                                            name="email"
                                            label="Địa chỉ email"
                                            rules={[
                                                {
                                                    type: 'email',
                                                    required: true,
                                                    message: 'Vui lòng nhập email hợp lệ',
                                                },
                                            ]}
                                        >
                                            <Input value={dataBooking?.email} onChange={(e) => setDataBooking(prevDataBooking => ({ ...prevDataBooking, email: e.target.value }))} />
                                        </Form.Item>
                                        <Form.Item
                                            name="phone"
                                            label="Số điện thoại"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng nhập số điện thoại',
                                                },
                                            ]}
                                        >
                                            <Input value={dataBooking?.phone} onChange={(e) => setDataBooking(prevDataBooking => ({ ...prevDataBooking, phone: e.target.value }))} />
                                        </Form.Item>
                                        <Form.Item
                                            name="gender"
                                            label="Giới tính"
                                            rules={[]}
                                        >
                                            <Select
                                                defaultValue={0}
                                                onChange={(e) => setDataBooking(prevDataBooking => ({ ...prevDataBooking, gender: e }))}
                                                options={[
                                                    {
                                                        value: 0,
                                                        label: 'Nam',
                                                    },
                                                    {
                                                        value: 1,
                                                        label: 'Nữ',
                                                    },
                                                    {
                                                        value: 2,
                                                        label: 'Khác',
                                                    }
                                                ]}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="region"
                                            label="Vùng/quốc gia"
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Form>
                                </div>
                            </div>
                            <div className='p-4 border-inherit rounded-lg border mt-4'>
                                <p style={{ fontSize: 16, fontWeight: 700 }} className='mb-4'>Mách nhỏ: </p>
                                <div className='flex gap-4 items-center mt-2'>
                                    <FontAwesomeIcon style={{ color: "green" }} icon={faCreditCard} />
                                    <p className='text-sm'>Không cần thẻ tín dụng</p>
                                </div>
                                <div className='flex gap-4 items-center mt-2'>
                                    <FontAwesomeIcon style={{ color: "green" }} icon={faHouse} />
                                    <p className='text-sm'>Lưu trú linh động: Bạn có thể hủy miễn phí bất cứ lúc nào, chốt ngay mức giá hấp dẫn này hôm nay </p>
                                </div>
                            </div>
                            <div className="p-4 border-inherit rounded-lg border mt-4">
                                <p className="text-base font-bold mb-2">Thời gian đến của bạn</p>
                                <div style={{ fontSize: 14, color: '#595959', marginBottom: "4px", marginTop: "12px" }}><FontAwesomeIcon icon={faCircleCheck} style={{ color: "green", marginRight: "13px", fontSize: "20px" }} /> Nhận phòng sớm từ 13:00</div>
                                <div style={{ fontSize: 14, color: '#595959', marginBottom: "20px" }}> <FontAwesomeIcon icon={faUserTie} style={{ color: "green", marginRight: "19px", fontSize: "20px" }} />Lễ tân 24h - Luôn có trợ giúp mỗi khi bạn cần</div>
                                <div className="mt-2">
                                    <p style={{ fontSize: 14, fontWeight: 600 }} className="mb-2">
                                        Thêm thời gian đến dự kiến của bạn <span style={{ color: "red" }}>*</span>
                                    </p>
                                    <Select
                                        onChange={changeCheckin}
                                        style={{ width: 350 }}
                                        options={[
                                            { value: '00:00', label: '00:00' },
                                            { value: '01:00', label: '01:00' },
                                            { value: '02:00', label: '02:00' },
                                            { value: '03:00', label: '03:00' },
                                            { value: '04:00', label: '04:00' },
                                            { value: '05:00', label: '05:00' },
                                            { value: '06:00', label: '06:00' },
                                            { value: '07:00', label: '07:00' },
                                            { value: '08:00', label: '08:00' },
                                            { value: '09:00', label: '09:00' },
                                            { value: '10:00', label: '10:00' },
                                            { value: '11:00', label: '11:00' },
                                            { value: '12:00', label: '12:00' },
                                            { value: '13:00', label: '13:00' },
                                            { value: '14:00', label: '14:00' },
                                            { value: '15:00', label: '15:00' },
                                            { value: '16:00', label: '16:00' },
                                            { value: '17:00', label: '17:00' },
                                            { value: '18:00', label: '18:00' },
                                            { value: '19:00', label: '19:00' },
                                            { value: '20:00', label: '20:00' },
                                            { value: '21:00', label: '21:00' },
                                            { value: '22:00', label: '22:00' },
                                            { value: '23:00', label: '23:00' },
                                            { value: '24:00', label: '24:00' },
                                        ]}
                                    />
                                </div>
                                <div className="mt-4">
                                    <p style={{ fontSize: 14, fontWeight: 600 }} className="mb-2">
                                        Phương thức thanh toán
                                    </p>
                                    <Select
                                        value={dataBooking.paymentMethod}
                                        onChange={handlePaymentMethodChange}
                                        defaultValue={0}
                                        style={{ width: 350 }}
                                        options={paymentOptions}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <div className="khopgia">
                                    <FontAwesomeIcon icon={faTags} style={{ fontSize: "16px", transform: "translateX(5px)" }} />
                                    <p>Chúng Tôi Luôn Khớp Giá!</p>
                                </div>
                                <Button
                                    className="endow__select--button p-5"
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    onClick={createBooking}
                                >
                                    Đặt phòng
                                </Button>
                            </div>
                            <p style={{ textAlign: 'right', color: '#006ce4', fontWeight: 700, cursor: 'pointer' }} className="mt-8">
                                Các điều kiện đặt phòng là gì?
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="container__set">
                    <div className="p-4 border-inherit rounded-lg border flex my-8 gap-4 items-center">
                        <img src={require('../../assets/img/quanlytaikhoan.svg').default} style={{ width: 16, height: 16, objectFit: 'contain' }} alt="quanquy" />
                        <p>
                            <span onClick={SignIn} style={{ color: '#006ce4', cursor: 'pointer', paddingRight: 4 }}>
                                Đăng nhập
                            </span>
                            để đặt phòng với thông tin đã lưu của bạn hoặc
                            <span onClick={SignUpHotel} style={{ color: '#006ce4', cursor: 'pointer', padding: '0 4px' }}>
                                đăng ký
                            </span>
                            để quản lý các đặt phòng của bạn mọi lúc mọi nơi
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingUser;
