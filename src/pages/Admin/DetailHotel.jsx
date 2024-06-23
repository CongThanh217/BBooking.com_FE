import { Button, Col, Form, Input, Row, Modal, message, InputNumber, Select, Upload, Checkbox } from 'antd'
import React, { useEffect, useState } from 'react'
import { createKindRoom, getRoomByHotel, updateKindRoom, createServiceRoom, getServiceRoom, updateService } from '../../api/api';
import { PlusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie'

const DetailHotel = () => {
    const CheckboxGroup = Checkbox.Group;

    const dataRoomSample = {
        images: [],
        name: '',
        numberOfBed: 0,
        numberOfPeople: 0,
        price: 0,
        roomNumber: 0,
        saleOff: 0,
        size: '',
        status: 1
    }
    const [idRoom, setIdRoom] = useState(0);
    const [isService, setIsService] = useState(false);
    const [idService, setIdService] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalService, setIsModalService] = useState(false);
    const [listRoom, setListRoom] = useState([]);
    const [listImg, setListImg] = useState([]);
    const [statusForm, setStatusForm] = useState('');
    const [dataForm, setDataForm] = useState({ ...dataRoomSample })
    const [getService, setGetService] = useState([])
    const [listService, setListService] = useState({})

    const serviceArrToObj = (item) => {
        var serviceTemp = {
            airCondition: false,
            balcony: false,
            bar: false,
            breakfast: false,
            hotbathRoom: false,
            kitchenette: false,
            pool: false,
            rooftop: false,
            seaView: false,
            steamRoom: false,
            wifi: false
        }
        item?.forEach(service => {
            if (serviceTemp.hasOwnProperty(service)) {
                serviceTemp[service] = true;
            }
        });
        return serviceTemp
    }

    const serviceObjToArr = (serviceObj) => {
		let serviceArr = [];
		for (let service in serviceObj) {
			if (serviceObj[service] === true && service !== 'hotelId') {
				serviceArr.push(service);
			}
		}
		return serviceArr;
	}

    const token = () => {
        if (Cookies.get('dataLogin')) {
            var dataLogin = JSON.parse(Cookies.get('dataLogin'))
            return dataLogin?.access_token
        }
    }

    const onFinish = async (values) => {
        console.log(values);
    };

    const showModal = () => {
        setStatusForm('create')
        setIsModalOpen(true);
        setDataForm({ ...dataRoomSample })
        setListImg([])
    };

    const handleSubmitService = async () => {
        if (isService) {
            var dataUpdateTemp = {
                ...listService,
                kindId: idRoom,
                serviceId: idService
            }
            await updateService(dataUpdateTemp).then(result => {
                if (result?.result === true) {
                    message.success(`Cập nhật service thành công`);
                    setIsModalService(false);
                } else {
                    message.error(`${result?.message || 'Cập nhật thất bại, hãy thử lại sau'}`);
                }
            })
        } else {
            var dataCreateTemp = {
                ...serviceArrToObj(getService),
                kindId: idRoom
            }
            await createServiceRoom(dataCreateTemp).then(result => {
                if (result?.result === true) {
                    message.success(`Thêm mới dịch vụ thành công`);
                    setIsModalService(false);
                } else {
                    message.error(`${result?.message || 'Thêm thất bại, hãy thử lại sau'}`);
                }
            })
        }
    }

    const handleSubmitForm = async () => {
        setIsModalOpen(false);
        if (statusForm === 'create') {
            var dataCreate = { ...dataForm, images: [...listImg] }
            await createKindRoom(dataCreate).then(result => {
                if (result?.result === true) {
                    getListRoomHotel()
                    message.success(`${result?.message}`);
                } else {
                    message.error(`${result?.message || 'Tạo thất bại, mời thử lại sau'}`);
                }
            })
        } else {
            await updateKindRoom(dataForm).then(result => {
                if (result?.result === true) {
                    getListRoomHotel()
                    message.success(`${result?.message}`);
                } else {
                    message.error(`${result?.message || 'Cập nhật thất bại, mời thử lại sau'}`);
                }
            })
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleCancelService = () => {
        setIsModalService(false)
    }

    const handleUploadImg = {
        name: 'files',
        action: 'https://shoee.click/v1/file/upload',
        headers: {
            'Authorization': `Bearer ${token()}`
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                // message.success(`${info.file.name} file uploaded successfully`);
                setListImg([...listImg, info?.file?.response?.data?.fileUrls[0]])
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    const editRoom = (room) => {
        setDataForm({
            ...dataRoomSample,
            id: room?.id,
            name: room?.name,
            numberOfBed: room?.numberOfBed,
            numberOfPeople: room?.numberOfPeople,
            price: room?.price,
            roomNumber: room?.roomNumber,
            saleOff: room?.saleOff,
            size: room?.size,
            status: room?.status || -1,
        })
        setStatusForm('edit')
        setIsModalOpen(true);
    }

    const openModalService = async (room) => {
        setIdRoom(room?.id)
        setIsModalService(true);
        await getServiceRoom({ kindId: room?.id }).then(resultService => {
            if (resultService?.result === true) {
                setIsService(true)
                console.log('resultService', resultService);
                setGetService(serviceObjToArr(resultService?.data))
                setListService(resultService?.data)
                setIdService(resultService?.data?.id)
            } else {
                setIsService(false)
            }
        })
    }

    const onChangeService = (checkedValues) => {
        setGetService(checkedValues)
        setListService(serviceArrToObj(checkedValues))
    };

    const layout = {
        labelCol: {
            span: 24,
        },
        wrapperCol: {
            span: 24,
        },
    };

    const validateMessages = {
        required: '${label} bắt buộc phải nhập!',
    };

    const getListRoomHotel = async () => {
        await getRoomByHotel().then(result => {
            if (result?.result === true) {
                setListRoom(result?.data)
            }
        })
    }

    useEffect(() => {
        getListRoomHotel()
    }, [])

    return (
        <div className='over'>
            <div className="container__set">
                <p className='mt-4' style={{ fontSize: 36, fontWeight: 700 }}>Chi tiết phòng</p>
                <div className='flex my-4 flex-wrap' style={{ columnGap: '3%', rowGap: '32px', minHeight: 250 }}>
                    {
                        listRoom?.map((item) => {
                            return (
                                <div key={item?.id} style={{ borderRadius: 8, border: '1px solid #ddd', width: '31%', height: '530px' }}>
                                    <img src={item?.imagesList?.[0]?.link} alt='img hotel' style={{ borderRadius: '8px 8px 0 0', width: '100%', height: 300 }} />
                                    <div style={{ padding: 15, borderTop: '1px solid #ddd' }}>
                                        <p>Loại phòng: <span>{item?.name}</span></p>
                                        <p>Sức chứa: <span>{item?.numberOfPeople} người</span></p>
                                        <p>Diện tích: <span>{item?.size}</span></p>
                                        <p>Số phòng hiện có: <span>{item?.roomNumber}</span></p>
                                        <p>Trạng thái:  
  <span style={{ color: item?.status === 1 ? 'green' : item?.status === -1 ? 'red' : 'black' }}>
    {item?.status === 1 ? " Mở" : item?.status === -1 ? " Đóng" : "Không xác định"}
  </span>
</p>


                                        <div className='mt-8 flex gap-2'>
                                            <Button onClick={() => { editRoom(item) }} >Chỉnh sửa</Button>
                                            <Button>Xóa</Button>
                                            <Button onClick={() => { openModalService(item) }} >Dịch vụ</Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div
                        style={{
                            width: '30%',
                            flexDirection: 'column',
                            alignItems: 'center',
                            backgroundColor: '#006ce4',
                            borderRadius: 4,
                            cursor: 'pointer',
                            color: '#FFF',
                            minHeight: '300px'
                        }}
                        className='flex'
                        onClick={showModal}
                    >
                        <p style={{ fontSize: '20px', marginTop: '100px' }}>Tạo căn hộ mới</p>
                        <PlusCircleOutlined style={{ fontSize: '30px', marginTop: '20px' }} />
                    </div>
                </div>

                <Modal title="Thông tin phòng" open={isModalOpen} width={1180} footer={null} onCancel={handleCancel}>
                    <div style={{ borderRadius: 8, border: '1px solid #ddd', padding: 16 }}>
                        <Upload {...handleUploadImg}>
                            <Button icon={<UploadOutlined />}>Đăng tải hình ảnh của phòng</Button>
                        </Upload>
                        <div className='mt-4'>
                            <Form
                                {...layout}
                                name="nest-messages"
                                layout='vertical'
                                style={{ width: '100%' }}
                                onFinish={onFinish}
                                validateMessages={validateMessages}
                            >
                                <Row gutter={16}>
                                    <Col span={12} >
                                        <Form.Item
                                            label="Tên phòng"
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                        >
                                            <Input value={dataForm?.name} onChange={(e) => setDataForm(prevDataForm => ({ ...prevDataForm, name: e.target.value }))} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}></Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Số phòng (loại này)"
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                        >
                                            <InputNumber style={{ width: '100%' }} value={dataForm?.roomNumber} onChange={(e) => setDataForm(prevDataForm => ({ ...prevDataForm, roomNumber: e }))} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Kích thước phòng"
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                        >
                                            <Input value={dataForm?.size} onChange={(e) => setDataForm(prevDataForm => ({ ...prevDataForm, size: e.target.value }))} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </div>

                    <div className='mt-8' style={{ borderRadius: 8, border: '1px solid #ddd', padding: 16, fontSize: 14 }}>
                        <p style={{ fontSize: 16, fontWeight: 700 }}>Tùy chọn giường</p>
                        <div className='flex gap-4 mt-4'>
                            <p style={{ width: 300 }}>Số lượng giường: </p>
                            <InputNumber style={{ width: '100%' }} value={dataForm?.numberOfBed} onChange={(e) => setDataForm(prevDataForm => ({ ...prevDataForm, numberOfBed: e }))} />
                        </div>
                    </div>

                    <div className='mt-8' style={{ borderRadius: 8, border: '1px solid #ddd', padding: 16, fontSize: 14 }}>
                        <p style={{ fontSize: 16, fontWeight: 700 }}>Sức chứa</p>
                        <p>Quý vị có thể điều chỉnh sức chứa bên dưới. Để thu hút thêm đơn đặt từ nhóm khách gia đình, đừng quên <span>thiết lập giá cho trẻ em</span> và <span>thêm thông tin cũ/mới</span></p>
                        <p style={{ fontWeight: 500, marginTop: 10 }}>Tổng sức chứa: </p>
                        <p className='mt-2'>Tổng số khách(người lớn và trẻ em) có thể ở là bao nhiêu?</p>
                        <div className='flex gap-4 mt-6'>
                            <p style={{ width: 300 }}>Số khách tối đa:</p>
                            <InputNumber style={{ width: '100%' }} value={dataForm?.numberOfPeople} onChange={(e) => setDataForm(prevDataForm => ({ ...prevDataForm, numberOfPeople: e }))} />
                        </div>
                    </div>

                    <div className='mt-8' style={{ borderRadius: 8, border: '1px solid #ddd', padding: 16, fontSize: 14 }}>
                        <p style={{ fontSize: 16, fontWeight: 700 }}>Giá</p>
                        <div className='flex gap-4'>
                            <div style={{ flexGrow: 1 }}>
                                <p className='mb-2'>Giá 1 đêm(đã bao gồm thuế phí)</p>
                                <Input value={dataForm?.price} onChange={(e) => setDataForm(prevDataForm => ({ ...prevDataForm, price: e.target.value }))} />
                            </div>
                            <div style={{ flexGrow: 1 }}>
                                <p className='mb-2'>Giảm giá</p>
                                <Input value={dataForm?.saleOff} onChange={(e) => setDataForm(prevDataForm => ({ ...prevDataForm, saleOff: e.target.value }))} />
                            </div>
                        </div>
                    </div>

                    <div className='mt-8' style={{ borderRadius: 8, border: '1px solid #ddd', padding: 16, fontSize: 14 }}>
                        <p style={{ fontSize: 16, fontWeight: 700 }}>Trạng thái</p>
                        <div style={{ display: 'flex', marginTop: 10 }}>
                            <p style={{ width: 180 }}>Trạng thái phòng: </p>
                            <Select
                                value={dataForm?.status}
                                style={{ width: '100%' }}
                                onChange={(e) => setDataForm(prevDataForm => ({ ...prevDataForm, status: e }))}
                                options={[{ value: -1, label: 'Đóng' }, { value: 1, label: 'Mở' }]}
                            />
                        </div>
                    </div>

                    <div className='flex gap-4 my-8' style={{ width: '100%' }}>
                        <Button style={{ width: '50%' }} onClick={handleCancel}>Quay lại phần Tổng quan phòng</Button>
                        <Button style={{ width: '50%' }} type="primary" onClick={handleSubmitForm}>
                            {statusForm === 'create' ? 'Lưu phòng' : 'Cập nhật'}
                        </Button>
                    </div>
                </Modal>

                <Modal title="Dịch vụ có trong phòng" open={isModalService} width={500} footer={null} onCancel={handleCancelService}>
                    <div className='mt-4'>
                        <CheckboxGroup style={{ width: '100%' }} onChange={onChangeService} value={getService} >
                            <Row>
                                <Col span={24}>
                                    <Checkbox value="airCondition">Điều hòa</Checkbox>
                                </Col>
                                <Col span={24}>
                                    <Checkbox value="balcony">Ban công</Checkbox>
                                </Col>
                                <Col span={24}>
                                    <Checkbox value="bar">Quầy bar</Checkbox>
                                </Col>
                                <Col span={24}>
                                    <Checkbox value="breakfast">Bữa sáng</Checkbox>
                                </Col>
                                <Col span={24}>
                                    <Checkbox value="hotbathRoom">Phòng tắm nóng</Checkbox>
                                </Col>
                                <Col span={24}>
                                    <Checkbox value="kitchenette">Nhà bếp</Checkbox>
                                </Col>
                                <Col span={24}>
                                    <Checkbox value="pool">Bể bơi</Checkbox>
                                </Col>
                                <Col span={24}>
                                    <Checkbox value="rooftop">Sân thượng</Checkbox>
                                </Col>
                                <Col span={24}>
                                    <Checkbox value="seaView">View nhìn ra biển</Checkbox>
                                </Col>
                                <Col span={24}>
                                    <Checkbox value="steamRoom">Phòng tắm hơi</Checkbox>
                                </Col>
                                <Col span={24}>
                                    <Checkbox value="wifi">Wifi</Checkbox>
                                </Col>
                            </Row>
                        </CheckboxGroup>
                    </div>
                    <div className='flex gap-4 my-8' style={{ width: '100%' }}>
                        <Button style={{ width: '50%' }} onClick={handleCancelService}>Quay lại phần Tổng quan phòng</Button>
                        <Button style={{ width: '50%' }} type="primary" onClick={handleSubmitService}>
                            {isService ? 'Lưu dịch vụ' : 'Thêm mới dịch vụ'}
                        </Button>
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default DetailHotel