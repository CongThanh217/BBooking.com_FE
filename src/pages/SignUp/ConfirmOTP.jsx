import React, { useState } from 'react';
import { Button, Form, Input, message, Modal } from 'antd';
import { confirmOtp, recalOTP } from '../../api/api';
import { useLocation, useNavigate } from "react-router-dom";

const ConfirmOTP = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [emailOTP, setEmailOTP] = useState('');
    const [loading, setLoading] = useState(false); // Thêm trạng thái loading cho nút "Submit"
    const [submitLoading, setSubmitLoading] = useState(false); // Thêm trạng thái loading cho nút "Submit"

    const location = useLocation();
    const { isHashOtp, emailOtp } = location.state || {};

    const onFinish = async (values) => {
        setSubmitLoading(true); // Bắt đầu loading cho nút "Submit"
        let dataSignUp = {
            otp: values.otp,
            idHash: isHashOtp,
        }
        var result = await confirmOtp(dataSignUp);
        setSubmitLoading(false); // Kết thúc loading cho nút "Submit"
        if (result?.result === true) {
            messageApi.open({
                type: 'success',
                content: result?.message,
            });
            navigate("/login");
        } else {
            messageApi.open({
                type: 'error',
                content: result?.message || 'Xác nhận OTP thất bại, mời thử lại.',
            });
        }
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

    const openModalopenModal = async () => {
        setLoading(true); // Bắt đầu loading
        var result = await recalOTP({ email: emailOtp });
        setLoading(false); // Kết thúc loading
        if (result?.result === true) {
            messageApi.open({
                type: 'success',
                content: result?.message,
            });
        } else {
            messageApi.open({
                type: 'error',
                content: result?.message,
            });
        }
    };

    const handleOk = async () => {
        setIsModalOpen(false);
        setLoading(true); // Bắt đầu loading
        var result = await recalOTP({ email: emailOTP });
        setLoading(false); // Kết thúc loading
        if (result?.result === true) {
            messageApi.open({
                type: 'success',
                content: result.message,
            });
        } else {
            messageApi.open({
                type: 'error',
                content: result.message,
            });
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const changeEmail = (e) => {
        setEmailOTP(e.target.value);
    };

    return (
        <div className='over'>
            {contextHolder}
            <div className='container__set'>
                <div className='pt-4' style={{ width: '360px', margin: '0 auto' }}>
                    <p style={{ marginBottom: "20px" }} className='text-xl font-bold'>Xác nhận OTP</p>
                    <p style={{ marginBottom: "15px" }}>Vui lòng kiểm tra email để nhận OTP</p>
                    <Form
                        {...layout}
                        name="nest-messages"
                        layout='vertical'
                        style={{ width: 360 }}
                        onFinish={onFinish}
                        validateMessages={validateMessages}
                    >
                        <Form.Item
                            name='otp'
                            label="OTP"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: "100%", fontWeight: 500, borderRadius: '4px', height: '35px' }} loading={submitLoading}>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                    <p style={{ fontSize: '14px', textAlign: "center" }}>
                        Nếu otp hết hạn, <Button type="link" onClick={openModalopenModal} loading={loading} style={{ padding: 0, height: 'auto', lineHeight: 'normal' }}>
                            nhấn vào đây
                        </Button> để nhận lại otp
                    </p>
                    <Modal title="Nhập email để nhận lại otp" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                        <Input onChange={changeEmail} />
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default ConfirmOTP;
