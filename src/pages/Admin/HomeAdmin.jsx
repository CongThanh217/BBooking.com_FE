import { Button, Checkbox, Col, Form, Input, Radio, Row, Select, Space, Upload, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { listNation, createHotel, createServiceHotel, getMyHotel, getServiceHotel, updateHotel, updateService } from '../../api/api'
import { UploadOutlined } from '@ant-design/icons'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
const { TextArea } = Input;

const HomeAdmin = () => {
	const navigate = useNavigate();
	const CheckboxGroup = Checkbox.Group;
	const [dataCreateHotel, setDataCreateHotel] = useState({})
	const [listImg, setListImg] = useState([])
	const [listService, setListService] = useState({})
	const [idService, setIdService] = useState({})
	const [getService, setGetService] = useState([])
	const [isHotel, setIsHotel] = useState(false)
	const [dataMyHotel, setDataMyHotel] = useState({})
	const [listName, setListName] = useState({
		nationName: '',
		distristName: '',
		wardName: ''
	})

	  
	const onFinish = async (values) => {
		console.log(values);
	};

	const onChangeService = (checkedValues) => {
		setGetService(checkedValues)
		setListService(serviceArrToObj(checkedValues))
	};

	const token = () => {
		if (Cookies.get('dataLogin')) {
			var dataLogin = JSON.parse(Cookies.get('dataLogin'))
			return dataLogin?.access_token
		}
	}
	const DirectToRoom = () => {
        navigate('/detail-hotel');
    };

	const props = {
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
				if (isHotel) {
					setDataCreateHotel({ ...dataCreateHotel, images: info?.file?.response?.data?.fileUrls[0] })
				} else {
					setListImg([...listImg, info?.file?.response?.data?.fileUrls[0]])
				}
			} else if (info.file.status === 'error') {
				message.error(`${info.file.name} file upload failed.`);
			}
		},
	};

	const changeForm = (value, status) => {
		var dataTemp
		switch (status) {
			case 'address':
				dataTemp = {
					address: value.target.value
				}
				break;
			case 'name':
				dataTemp = {
					name: value.target.value
				}
				break;
			case 'desHotel':
				dataTemp = {
					description: value.target.value
				}
				break;
			default:
				break;
		}
		setDataCreateHotel({ ...dataCreateHotel, ...dataTemp })
	}

	const layout = {
		labelCol: {
			span: 24,
		},
		wrapperCol: {
			span: 24,
		},
	};

	const serviceArrToObj = (item) => {
		var serviceTemp = {
			airCondition: false,
			balcony: false,
			bar: false,
			breakfast: false,
			hotbathRoom: false,
			hotelId: 0,
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

	const validateMessages = {
		required: '${label} bắt buộc phải nhập!',
	};

	const changeStar = (e) => {
		var dataTemp = { star: e.target.value }
		setDataCreateHotel({ ...dataCreateHotel, ...dataTemp })
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

	const handleCreateHotel = async () => {
		var dataCreate = dataCreateHotel
		dataCreate = {
			...dataCreateHotel,
			images: listImg[0] || []
		}
		await createHotel(dataCreate).then(async (result) => {
			if (result?.result === true) {
				var listServiceApi = { ...listService, hotelId: result?.message }
				await createServiceHotel(listServiceApi).then(result => {
					if (result?.result === true) {
						message.success(`Tạo phòng thành công`);
						DirectToRoom();

					} else {
						message.error(`${result?.message || 'Tạo thất bại, hãy thử lại sau'}`);
					}
				})
			} else {
				message.error(`${result?.message || 'Tạo thất bại, hãy thử lại sau'}`);
			}
		})
	}

	const handleUpdateHotel = async () => {
		await updateHotel(dataCreateHotel).then(result => {
			if (result?.result === true) {
				message.success({
					content: result?.message || 'Cập nhật khách sạn thành công'
					
				  });

			}
		})
		var listServiceApi = { ...listService, kindId: dataMyHotel?.id, serviceId: idService  }
		await updateService(listServiceApi).then(result => {
			if (result?.result === true) {
				message.success(`Cập nhật service thành công`);
			} else {
				message.error(`${result?.message || 'Cập nhật thất bại, hãy thử lại sau'}`);
			}
		})
	}

	// const handleUpdateHotel = async () => {
	// 	var listServiceApi = { ...listService, hotelId: dataMyHotel?.id }
	// 	await createServiceHotel(listServiceApi).then(result => {
	// 		if (result?.result === true) {
	// 			message.success(`Tạo phòng thành công`);
	// 		} else {
	// 			message.error(`${result?.message || 'Tạo thất bại, hãy thử lại sau'}`);
	// 		}
	// 	})
	// }

	const SearchInputNation = (props) => {
		const [data, setData] = useState([]);
		const onChangeNation = (value) => {
			var dataTemp = { provinceId: value }
			setDataCreateHotel({ ...dataCreateHotel, ...dataTemp })
			setListName({ ...listName, nationName: data?.find(i => i?.value === value)?.label })
		}

		const onSearchNation = async (value) => {
			const query = { kind: 1, name: value };
			try {
				const result = await listNation(query);
				const dataTemp = result?.data?.content || [];
				const dataArr = dataTemp.map((item) => ({
					value: item?.id,
					label: item?.name,
				}));
				setData(dataArr);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		return (
			<Select
				value={listName?.nationName}
				showSearch
				placeholder={props.placeholder}
				style={props.style}
				filterOption={false}
				onSearch={onSearchNation}
				onChange={onChangeNation}
				options={data}
			/>
		);
	}

	const SearchInputDistrict = (props) => {
		const [dataDis, setDataDis] = useState([]);
		const onChange = (value) => {
			var dataTemp = {
				districtId: value
			}
			setDataCreateHotel({ ...dataCreateHotel, ...dataTemp })
			setListName({ ...listName, distristName: dataDis?.find(i => i?.value === value)?.label })
		}
		const onFocus = async (value) => {
			var query = {
				parentId: dataCreateHotel?.provinceId
			}
			var dataArr = []
			const result = await listNation(query)
			var dataTemp = result?.data?.content
			dataTemp?.map((item) => {
				var dataItem = {
					value: item.id,
					label: item.name
				};
				dataArr.push(dataItem)
			})
			setDataDis(dataArr)
		};
		return (
			<Select
				value={listName?.distristName}
				showSearch
				placeholder={props.placeholder}
				style={props.style}
				defaultActiveFirstOption={false}
				filterOption={false}
				onFocus={onFocus}
				onChange={onChange}
				options={(dataDis || []).map((d) => ({
					value: d.value,
					label: d.label,
				}))}
			/>
		);
	}

	const showStarRadio = (number) => {
		return (
			<div className='flex items-center gap-2'>
				{number} sao
				{
					Array.from({ length: number })?.map((i, index) => {
						return (
							<img key={index} src={require('../../assets/img/start.svg').default} style={{ width: 12, height: 12 }} alt='star' />
						)
					})
				}
			</div>
		)
	}

	const SearchInputWard = (props) => {
		const [dataWard, setDataWard] = useState([]);
		const onChange = (value) => {
			setDataCreateHotel({ ...dataCreateHotel, wardId: value })
			setListName({ ...listName, wardName: dataWard?.find(i => i?.value === value)?.label })
		}
		const onFocus = async (value) => {
			var query = {
				parentId: dataCreateHotel?.districtId
			}
			var dataArr = []
			const result = await listNation(query)
			var dataTemp = result?.data?.content
			dataTemp?.map((item) => {
				var dataItem = {
					value: item.id,
					label: item.name
				};
				dataArr.push(dataItem)
			})
			setDataWard(dataArr)
		};
		return (
			<Select
				value={listName?.wardName}
				showSearch
				placeholder={props.placeholder}
				style={props.style}
				defaultActiveFirstOption={false}
				filterOption={false}
				onFocus={onFocus}
				onChange={onChange}
				options={(dataWard || []).map((d) => ({
					value: d.value,
					label: d.label,
				}))}
			/>
		);
	}

	useEffect(() => {
		const callApiGetMyHotel = async () => {
			await getMyHotel().then(async (result) => {
				if (result?.result === true) {
					setDataMyHotel(result?.data)
					if (result?.data?.id && result?.data?.id.length !== 0) {
						console.log('my hotel', result?.data);
						setIsHotel(true)
						setListName({
							nationName: result?.data?.provinceInfo.name,
							distristName: result?.data?.districtInfo.name,
							wardName: result?.data?.wardInfo.name,
						})
						setDataCreateHotel({
							...dataCreateHotel,
							id: result?.data?.id,
							address: result?.data?.address,
							description: result?.data?.description,
							districtId: result?.data?.districtInfo?.id,
							name: result?.data?.name,
							provinceId: result?.data?.provinceInfo?.id,
							star: result?.data?.stars,
							status: result?.data?.status,
							wardId: result?.data?.wardInfo?.id,
							images: result?.data?.images,
						})

						await getServiceHotel({ hotelId: result?.data?.id }).then(resultService => {
							if (resultService?.result === true) {
								setGetService(serviceObjToArr(resultService?.data))
								setListService(resultService?.data)
								setIdService(resultService?.data?.id)
							}
						})
					} else {
						setIsHotel(false)
					}
				}
			})
		}
		callApiGetMyHotel()
	}, [])

	return (
		<div className='over'>
			<div className='container__set'>
				<div style={{ width: '450px', margin: '50px auto 0' }}>
					<p style={{ fontSize: 18, fontWeight: 500 }}>Chỗ nghỉ quý vị muốn đăng ký nằm ở đâu?</p>
					<div className='mt-4' >
						<Form
							{...layout}
							name="nest-messages"
							layout='vertical'
							style={{ width: 500 }}
							onFinish={onFinish}
							validateMessages={validateMessages}
						>
							<Form.Item
								label="Tỉnh, thành phố"
								rules={[
									{
										required: true,
									},
								]}
							>
								<SearchInputNation placeholder="Chọn tỉnh" />
							</Form.Item>
							<Form.Item
								label="Quận, huyện"
								rules={[
									{
										required: true,
									},
								]}
							>
								<SearchInputDistrict placeholder="Chọn quận, huyện" />
							</Form.Item>
							<Form.Item
								label="Xã, phường"
								rules={[
									{
										required: true,
									},
								]}
							>
								<SearchInputWard
									placeholder="Chọn xã, phường"
								/>
							</Form.Item>
							<Form.Item
								label="Địa chỉ cụ thể"
								rules={[
									{
										required: true,
									},
								]}
							>
								<Input value={dataCreateHotel?.address} onChange={(e) => { changeForm(e, 'address') }} />
							</Form.Item>
						</Form>
					</div>
				</div>

				<div style={{ width: '450px', margin: '0 auto' }}>
					<p style={{ fontSize: 18, fontWeight: 500 }}>Cho chúng tôi biết thêm về hotel của quý vị</p>
					<div className='mt-2'>
						<Form
							{...layout}
							name="nest-messages"
							layout='vertical'
							style={{ width: 500 }}
							onFinish={onFinish}
							validateMessages={validateMessages}
						>
							<Form.Item
								label="Tên chỗ nghỉ"
								rules={[
									{
										required: true,
									},
								]}
							>
								<Input value={dataCreateHotel?.name} onChange={(e) => { changeForm(e, 'name') }} />
							</Form.Item>
							<Form.Item
								label="Khách sạn của quý vị được xếp hạng mấy sao?"
								rules={[
									{
										required: true,
									},
								]}
							>
								<Radio.Group onChange={changeStar} value={dataCreateHotel?.star}>
									<Space direction="vertical">
										<Radio value={1}>{showStarRadio(1)}</Radio>
										<Radio value={2}>{showStarRadio(2)}</Radio>
										<Radio value={3}>{showStarRadio(3)}</Radio>
										<Radio value={4}>{showStarRadio(4)}</Radio>
										<Radio value={5}>{showStarRadio(5)}</Radio>
									</Space>
								</Radio.Group>
							</Form.Item>
							<Form.Item
								label="Hãy thêm mô tả của khách sạn"
								rules={[
									{
										required: true,
									},
								]}
							>
								<TextArea value={dataCreateHotel?.description} rows={4} onChange={(e) => { changeForm(e, 'desHotel') }} />
							</Form.Item>
						</Form>
					</div>
				</div>

				<div style={{ width: '450px', margin: '0 auto' }}>
					<p style={{ fontSize: 18, fontWeight: 500 }}>Khách sạn của quý vị trông ra sao?</p>
					<div className='flex gap-4 mt-4' style={{ minHeight: '120px' }}>
						<Upload {...props}>
							<Button icon={<UploadOutlined />}>Đăng tải hình ảnh</Button>
						</Upload>
						<div className='flex gap-4 flex-wrap'>
							{
								isHotel ?
									<img src={dataCreateHotel?.images} alt='Anh tai len' style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 4, objectPosition: '50% 50%' }} /> :
									listImg?.map((item, index) => {
										return (
											<img key={index} src={item} alt='Anh tai len' style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 4, objectPosition: '50% 50%' }} />
										)
									})
							}
						</div>
					</div>
				</div>

				<div style={{ width: '450px', margin: '20px  auto 30px' }}>
					<p style={{ fontSize: 18, fontWeight: 500 }}>Khách có thể sử dụng gì tại khách sạn của quý vị</p>
					<div>
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
					<div style={{ textAlign: 'right' }}>
						{
							isHotel ?
								<Button type='primary' onClick={handleUpdateHotel}>Cập nhật khách sạn</Button>
								:
								<Button type='primary' onClick={handleCreateHotel}>Tạo khách sạn mới</Button>
						}
					</div>
				</div>
			</div>
		</div>
	)
}

export default HomeAdmin