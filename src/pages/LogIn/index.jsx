import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, message } from 'antd';
import { login } from '../../api/api.js';
import Cookies from 'js-cookie';

const LogIn = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false); // Thêm trạng thái loading


	const onFinish = async (values) => {
        setLoading(true); // Bắt đầu loading
		var dataLogin = {
			username: values?.userName,
			password: values?.password,
			grant_type: 'password'
		}
		await login(dataLogin).then(result => {
			if (result?.status === 200) {
				message.success('Đăng nhập thành công');
				Cookies.set('dataLogin', JSON.stringify(result?.data))
				console.log('login');

				if (result?.data?.user_kind === 2) {
					navigate("/admin")
				} else {
					navigate("/")
				}
			} else {
				messageApi.open({
					type: 'error',
					content: 'Kiểm tra lại tài khoản và mật khẩu',
				});
			}
		})
        setLoading(false); // Kết thúc loading

	};
	const linkToSignUp = () => {
		navigate("/signup")
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
    };

    return (
        <div className='over'>
            {contextHolder}
            <div className='container__set' style={{ marginTop: '90px' }}>
                <div className='pt-4' style={{ width: '360px', margin: '0 auto', transform: 'scale(1.2)' }}>
                    <p className='text-xl font-bold' style={{ marginBottom: "25px" }}>Đăng nhập hoặc tạo tài khoản</p>
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
                            style={{ fontWeight: 450 }}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            style={{ fontWeight: 450 }}
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
                            <Button type="primary" htmlType="submit" style={{ width: "100%", fontWeight: 500, borderRadius: '4px', height: '45px' }} loading={loading}>
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>
                    <p style={{ textAlign: "center" }}>Chưa có tài khoản? <span style={{ color: '#1677ff', cursor: 'pointer' }} onClick={linkToSignUp}>Đăng ký</span></p>
                </div>
            </div>
        </div>
    );
};

export default LogIn;
