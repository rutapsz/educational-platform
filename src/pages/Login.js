import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });

    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8000/auth/login/', credentials);
            if (res && res.data) {
                console.log('User logged in successfully:', res.data);
                localStorage.setItem('token', res.data.key);
                window.location.href = '/dashboard';
            } else {
                console.error('Login response is missing data');
                setErrorMessage('Login failed. Please try again.');
            }
        } catch (error) {
            setErrorMessage('Login failed. Please try again.');
            console.error('Error during login:', error.response ? error.response.data : error);
        }
    };
    

    return (
        <div>
            <h2>Login</h2>
            {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={credentials.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
