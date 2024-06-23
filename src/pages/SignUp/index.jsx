import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { signup } from '../../api/api';
import { useLocation, useNavigate } from "react-router-dom";

const SignUp = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false); // Thêm trạng thái loading

    const location = useLocation();
    const { kindID } = location.state || {};

    const onFinish = async (values) => {
        setLoading(true); // Bắt đầu loading
        let dataSignUp = {
            email: values.email,
            userName: values.userName,
            password: values.password,
            kind: kindID
        }
        const result = await signup(dataSignUp);
        setLoading(false); // Kết thúc loading
        if (result?.result === true) {
            navigate("/confirm-otp", { state: { isHashOtp: result.data.idHash, emailOtp: values.email } });
        } else {
            messageApi.open({
                type: 'error',
                content: result?.message || 'Đăng ký thất bại',
            });
        }
    };

    const linkToLogin = () => {
        navigate("/login");
    }

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
        types: {
            email: '${label} không đúng định dạng!'
        },
    };

    return (
        <div className='over'>
            {contextHolder}
            <div className='container__set'>
                <div className='pt-4' style={{ width: '360px', margin: '0 auto', marginTop: "70px", transform: 'scale(1.2)' }}>
                    <p className='text-xl font-bold'>Đăng ký</p>
                    <p style={{ fontSize: "14px", padding: "5px 0" }}>Dùng ít nhất 10 ký tự, trong đó có chữ hoa, chữ thường và số</p>
                    <Form
                        {...layout}
                        name="nest-messages"
                        layout='vertical'
                        style={{ width: 360 }}
                        onFinish={onFinish}
                        validateMessages={validateMessages}
                    >
                        <Form.Item
                            name='userName'
                            label="User Name"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name='email'
                            label="Email"
                            rules={[
                                {
                                    required: true,
                                    type: 'email',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Mời nhập mật khẩu',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            label="Confirm Password"
                            name="confirm pass"
                            rules={[
                                {
                                    required: true,
                                    message: 'Mời nhập mật khẩu',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{ width: "100%", fontWeight: 500, borderRadius: '4px', height: '45px', marginTop: "20px"}}
                                loading={loading} 
                            >
                                Đăng ký tài khoản
                            </Button>
                        </Form.Item>
                    </Form>
                    <p style={{ textAlign: "center" }}>Đã có tài khoản? <span style={{ color: '#1677ff', cursor: 'pointer' }} onClick={linkToLogin}>Đăng nhập</span></p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
