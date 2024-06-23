import React from 'react'

const Footer = () => {
	const dataFooter = 'Booking.com là một phần của Booking Holdings Inc., tập đoàn đứng đầu thế giới về du lịch trực tuyến và các dịch vụ liên quan.'
	return (
		<div className='over'>
			<div className='container__set'>
				<p className='footer__text'>{dataFooter}</p>
				<div className='footer__list--over'>
					<div className='footer__list'>
						<img src={require('../../assets/img/footer-booking.png')} alt='icon booking' />
						<img src={require('../../assets/img/footer-priceline.png')} alt='icon priceline' />
						<img src={require('../../assets/img/footer-kayak.png')} alt='icon kayak' />
						<img src={require('../../assets/img/footer-agoda.png')} alt='icon agoda' />
						<img src={require('../../assets/img/footer-opentable.png')} alt='icon opentable' />
					</div>
				</div>
			</div>
		</div>
	)
}

export default Footer