import { DatePicker } from 'antd';
import React, { useState } from 'react'
import moment from 'moment';
import { getStatisticalMonth, getStatiticBooking } from '../../api/api';
import VerticalBarChart from './VerticalBarChart';

const SalesReport = () => {

    const [dataReport, setDataReport] = useState('')
    const [chartDataMoney, setChartDataMoney] = useState(null);
    const [chartDataGood, setChartDataGood] = useState(null);

    const onChange = async (date, dateString) => {
        var queryStatiticBooking = {
            month: moment(dateString).format('MM'),
            year: moment(dateString).format('YYYY'),
            status : 3
        }
        await getStatiticBooking(queryStatiticBooking).then(result => {
            console.log(result);
            if (result?.result === true) {
                setDataReport(result?.data)
            }
        })
        await getStatisticalMonth({ year: moment(dateString).format('YYYY') }).then(result => {
            console.log(result);
            if (result?.result === true) {
                var labelMoney = []
                var dataMoney = []
                var dataGood = []
                result?.data?.map((item) => {
                    labelMoney.push(`tháng ${item?.month}`)
                    dataMoney.push(item?.revenue)
                    dataGood.push(item?.countBooking)
                })
                setChartDataMoney({
                    labels: labelMoney,
                    datasets: [
                        {
                            label: 'Doanh thu mỗi tháng',
                            data: dataMoney,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            barThickness: 100,
                        },
                    ],
                })
                setChartDataGood({
                    labels: labelMoney,
                    datasets: [
                        {
                            label: 'Số đơn hàng',
                            data: dataGood,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            barThickness: 100,
                        },
                    ],
                })
            }
        })
    };

    return (
        <div className='over'>
            <div className='container__set my-8'>
                <DatePicker onChange={onChange} picker="month" />
                <div style={{ width: '100%' }} className='flex gap-4 mt-8'>
                    <div style={{ height: '100px', flexGrow: 1, borderRadius: 8, boxShadow: '0 2px 8px 0 rgba(26,26,26,0.16)' }} className='flex flex-col justify-center items-center'>
                        <p style={{ fontSize: 32, color: '#003b95' }}> {dataReport?.totalPriceBooking?.toString().replace(/(?=(?!\b)(\d{3})+$)/g, ',') || 0} </p>
                        <p style={{ fontSize: 18 }}>Doanh thu</p>
                    </div>
                    <div style={{ height: '100px', flexGrow: 1, borderRadius: 8, boxShadow: '0 2px 8px 0 rgba(26,26,26,0.16)' }} className='flex flex-col justify-center items-center'>
                        <p style={{ fontSize: 32, color: '#003b95' }}> {dataReport?.totalCountBooking || 0} </p>
                        <p style={{ fontSize: 18 }}>Đơn hàng</p>
                    </div>
                    <div style={{ height: '100px', flexGrow: 1, borderRadius: 8, boxShadow: '0 2px 8px 0 rgba(26,26,26,0.16)' }} className='flex flex-col justify-center items-center'>
                        <p style={{ fontSize: 32, color: '#003b95' }}>{dataReport?.roomBookingCountDto?.[0]?.count || 0}</p>
                        <p style={{ fontSize: 18 }}>Phòng</p>
                    </div>
                </div>
                <VerticalBarChart data={chartDataMoney} name='Doanh thu' />
                <VerticalBarChart data={chartDataGood} name='Đơn hàng' />
            </div>
        </div>
    )
}

export default SalesReport