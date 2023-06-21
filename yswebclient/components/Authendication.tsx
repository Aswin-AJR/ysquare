/**
 * @CreatedBy        : Aswin Joseph Raj
 * @CreatedTime      : June 20 2022
 * @Description      : Login component for handling login form
 **/
import axios from 'axios';
import React, { useState } from 'react';
import { message } from 'antd';


function Login(props: any) {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();


    const handleSubmit = async (event: React.FormEvent) => {
        setIsLoading(true)
        event.preventDefault();
        let queryObject = {
            "filter": {
                "email": formData.email
            },
            "limit": 1,
            "page": 0,
            "sort": {}
        }
        const response = await axios.post('http://localhost:3100/api/ysquare/readuser', queryObject)
        const CustomerResponce = await axios.post('http://localhost:3100/api/ysquare/readcustomer', queryObject)
        if (response?.data?.status === 200 && response?.data?.output[0]?.password === formData?.password) {
            setIsLoading(false)
            props?.handleRoute(response?.data?.output[0])
        } else if (CustomerResponce?.data?.status === 200 && CustomerResponce?.data?.output[0]?.password === formData?.password) {
            setIsLoading(false)
            props?.handleRoute(CustomerResponce?.data?.output[0])
        }
        else {
            message.error({
                content: "Email or password mismatches",
                duration: 3,
            })
        }
        setIsLoading(false)

    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    return (
        <div className="login-page-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-title">YSquare Login</h2>
                <input
                    className="login-input"
                    type="text"
                    name="email"
                    placeholder="email"
                    value={formData.email}
                    onChange={handleInputChange}
                />
                <input
                    className="login-input"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                />
                <button className="login-button" type="submit" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Login'}
                </button>
            </form>
        </div>
    );
}

export default Login;
