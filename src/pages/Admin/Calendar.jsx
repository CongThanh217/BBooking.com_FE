import { Button, Calendar, InputNumber, Radio, Select, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { createEmptyRoom, getEmptyRoomID, getRoomByHotel, updateEmptyRoom } from '../../api/api';

import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.locale('zh-cn');
dayjs.extend(customParseFormat);


const CalendarForm = () => {
    const [listRoomHotel, setListRoomHotel] = useState([])
    const [listDate, setListDate] = useState([]);
    const [dataEmptyRoom, setDataEmptyRoom] = useState([]);
    const [dataChoise, setDataChoise] = useState({});
    const [typeRoom, setTypeRoom] = useState('');
    const [dateChoise, setDateChoise] = useState('');
    const [errorEmptyRoomNumber, setErrorEmptyRoomNumber] = useState(false);
    const [errorPrice, setErrorPrice] = useState(false);
  
    const handleEmptyRoomNumberChange = (value) => {
      setDataChoise({ ...dataChoise, emptyRoomNumber: value });
      setErrorEmptyRoomNumber(false); 
    };
  
    const handlePriceChange = (value) => {
      setDataChoise({ ...dataChoise, price: value });
      setErrorPrice(false); 
    };
    const formatDay = (e) => {
        return dayjs(e, "DD-MM-YYYY").format("DD-MM-YYYY")
    }

    const selectRoom = (newValue) => {
        setErrorPrice(false);
        setErrorEmptyRoomNumber(false); 

        setDateChoise(formatDay(newValue))
        var dataTemp = dataEmptyRoom?.find(i => formatDay(i?.startDate) === formatDay(newValue))
        setDataChoise({
            ...dataTemp,
            emptyRoomId: [dataTemp?.emptyRoomId],
            emptyRoomNumber: dataTemp?.emptyRoom
        })
    }

    const changeRoom = async (value) => {
        setTypeRoom(value)
        await getEmptyRoomID(value).then(result => {
            if (result?.result === true) {
                setDataEmptyRoom(result?.data)
                var dataTemp = []
                result?.data?.map((item) => {
                    dataTemp.push(dayjs(item?.startDate, "DD-MM-YYYY").format("DD-MM-YYYY"))
                })
                setListDate([...dataTemp])
            }
        })
    }

    const handleEmptyRoom = async () => {
        let hasError = false;
        if (dataChoise.status === undefined || dataChoise.status === null) {
            setError(true);
            message.error('Vui lòng chọn trạng thái');
            return; 
          }
          if (dataChoise.emptyRoomNumber === undefined || dataChoise.emptyRoomNumber < 0 || dataChoise.emptyRoomNumber === null) {
            setErrorEmptyRoomNumber(true);
            hasError = true;
          }
      
          if (dataChoise.price === undefined || dataChoise.price === null)  {
            setErrorPrice(true);
            hasError = true;
          }
          console.log('has',dataChoise.emptyRoomNumber)

          if (hasError) {
            message.error('Vui lòng nhập đầy đủ thông tin');
            return; // Stop further execution
          }
        await updateEmptyRoom(dataChoise).then(result => {
            if (result?.result === true) {
                message.success(result?.message || `Cập nhật thành công`);
                changeRoom(typeRoom)
            } else {
                message.error(result?.message || `Cập nhật thất bại`);
            }
        })
    }

    const handelCreatEmpty = async() => {
        let hasError = false;
        if (dataChoise.status === undefined || dataChoise.status === null) {
            setError(true);
            message.error('Vui lòng chọn trạng thái');
            return; 
          }
          if (dataChoise.emptyRoomNumber === undefined || dataChoise.emptyRoomNumber < 0) {
            setErrorEmptyRoomNumber(true);
            hasError = true;
          }
      
          if (dataChoise.price === undefined) {
            setErrorPrice(true);
            hasError = true;
          }
          if (hasError) {
            message.error('Vui lòng nhập đầy đủ thông tin');
            return; // Stop further execution
          }
        var dataCreate = {
            createOneEmptyRoomForm: {
                emptyRoom: dataChoise?.emptyRoomNumber,
                endDate: dayjs(dateChoise, "DD/MM/YYYY").format("DD/MM/YYYY 00:00:00"),
                price: dataChoise?.price,
                startDate: dayjs(dateChoise, "DD/MM/YYYY").format("DD/MM/YYYY 00:00:00"),
                status: dataChoise?.status
            },
            kindOfRoomId: typeRoom
        }
        await createEmptyRoom(dataCreate).then(result => {
            if (result?.result === true) {
                message.success(result?.message || `Tạo mới thành công`);
                changeRoom(typeRoom)
            } else {
                if (result?.message) {
                    if (result?.message.includes("exceeded the number")) {
                        message.error("Vượt quá số phòng hiện có");
                    }else{
                        message.error(result?.message);
                    }
                }
                else{
                    message.error(`Tạo mới thất bại`);

                }

            }
        })
    }

    const cancelEmptyRoom = () => {
        setDataChoise({
            emptyRoom: 0,
            emptyRoomId: [0],
            emptyRoomNumber: 0,
            endDate: "",
            price: 0,
            startDate: "",
            status: 0
        })
    }

    const onPanelChange = (value, mode) => {
        console.log(value.format('YYYY-MM-DD'), mode);
    };

    const checkRoom = (item) => {
        return dataEmptyRoom?.find(i => formatDay(i?.startDate) === formatDay(item))
    }

    const dateCellRender = (value) => {
        const roomInfo = checkRoom(value);
    
        if (listDate.includes(dayjs(value, "DD-MM-YYYY").format("DD-MM-YYYY"))) {
            const statusClass = roomInfo?.status === -1 ? 'custom__calendar--item' : '';
    
            return (
                <div className={`events ${statusClass}`}>
                    {roomInfo ? (
                        <>
                            <div style={{ fontSize: 12 }}>Còn {roomInfo.emptyRoom} căn đang bán</div>
                            <div>VND {roomInfo.price?.toString().replace(/(?=(?!\b)(\d{3})+$)/g, ',')}</div>
                        </>
                    ) : null}
                </div>
            );
        } else {
            return (
                <div className="events custom__calendar--item">
                    <div style={{ textAlign: 'center', lineHeight: '84px' }}> Đóng </div>
                </div>
            );
        }
    };
    

    useEffect(() => {
        const callApiRoomHotel = async () => {
            var dataTemp = []
            await getRoomByHotel().then(result => {
                result?.data?.map((item) => {
                    dataTemp.push({
                        label: item?.name,
                        value: item?.id
                    })
                })
            })
            setListRoomHotel(dataTemp)
        }
        callApiRoomHotel()
    }, [])
    const [error, setError] = useState(false);
  
    const handleStatusChange = (e) => {
      setDataChoise({ ...dataChoise, status: e.target.value });
      setError(false); // Reset error state when user makes a selection
    };
  
   
  
    return (
        <div className='over'>
            <div className='container__set mb-8'>
                <p className='mt-4' style={{ fontSize: 20, fontWeight: 700 }}>Lịch</p>
                <div className='mt-4 flex gap-4 items-center'>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>Chọn loại phòng: </p>
                    <Select onChange={changeRoom} style={{ width: 250 }} placeholder='Chọn phòng' options={listRoomHotel} />
                </div>
                <div style={{ display: 'flex' }} className='gap-4 mt-8'>
                    <Calendar className='calender__custom' cellRender={dateCellRender} onSelect={selectRoom} onPanelChange={onPanelChange}  />
                    <div style={{ width: 280, minWidth: 280, padding: 20, border: '1px solid #d6d5d5', borderRadius: 8, height: 'fit-content', position: 'sticky', top: 0 }}>
                        <p>Mở hoặc đóng nhận đặt phòng</p>
                        <Radio.Group onChange={handleStatusChange} value={dataChoise?.status}>
        <Radio value={1}>Mở</Radio>
        <Radio value={-1}>Đóng</Radio>
      </Radio.Group>
      {error && <p style={{ color: 'red' }}>Vui lòng chọn trạng thái</p>}
      <p className='mt-4 mb-2'>Chọn số lượng muốn bán:</p>
      <InputNumber
        style={{ width: '100%' }}
        min={0}
        onChange={handleEmptyRoomNumberChange}
        value={dataChoise?.emptyRoomNumber}
      />
      {errorEmptyRoomNumber && <p style={{ color: 'red', marginTop: '5px' }}>Vui lòng nhập số lượng hợp lệ (lớn hơn hoặc bằng 0)</p>}

      <p className='mt-4'>Giá:</p>
      <InputNumber
        style={{ width: '100%' }}
        className='mt-2'
        placeholder='Giá'
        value={dataChoise?.price}
        onChange={handlePriceChange}
      />
      {errorPrice && <p style={{ color: 'red', marginTop: '5px' }}>Vui lòng nhập giá</p>}

                        <div className='flex mt-4 gap-4'>
                            <Button onClick={cancelEmptyRoom}>Hủy</Button>
                            {
                                dataChoise?.emptyRoomId?.[0] !== undefined ?
                                    <Button type='primary' onClick={handleEmptyRoom} >Lưu</Button>
                                    :
                                    <Button type='primary' onClick={handelCreatEmpty} >Tạo mới</Button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CalendarForm 