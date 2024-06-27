import React, { useEffect, useState } from 'react';
import { DatePicker, Popover, Button, Input, Table, Select } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDetailHotel, getImageHotel, getEmptyRoom, getServiceRoom, getServiceHotel } from '../../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faHouse } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import locale from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { faMartiniGlass } from '@fortawesome/free-solid-svg-icons';
import { faCheckDouble , faThumbsUp, faCheck} from '@fortawesome/free-solid-svg-icons';
const DetailHotel = () => {
    const navigate = useNavigate();
    const { RangePicker } = DatePicker;
    const location = useLocation();
    const { idHotel, startDate, endDate } = location.state || {};
    const [selectedRooms, setSelectedRooms] = useState({});
    const [dataHotel, setDataHotel] = useState({});
    const [listImgHotel, setListImgHotel] = useState([]);
    const [dataTableRoom, setDataTableRoom] = useState([]);
    const [dataServiceHotel, setDataServiceHotel] = useState([]);
    const [filterRoom, setFilterRoom] = useState({
        hotelId: idHotel,
        startDate: startDate,
        endDate: endDate
    });

    const [filter, setFilter] = useState({
        search: '',
        startDate: "14/06/2024 14:00:00",
        endStart: "15/06/2024 12:00:00",
        people: 1,
        room: 1,
        pet: false
    });

    const toBooking = (data) => {
        var dataRoomChoise = { ...data, ...filterRoom, room: selectedRooms[data.id] || 0 };
        navigate("/booking-user", { state: { dataRoomChoise, dataHotel } });
    };

    const handleChange = (value, item) => {
        setSelectedRooms((prev) => ({
            ...prev,
            [item.id]: value
        }));
    };

    const scrollView = (item) => {
        const element = document.getElementById(item);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const changePicker = (date, dateString) => {
        setFilterRoom({
            ...filterRoom,
            startDate: moment(dateString[0]).format('DD/MM/YYYY 14:00:00'),
            endDate: moment(dateString[1]).format('DD/MM/YYYY 12:00:00')
        });
    };

    const filterService = (item) => {
        const data = [
            { Name: 'Điều hòa', Key: 'airCondition' },
            { Name: 'Ban công', Key: 'balcony' },
            { Name: 'Quầy bar', Key: 'bar' },
            { Name: 'Bữa sáng', Key: 'breakfast' },
            { Name: 'Phòng tắm nóng', Key: 'hotbathRoom' },
            { Name: 'Nhà bếp', Key: 'kitchenette' },
            { Name: 'Bể bơi', Key: 'pool' },
            { Name: 'Sân thượng', Key: 'rooftop' },
            { Name: 'View nhìn ra biển', Key: 'seaView' },
            { Name: 'Phòng tắm hơi', Key: 'steamRoom' },
            { Name: 'Wifi', Key: 'wifi' }
        ];
        var arrTemp = [];
        for (var i in item) {
            if (item[i] === true) {
                const nameService = data.find(e => e?.Key === i)?.Name;
                arrTemp.push(nameService);
            }
        }
        return arrTemp;
    };

    const getRoomEmpty = async () => {
        await getEmptyRoom(filterRoom).then(async (result) => {
            if (result?.data) {
                var arrData = [...result?.data];
                await Promise.all(arrData?.map(async (item, index) => {
                    var resultSer = await getServiceRoom({ kindId: item?.id });
                    if (resultSer?.result === true) {
                        arrData[index] = {
                            ...item,
                            service: filterService(resultSer?.data)
                        };
                    }
                }));
                setDataTableRoom([...arrData]);
            } else {
                setDataTableRoom([]);
            }
        });
    };

    useEffect(() => {
        getRoomEmpty();
    }, [filterRoom]);

    useEffect(() => {
        const callApiDetailHotel = async () => {
            const result = await getDetailHotel(idHotel);
            setDataHotel(result?.data);
            setFilterRoom({
                ...filterRoom,
                hotelId: result?.data?.id
            });
        };
        callApiDetailHotel();
        const callApiImagelHotel = async () => {
            const result = await getImageHotel(idHotel);
            if (result?.result === true) {
                setListImgHotel(result?.data);
            }
        };
        callApiImagelHotel();
        const callApiServicelHotel = async () => {
            var result = await getServiceHotel({ hotelId: idHotel });
            setDataServiceHotel(filterService(result?.data));
        };
        callApiServicelHotel();
    }, [idHotel]);

    const columns = [
        {
            title: 'Loại chỗ nghỉ',
            key: 'type',
            render: (_, text) => (
                <div style={{ maxWidth: 450 }}>
                    <p style={{ fontSize: 18, color: '#006CE4', fontWeight: 700 }}>{text?.name}</p>
                    <p className='my-2'><FontAwesomeIcon style={{ marginRight: "5px" }} icon={faBed} />{text?.numberOfBed} giường</p>
                    <p><FontAwesomeIcon style={{ marginRight: "5px" }} icon={faHouse} />{text?.size}</p>
                    <div className='flex flex-wrap gap-x-4 mt-4'>
                        {text?.service?.map((ser) => (
                            <div key={ser} className='flex gap-2 items-center'>
                                <img src={require('../../assets/img/tickService.svg').default} style={{ width: 12, height: 12 }} alt='tick' />
                                <p>{ser}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            title: 'Số lượng khách',
            dataIndex: 'numberOfPeople',
            key: 'numberOfPeople'
        },
        {
            title: 'Giá hôm nay',
            dataIndex: 'price',
            key: 'price',
            render: (_, text) => (
                <div>
                  <div className='flex gap-2' style={{ fontSize: 20, fontWeight: 700 }}>
                    <p>VND</p>
                    <p>
                      {text?.roomDtoList
                        ?.reduce((total, room) => total + room.price, 0)
                        .toString()
                        .replace(/(?=(?!\b)(\d{3})+$)/g, '.')}
                    </p>
                  </div>
                  <p style={{ fontSize: 14 }}>Đã bao gồm thuế và phí</p>
                </div>
              )
              
        },
        {
            title: 'Chọn phòng',
            key: 'room',
            render: (_, text) => (
                <Select
                    defaultValue="0"
                    style={{ width: '100%' }}
                    onChange={(e) => handleChange(e, text)}
                    options={
                        Array.from({ length: (text?.roomDtoList?.[0]?.emptyRoom + 1) }, (_, i) => ({
                            value: `${i}`,
                            label: `${i}`
                        }))
                    }
                />
            )
        },
        {
            title: '',
            dataIndex: 'name',
            key: 'name', 
            render: (_, data) => (
                <div>
    {
      selectedRooms[data.id] > 0 ? (
        <div style={{ marginBottom: "6px" }}>
          <p>
            {selectedRooms[data.id] > 0 ? (
              <>
                <strong style={{ fontWeight: 700 }}>{selectedRooms[data.id]}</strong> phòng tổng giá
              </>
            ) : null}
          </p>
          <p style={{ fontSize: "20px" }}>
            {selectedRooms[data.id] > 0 ? `VND ${(
              data.roomDtoList
                ?.reduce((total, room) => total + room.price, 0) * selectedRooms[data.id]
              ).toLocaleString('vi-VN')}` : null}
          </p>
          <p style={{ fontSize: "12px", color: "#6b6b6b" }}>Đã bao gồm thuế phí</p>
        </div>
      ) : null
    }
         
                   
                   

<button className='endow__select--button' style={{ width: '100%', justifyContent: 'center', fontWeight: 500 }} onClick={() => toBooking(data)}>Tôi sẽ đặt</button>
                    <p className='mt-4'>- Chỉ mất 2 phút</p>
                    <p>- Xác nhận tức thời</p>
                    <p className='mt-4' style={{ fontWeight: 700, color: '#38b068' }}>Không cần thẻ tín dụng</p>
                </div>
            )
        }
    ];

    const content = (
        <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className='flex justify-between'>
                <p>Người lớn</p>
                <Input style={{ width: '100px' }} defaultValue={filter.people} />
            </div>
            <div className='flex justify-between'>
                <p>Phòng</p>
                <Input style={{ width: '100px' }} defaultValue={filter.room} />
            </div>
            <Button>Xong</Button>
        </div>
    );

    return (
        <div className='over'>
            <div className="container__set">
                <div className='grid grid-cols-5 mt-4'>
                    <p className='tongquan__item'>Tổng quan</p>
                    <p className='tongquan__item' onClick={() => scrollView('thongtin')}>Thông tin & giá</p>
                    <p className='tongquan__item' onClick={() => scrollView('tiennghi')}>Tiện nghi</p>
                    <p className='tongquan__item'>Quy tắc chung</p>
                    <p className='tongquan__item'>Đánh giá của khách (1.359)</p>
                </div>
                <div className='flex flex-between mt-4'>
                    <div className='flex items-center gap-4'>
                        <p style={{ backgroundColor: '#003b95', color: '#FFF', padding: '2px 5px', borderRadius: 4 }}>Genius</p>
                        <div className='flex gap-1'>
                            {Array.from({ length: dataHotel?.stars })?.map((_, index) => (
                                <img key={index} src={require('../../assets/img/start.svg').default} style={{ width: 12, height: 12 }} alt='star' />
                            ))}
                        </div>
                    </div>
                    <div className='flex items-center gap-4'>
                        <img src={require('../../assets/img/heart.svg').default} style={{ width: 24, height: 24, cursor: 'pointer' }} alt='heart' />
                        <img src={require('../../assets/img/share.svg').default} style={{ width: 24, height: 24, cursor: 'pointer' }} alt='share' />
                        <button className='endow__select--button' onClick={() => scrollView('thongtin')}>Đặt ngay</button>
                    </div>
                </div>
                <p style={{ fontSize: "24px", fontWeight: 700 }}>{dataHotel?.name}</p>
                <div className='flex items-center gap-2'>
                    <img src={require('../../assets/img/place.png')} style={{ width: 15, height: 24, objectFit: 'cover', objectPosition: '0%  0%' }} alt='place' />
                    <p style={{ fontSize: 14 }}>{dataHotel?.address} <a style={{color : "#006ce4", cursor : "pointer"}}> - Vị trí xuất sắc - Hiển thị trên bản đồ</a></p>
                </div>
                <div className='grid grid-cols-5 grid-rows-5 gap-3 mt-4'>
                    {listImgHotel?.map((item, index) => {
                        if (index === 0 || index === 2) {
                            return (<img key={index} className='col-span-2 row-span-2' src={item?.link} style={{ width: '100%', height: '260px', cursor: 'pointer', borderRadius: 4 }} alt='img-hotel' />);
                        } else if (index === 1) {
                            return (<img key={index} className='col-span-3 row-span-4' src={item?.link} style={{ width: '100%', height: '532px', cursor: 'pointer', borderRadius: 4 }} alt='img-hotel' />);
                        } else if (index < 8) {
                            return (<img key={index} className='col-span-1' src={item?.link} style={{ width: '100%', height: '120px', cursor: 'pointer', borderRadius: 4 }} alt='img-hotel' />);
                        } else {
                            return (<></>);
                        }
                    })}
                </div>
                <div id='tiennghi' className='flex flex-col mt-4'>
                    <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: "15px" }}>Các tiện nghi được ưa chuộng nhất</h1>
                    <div className='flex gap-4 flex-wrap'>
                        {dataServiceHotel?.map((item) => (
                            <p key={item} style={{ padding: '10px 20px', border: '1px solid #e7e7e7', borderRadius: 8 }}><FontAwesomeIcon style={{color : "green", marginRight : "6px", fontSize : "20px"}} icon={faCheck} />{item}</p>
                        ))}
                        {/* <p style={{ padding: '10px 20px', border: '1px solid #e7e7e7', borderRadius: 8 }}>Bếp</p>
                        <p style={{ padding: '10px 20px', border: '1px solid #e7e7e7', borderRadius: 8 }}>Nhìn ra thành phố</p>
                        <p style={{ padding: '10px 20px', border: '1px solid #e7e7e7', borderRadius: 8 }}>Sân vườn</p>
                        <p style={{ padding: '10px 20px', border: '1px solid #e7e7e7', borderRadius: 8 }}>Hồ bơi</p> */}
                    </div>
                    <h1 style={{ fontSize: 20, fontWeight: 700, marginTop: "15px"}}>Giới thiệu về khách sạn của chúng tôi</h1>

                    <div className='flex justify-between mt-4 gap-8'>
                        <div style={{ fontSize: "15px" }}>{dataHotel?.description}</div>
                        <div style={{ width: 420, minWidth: 420 }}>
                            <div style={{ padding: 20, borderRadius: 8, border: '1px solid #e7e7e7' }}>
                                <p style={{ fontSize: 18, fontWeight: 700 }}>Lợi ích Genius có ở một số lựa chọn: </p>
                                <p className='mt-4 pl-4'>Giảm giá 10%</p>
                                <p className='pl-4'>Áp dụng trên giá trước thuế và phí</p>
                                <div style={{ borderTop: '1px solid #e7e7e7', marginTop: 15, paddingTop: 15 }}>
                                    <p>Chương trình khách hàng thân thiết của Booking.com</p>
                                </div>
                            </div>
                            <div style={{ padding: 20, backgroundColor: '#f0f6ff', borderRadius: 8 }} className='mt-4'>
                                <p style={{ fontSize: 18, fontWeight: 700, color: '#008234' }}>Thông tin uy tín</p>
                                <p style={{ fontSize: 14 }}>Khách nói rằng mô tả và hình ảnh chỗ nghỉ này <span style={{ fontWeight: 700 }}>rất đúng với sự thật</span></p>
                            </div>
                        </div>
                    </div>
                </div>
                <p id='thongtin' className='mt-8' style={{ fontSize: 20, fontWeight: 700 }}>Phòng trống</p>
                <div className='flex gap-4 mt-4' style={{ height: 40 }}>
                    <RangePicker defaultValue={[dayjs(moment(startDate, "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DD")), dayjs(moment(endDate, "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DD"))]} className='w-72' onChange={changePicker} />
                    <Popover content={content} trigger="click" placement="bottomRight" className='h-full w-72'>
                        <Button icon={<UserOutlined />}>{filter.people} người lớn. {filter.room} phòng</Button>
                    </Popover>
                    <button onClick={getRoomEmpty} className='endow__select--button' style={{ height: '100%', fontSize: '16px' }}>Thay đổi tìm kiếm</button>
                </div>
                <div className='mt-8'>
                    <Table columns={columns} dataSource={dataTableRoom} className='table__custom' />;
                </div>
            </div>
        </div>
    );
};

export default DetailHotel;
