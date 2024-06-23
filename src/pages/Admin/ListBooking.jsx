import { Button, Popover, Select, Table, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { getBookingHotel, updateStatusBooking } from '../../api/api';

const ListBooking = () => {
    const [dataListBooking, setDataListBooking] = useState([]);
    const [openPopoverId, setOpenPopoverId] = useState(null); // Trạng thái cho Popover mở

    const changeSelect = (value) => {
        console.log(`selected ${value}`);
    };

    const handleOpenChange = (newOpen, itemId) => {
        setOpenPopoverId(newOpen ? itemId : null);
    };

    const cancelRoom = async (item, status) => {
        var query = {
            bookingId: item?.id,
            status: status
        };
        await updateStatusBooking(query).then(result => {
            if (result?.result === true) {
                message.success(`${result?.message}`);
                setOpenPopoverId(null);
                getApiListBooking();
            } else {
                message.error(`${result?.message || 'Thay đổi trạng thái thất bại, mời thử lại sau'}`);
            }
        });
    };

    const content = (item) => {
        return (
            <div style={{ width: 200 }} className='flex flex-col gap-2'>
                <div onClick={() => cancelRoom(item, 4)} className='menu__threeDot'>Hủy phòng</div>
                <div onClick={() => cancelRoom(item, 5)} className='menu__threeDot'>Báo khách vắng mặt</div>
            </div>
        );
    };

    const listPayment = [
        {
            value: 0,
            label: 'Trực tiếp',
        },
        {
            value: 1,
            label: 'PAYPAY',
        }
    ];

    const listStatusRoom = [
        {
            label: 'đã xác nhận',
            value: 1
        },
        {
            label: 'status = 2',
            value: 2
        },
        {
            label: 'đã hoàn thành',
            value: 3
        },
        {
            label: 'đã hủy',
            value: 4
        },
        {
            label: 'vắng mặt',
            value: 5
        },
    ];

    const columns = [
        {
            title: 'Mã đặt',
            dataIndex: 'bookingCode',
            key: 'bookingCode',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Tên khách',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Nhận phòng',
            dataIndex: 'startDate',
            key: 'startDate',
        },
        {
            title: 'Ngày đi',
            dataIndex: 'endDate',
            key: 'endDate',
        },
        {
            title: 'Tình trạng',
            dataIndex: 'status',
            key: 'status',
            render: (text) => (
                <p>{listStatusRoom?.find(i => i.value === text)?.label}</p>
            )
        },
        {
            title: 'Tổng thanh toán',
            dataIndex: 'price',
            key: 'price',
            render: (text) => (
                <p style={{ whiteSpace: 'nowrap' }}>VND {text?.toString().replace(/(?=(?!\b)(\d{3})+$)/g, ',')}</p>
            )
        },
        {
            title: 'Phương thức thanh toán',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            render: (text) => (
                <p>{listPayment?.find(i => i.value === text)?.label}</p>
            )
        },
        {
            title: 'Giờ nhận phòng',
            dataIndex: 'checkIn',
            key: 'checkIn',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Thay đổi trạng thái',
            key: 'key',
            render: (_, text) =>
            (
                text.status === 1 ?
                    <Popover
                        open={openPopoverId === text.id}
                        content={() => content(text)}
                        trigger="click"
                        placement='bottomRight'
                        onOpenChange={(newOpen) => handleOpenChange(newOpen, text.id)}
                    >
                        <img src={require('../../assets/img/threeDot.svg').default} alt='three dot' style={{ width: '24px', height: '24px', cursor: 'pointer' }} />
                    </Popover> :
                    <img src={require('../../assets/img/threeDot.svg').default} alt='three dot' style={{ width: '24px', height: '24px', opacity: 0.5 }} />
            )
        },
    ];

    const getApiListBooking = async () => {
        await getBookingHotel().then(result => {
            setDataListBooking(result?.data?.content);
        });
    };

    useEffect(() => {
        getApiListBooking();
    }, []);

    return (
        <div className='over'>
            <div className='container__set'>
                <p className='mt-4' style={{ fontSize: 20, fontWeight: 700 }}>Đặt phòng</p>
                <div className='flex gap-4 items-end mt-4' >
                    <div className='flex gap-2 flex-col' >
                        <p>Ngày</p>
                        <Select onChange={changeSelect} style={{ width: 250 }}>
                            <Select.Option value="sample">Sample</Select.Option>
                            <Select.Option value="vip">vip</Select.Option>
                        </Select>
                    </div>
                    <div className='flex gap-2 flex-col' >
                        <p>Lọc theo ngày</p>
                        <Select onChange={changeSelect} style={{ width: 250 }}>
                            <Select.Option value="sample">Sample</Select.Option>
                            <Select.Option value="vip">vip</Select.Option>
                        </Select>
                    </div>
                    <Select onChange={changeSelect} style={{ width: 250 }}>
                        <Select.Option value="sample">Sample</Select.Option>
                        <Select.Option value="vip">vip</Select.Option>
                    </Select>
                    <Button type='primary'>Hiển thị đặt phòng</Button>
                </div>
                <div className='mt-8'>
                    <Table dataSource={dataListBooking} columns={columns} />
                </div>
            </div>
        </div>
    )
}

export default ListBooking;
