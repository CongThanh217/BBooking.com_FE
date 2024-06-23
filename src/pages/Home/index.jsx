import React, { useEffect, useState } from 'react'
import { countHotel, listNation } from '../../api/api'
import { DatePicker, Popover, Button, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Home = () => {
	const moment = require('moment');
	const navigate = useNavigate();
	const [hotel, setHotel] = useState([])
	const [open, setOpen] = useState(false);
	const [nation, setNation] = useState([])
	const [nationSelect, setNationSelect] = useState({
		name: '',
		id: 0,
		kind: 0
	})

	const [filterSearch, setFilter] = useState({
		provinceId: '',
		startDate: '',
		endDate: '',
	})
	const { RangePicker } = DatePicker;

	const content = (
		<div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
			<div className='flex justify-between'>
				<p>Người lớn</p>
				<Input style={{ width: '100px' }} defaultValue={filterSearch.people} />
			</div>
			<div className='flex justify-between'>
				<p>Phòng</p>
				<Input style={{ width: '100px' }} defaultValue={filterSearch.room} />
			</div>
			<Button>Xong</Button>
		</div>
	);

	const suggestNation = (
		<div style={{ width: '368px' }}>
			<p style={{ fontSize: 16, fontWeight: 700 }}>Điểm đến được ưa thích gần đây</p>
			<div style={{ margin: '15px 0 0 0' }}>
				{
					nation?.map((item) => {
						return (
							<div key={item.id} style={{ display: 'flex', gap: 16, alignItems: 'center', cursor: 'pointer' }} onClick={() => selectNation(item)}>
								<img src={require('../../assets/img/place.svg').default} style={{ width: 24, height: 24, objectFit: 'contain' }} />
								<div>
									<p style={{ fontSize: 16, fontWeight: 700 }}>{item.name}</p>
									<p>Việt Nam</p>
								</div>
							</div>
						)
					})
				}
			</div>
		</div>
	)

	const handleOpenChange = (newOpen) => {
		setOpen(newOpen);
	};

	const selectNation = (item) => {
		setOpen(false);
		setNationSelect(item)
		setFilter({
			...filterSearch,
			provinceId: item.id
		})
	}

	const changeInput = async (e) => {
		setNationSelect({
			name: e.target.value,
			id: 0,
			kind: 0
		})
		var query = {
			name: e.target.value
		}
		const result = await listNation(query)
		setNation(result?.data?.content)
	}

	const handleSelect = (ranges) => {
		setSelectedRange(ranges.startDate, ranges.endDate);
	  };

	  const [selectedRange, setSelectedRange] = useState({
		startDate: "",
		endDate: "",
	  });


	const changePicker = (date, dateString) => {
		const startDate = moment(dateString[0]).format('DD/MM/YYYY 14:00:00');
		const endDate = moment(dateString[1]).format('DD/MM/YYYY 12:00:00');
		handleSelect({ startDate, endDate })
		console.log(selectedRange.startDate, selectedRange.endDate)
		setFilter({
			...filterSearch,
			startDate: startDate,
			endDate: endDate
		})

		
	}

	const handleFilter = async () => {
		navigate("/search", { state: { filterSearch } });
	}
	console.log(filterSearch)
	const [shouldNavigate, setShouldNavigate] = useState(false);
	useEffect(() => {
		if (shouldNavigate) {
			navigate("/search", { state: { filterSearch } });
		}
	}, [filterSearch, shouldNavigate]);

	const toSearch =  (proId) => {
		setFilter({
			...filterSearch,
			provinceId: proId,
			startDate: moment("01/07/2024 14:00:00").format('DD/MM/YYYY 14:00:00'),
			endDate:  moment("02/07/2024 12:00:00").format('DD/MM/YYYY 12:00:00')})
			setShouldNavigate(true);
	
		}

	useEffect(() => {
		const callApiCountHotel = async () => {
			try {
				const result = await countHotel();
				setHotel(result?.data)
			} catch (error) {
				console.log(error);
			}
		};
		callApiCountHotel();
	}, []);

	return (
		<div>
			<div className='over'>
				<div className="container__set filter__home">
					<div className='container__filter'>
						<div className='flex p-1 gap-1'>
							<Popover open={open} onOpenChange={handleOpenChange} content={suggestNation} placement="bottomLeft" trigger="click">
								<Input placeholder="Bạn muốn đến đâu?" style={{ width: '428px' }} onChange={(e) => changeInput(e)} value={nationSelect?.name}
									prefix={<img style={{ fill: '#000' }} src={require('../../assets/img/iconLuuTru.svg').default} alt="icon luu tru" className='header__menu--icon' />}
								/>
							</Popover>
							<RangePicker className='w-72' onChange={changePicker} />
							<Popover content={content} trigger="click" placement="bottomRight" className='h-full w-72'>
								<Button icon={<UserOutlined />} >1 người lớn. 1 phòng</Button>
							</Popover>
							<button
								className='endow__select--button'
								style={{ height: '100%', padding: '25px', fontSize: '20px' }}
								onClick={handleFilter}
							>
								Tìm
							</button>
						</div>
					</div>
				</div>
				<div className="container__set">
					<p className="title">Ưu đãi</p>
					<p className="des">Khuyến mãi, giảm giá và ưu đãi đặc biệt dành riêng cho bạn</p>
					<div className='endow__content mt-2'>
						<div className="endow__select">
							<div className='gap-2 flex flex-col'>
								<p className='endow__select--title'>Vi vu tận hưởng không khí Thế vận hội mùa hè 2024?</p>
								<p className='endow__select--des'>Brussels chỉ cách điểm nóng Olympics một chuyến tàu ngắn</p>
								<div>
									<button className='endow__select--button'>Khám phá Brussels</button>
								</div>
							</div>
							<img src={require('../../assets/img/endow-left.png')} alt='Khám phá Brussels' />
						</div>
						<div className="endow__right text-white p-4 gap-2 flex flex-col ">
							<p className='endow__select--title'>Đặt liền tay, bắt ngay ưu đãi</p>
							<p className='endow__select--des'>Tiết kiệm từ 15% trở lên khi đặt và lưu trú trước 1/10/2024</p>
							<div>
								<button className='endow__select--button'>Tìm Ưu Đãi Mùa Du Lịch</button>
							</div>
						</div>
					</div>
				</div>
				<div className="container__set mt-16">
					<p className="title">Điểm đến đang thịnh hành</p>
					<p className="des">Các lựa chọn phổ biến nhất cho du khách từ Việt Nam</p>
					<div className='grid grid-cols-6 gap-4 mt-4'>
						<div className='col-span-3 py-6 px-4 popular1 popular' >
							<div className='flex items-center ' onClick={() => {toSearch(6987140813881344)}}>
								<div className='text-2xl font-bold text-white mr-1' >TP. Hồ Chí Minh</div>
								<img src={require('../../assets/img/coVN.png')} alt="img Viet Nam" className='w-6 h-5 object-contain' />
							</div>
						</div>
						<div className='col-span-3 py-6 px-4 popular popular2' >
							<div className='flex items-center '>
								<div className='text-2xl font-bold text-white mr-1'>Vũng Tàu</div>
								<img src={require('../../assets/img/coVN.png')} alt="img Viet Nam" className='w-6 h-5 object-contain' />
							</div>
						</div>
						<div className='col-span-2 py-6 px-4 popular popular3' >
							<div className='flex items-center '>
								<div className='text-2xl font-bold text-white mr-1'>Đà Nẵng</div>
								<img src={require('../../assets/img/coVN.png')} alt="img Viet Nam" className='w-6 h-5 object-contain' />
							</div>
						</div>
						<div className='col-span-2 py-6 px-4 popular popular4' >
							<div className='flex items-center ' >
								<div className='text-2xl font-bold text-white mr-1'>Hà Nội</div>
								<img src={require('../../assets/img/coVN.png')} alt="img Viet Nam" className='w-6 h-5 object-contain' />
							</div>
						</div>
						<div className='col-span-2 py-6 px-4 popular popular5' >
							<div className='flex items-center '>
								<div className='text-2xl font-bold text-white mr-1'>Đà Lạt</div>
								<img src={require('../../assets/img/coVN.png')} alt="img Viet Nam" className='w-6 h-5 object-contain' />
							</div>
						</div>
					</div>
				</div>
				<div className="container__set mt-16">
					<p className="title">Lên kế hoạch dễ dàng và nhanh chóng</p>
					<p className="des">Khám phá các điểm đến hàng đầu theo cách bạn thích ở Việt Nam</p>
					<div className='grid grid-cols-6 mt-6' >
						<div className='col-span-1'>
							<img src={require('../../assets/img/HaiPhong.jpg')} alt="img Viet Nam" style={{ height: '136px' }} className='rounded-lg object-contain' />
							<p className='text-base font-bold mt-2'>Thành phố Hải Phòng</p>
							<p className='text-neutral-400 text-sm'>Cách đây 88km</p>
						</div>
						<div className='col-span-1'>
							<img src={require('../../assets/img/HaLong.jpg')} alt="img Viet Nam" style={{ height: '136px' }} className='rounded-lg object-contain' />
							<p className='text-base font-bold mt-2'>Hạ Long</p>
							<p className='text-neutral-400 text-sm'>Cách đây 128km</p>
						</div>
						<div className='col-span-1'>
							<img src={require('../../assets/img/CatBa.jpg')} alt="img Viet Nam" style={{ height: '136px' }} className='rounded-lg object-contain' />
							<p className='text-base font-bold mt-2'>Đảo Cát Bà</p>
							<p className='text-neutral-400 text-sm'>Cách đây 129km</p>
						</div>
						<div className='col-span-1'>
							<img src={require('../../assets/img/ThanhHoa.jpg')} alt="img Viet Nam" style={{ height: '136px' }} className='rounded-lg object-contain' />
							<p className='text-base font-bold mt-2'>Thanh Hóa</p>
							<p className='text-neutral-400 text-sm'>Cách đây 136km</p>
						</div>
						<div className='col-span-1'>
							<img src={require('../../assets/img/SamSon.jpg')} alt="img Viet Nam" style={{ height: '136px' }} className='rounded-lg object-contain' />
							<p className='text-base font-bold mt-2'>Sầm Sơn</p>
							<p className='text-neutral-400 text-sm'>Cách đây 144km</p>
						</div>
						<div className='col-span-1'>
							<img src={require('../../assets/img/QuangNinh.jpg')} alt="img Viet Nam" style={{ height: '136px' }} className='rounded-lg object-contain' />
							<p className='text-base font-bold mt-2'>Quảng Ninh</p>
							<p className='text-neutral-400 text-sm'>Cách đây 177km</p>
						</div>
					</div>
				</div>
				<div className="container__set mt-16">
					<p className="title">Các điểm đến được chúng tôi ưa thích</p>
					<div className='flex gap-2 mt-4'>
						<p className="place__active">Khu vực</p>
						<p className="place__noactive">Thành phố</p>
						<p className="place__noactive">Địa điểm được quan tâm</p>
					</div>
					<div className='grid grid-cols-5 my-8 gap-4'>
						{
							hotel?.map((item) => {
								return (
									<div className='flex flex-col col-span-1' key={item.provinceId}>
										<p className='text-sm font-medium cursor-pointer'>{item?.name}</p>
										<p style={{ fontSize: '13px' }} className='text-slate-400'>{item?.count} chỗ nghỉ</p>
									</div>
								)
							})
						}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Home