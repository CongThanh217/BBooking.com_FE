import { UserOutlined } from '@ant-design/icons'
import { Button, DatePicker, Input, Popover } from 'antd'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { filterHotel, listNation } from '../../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import dayjs from 'dayjs';

const Search = () => {
	const moment = require('moment');
	const navigate = useNavigate();
	const location = useLocation();
	const { filterSearch } = location.state || {};
	const { RangePicker } = DatePicker;
	const [open, setOpen] = useState(false);
	const [nation, setNation] = useState([])
	console.log(filterSearch);
	const [nationSelect, setNationSelect] = useState({
		name: '',
		id: 0,
		kind: 0
	})
	const [filters, setFilter] = useState({
		hotelId: '',
		startDate: '',
		endStart: '',
		
	})

	
	const [dataFilter, setDataFilter] = useState([])
	const [forwardFilter, setForwardFilter] = useState({
		startDate : filterSearch.startDate,
		endDate : filterSearch.endDate
	})
	
	const content = (
		<div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
			<div className='flex justify-between'>
				<p>Người lớn</p>
				<Input style={{ width: '100px' }} defaultValue={filters.people} />
			</div>
			<div className='flex justify-between'>
				<p>Phòng</p>
				<Input style={{ width: '100px' }} defaultValue={filters.room} />
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
								<img src={require('../../assets/img/place.svg').default} style={{ width: 24, height: 24, objectFit: 'contain' }} alt='icon place' />
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
			...filters,
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

	const changePicker = (date, dateString) => {
		const startDate = moment(dateString[0]).format('DD/MM/YYYY 14:00:00');
		const endDate = moment(dateString[1]).format('DD/MM/YYYY 12:00:00');
		localStorage.setItem('startDate', startDate);
		localStorage.setItem('endDate', endDate);
		setFilter({
			...filters,
			startDate,
			endDate
		});
	
		
	
	}
	useEffect(() => {
        const startDate = localStorage.getItem('startDate')
        const endDate = localStorage.getItem('endDate')
        console.log(startDate, endDate);
    }, [])
	const handleFilter = async () => {
		const result = await filterHotel(filters)
		if (result?.result === true) {
			setDataFilter(result?.data?.content)
			setForwardFilter({
				...forwardFilter,
				startDate: filters.startDate,
				endDate: filters.endDate
			})
		}
	}

	const toDetailHotel = (idHotel) => {

		navigate("/hotel", { state: { idHotel , startDate : forwardFilter.startDate,
			endDate : forwardFilter.endDate} });
	}

	useEffect(() => {
		const getFilterHoter = async () => {
			const result = await filterHotel(filterSearch)
			if (result?.result === true) {
				setDataFilter(result?.data?.content)
			}
		}
		getFilterHoter()
	}, [])
	
	return (
		<div className='over'>
			<div className="container__set filter__home">
				<div className='container__filter'>
					<div className='flex p-1 gap-1'>
						<Popover open={open} onOpenChange={handleOpenChange} content={suggestNation} placement="bottomLeft" trigger="click">
							<Input placeholder="Bạn muốn đến đâu?" style={{ width: '428px' }} onChange={(e) => changeInput(e)} value={nationSelect?.name}
								prefix={<img style={{ fill: '#000' }} src={require('../../assets/img/iconLuuTru.svg').default} alt="icon luu tru" className='header__menu--icon' />}
							/>
						</Popover>
						<RangePicker className='w-72' onChange={changePicker} defaultValue={[dayjs(moment(filterSearch.startDate, "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DD")), dayjs(moment(filterSearch.endDate, "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DD"))]}/>
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
			<div className='container__set'>
			{dataFilter && dataFilter.length > 0 && (
        <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 20px' }}>
            {dataFilter[0]?.provinceInfo?.name}: tìm thấy {dataFilter.length} kết quả
        </p>
    )}


				<div className='flex flex-col gap-4' style={{ padding: '0 0 20px 0' }}>
					{
						dataFilter?.map((item) => {
							return (
								<div key={item?.id} style={{ display: 'flex', gap: '20px', padding: 20, border: '1px solid #e7e7e7', borderRadius: 8 }}>
									<img src={item?.images} alt='khach san' style={{ width: '240px', height: '240px', borderRadius: 8 }} />
									<div style={{ flexGrow: 1 }}>
										<div className='flex items-center'>
											<p style={{ fontSize: 20, fontWeight: 700, cursor: 'pointer' }} className='hover:text-cyan-600' onClick={() => { toDetailHotel(item?.id) }}>
												{item?.name}
											</p>
											<div style={{ margin: '0 0 0 10px' }} className='flex gap-1'>
												{
													Array.from({ length: item?.stars })?.map((i, index) => {
														return (
															<img key={index} src={require('../../assets/img/start.svg').default} style={{ width: 12, height: 12 }} alt='star' />
														)
													})
												}
											</div>
										</div>
										<div >
											<span style={{  fontSize : "14px", cursor: 'pointer', textDecoration: 'underline', color: '#006ce4', textDecorationColor: '#006ce4' }}>{item?.address}</span>
											<span style={{ fontSize : "14px", cursor: 'pointer', textDecoration: 'underline', color: '#006ce4', textDecorationColor: '#006ce4', margin: '0 10px' }}>Xem trên bản đồ</span>
											<div style={{padding: "5px"}}></div>
											<span style={{fontSize : "14px"}} className='des-9'>{item?.description}</span>
										</div>
									</div>
									<div style={{ width: 140, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', minWidth: 140 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '5px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <p style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>Tuyệt hảo</p>
            <p style={{ fontSize: 12, color: '#595959', paddingRight: "5px", margin: 0, marginLeft: "8px" }}>12 đánh giá</p>
        </div>
        <p style={{ width: 32, height: 32, backgroundColor: '#003b95', color: '#FFF', borderRadius: '6px 6px 6px 0', textAlign: 'center', lineHeight: '32px', cursor: 'pointer', flexShrink: 0, margin: 0 }}>9.2</p>
    </div>
    <p style={{ fontSize: 14, color: '#006ce4', cursor: 'pointer', fontWeight: 700, margin: 0 }}>Địa điểm 9,3</p>
    <p style={{ fontSize: 12, borderRadius: 4, backgroundColor: '#ffb700', color: '#000', padding: '0 5px', margin: 0 }}>Mới trên booking.com</p>
    <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", alignItems: "flex-end", width: '100%' }}>
        <div style={{ display: "flex", alignItems: "center", whiteSpace: 'nowrap', overflow: 'visible', justifyContent: 'flex-end' }}>
            <p style={{ fontSize: 20, fontWeight: 500, margin: 0, flexShrink: 0, textAlign: 'right', direction: 'rtl' }}>VND {item?.roomPrice?.toLocaleString('vi-VN')}</p>
            <img src={require('../../assets/img/clock.svg').default} style={{ width: 12, height: 12, marginLeft: 4 }} alt='clock' />
        </div>
        <p style={{ fontSize: 12, fontWeight: 400, color: "#595959", margin: 0 }}>Đã bao gồm thuế phí</p>
    </div>
    <button style = {{width : "140px" }}className='endow__select--button' onClick={() => { toDetailHotel(item?.id) }}>Xem chỗ trống <FontAwesomeIcon style={{marginLeft : "3px", textAlign : "center", transform: "translateY(2px)", fontSize : "12px"}} icon={faAngleRight} /></button>
</div>






								</div>
							)
						})
					}
				</div>
			</div>
		</div>
	)
}

export default Search