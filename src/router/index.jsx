import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from '../components/Layout';
import LayoutSign from '../components/Layout/LayoutSign';
import LayoutAdmin from '../components/Layout/LayoutAdmin';
import Home from '../pages/Home';
import LogIn from '../pages/LogIn';
import SignUp from '../pages/SignUp';
import ConfirmOTP from '../pages/SignUp/ConfirmOTP.jsx';
import Page404 from '../components/404';
import Search from '../pages/Search';
import DetailHotel from '../pages/DetailHotel/index.jsx';
import BookingUser from '../pages/Booking/BookingUser.jsx';
import Booking from '../pages/Booking/Booking.jsx';
import BookingSuccess from '../pages/Booking/BookingSuccess.jsx'; 
import BookingPending from '../pages/Booking/BookingFail.jsx';
import HomeAdmin from '../pages/Admin/HomeAdmin.jsx';
import ListBooking from '../pages/Admin/ListBooking.jsx';
import CalendarForm from '../pages/Admin/Calendar.jsx';
import DetailHotelAdmin from '../pages/Admin/DetailHotel.jsx';
import SalesReport from '../pages/Admin/SalesReport.jsx';

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="*" element={<Page404 />} />
                    <Route path="search" element={<Search />} />
                    <Route path="hotel" element={<DetailHotel />} />
                    <Route path="booking-user" element={<BookingUser />} />
                    <Route path="booking" element={<Booking />} />
                    <Route path="booking-success" element={<BookingSuccess />} />
                    <Route path="booking-pending" element={<BookingPending />} />
                </Route>
                <Route element={<LayoutSign />}>
                    <Route path="login" element={<LogIn />} />
                    <Route path="signup" element={<SignUp />} />
                    <Route path="confirm-otp" element={<ConfirmOTP />} />
                </Route>
                <Route element={<LayoutAdmin />}>
                    <Route path="admin" element={<HomeAdmin />} />
                    <Route path="list-booking" element={<ListBooking />} />
                    <Route path="calendar" element={<CalendarForm />} />
                    <Route path="detail-hotel" element={<DetailHotelAdmin />} />
                    <Route path="sales-report" element={<SalesReport />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
