import React, { useState } from 'react';
import axios from 'axios';

function RegisterForm({ switchForm }) {
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
  });

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value,
    });
  };

  const getCSRFToken = () => {
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    return csrfToken;
  };
  
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Register Data:', registerData);
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken(),
        },
        body: JSON.stringify({
          username: registerData.username,
          password: registerData.password,
          first_name: registerData.first_name,
          last_name: registerData.last_name,
          email: registerData.email,
        }),
      });
  
      if (response.ok) {
        console.log('User registered successfully');
        try {
          const resp = await axios.post('http://127.0.0.1:8000/api/login/', {
            username: registerData.username,
            password: registerData.password
          });

          console.log(response);
          localStorage.setItem('access_token', response.data.access);
          localStorage.setItem('refresh_token', response.data.refresh);
          console.log(localStorage.getItem('access_tocken'));


          window.location.reload();
        } catch (error) {
          console.error('Ошибка при входе:', error.response?.data || error);
          setErrorMessage(error.response?.data?.error || 'Ошибка при входе');
        }
      } else {
        console.log('Registration failed:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <form onSubmit={handleRegisterSubmit} className="form">
      <h2>Регистрация</h2>
      <div>
        <label>Логин:</label>
        <input
          type="text"
          name="username"
          value={registerData.username}
          onChange={handleRegisterChange}
        />
      </div>
      <div>
        <label>Пароль:</label>
        <input
          type="password"
          name="password"
          value={registerData.password}
          onChange={handleRegisterChange}
        />
      </div>
            <div>
        <label>Фамилия:</label>
        <input
          type="text"
          name="last_name"
          value={registerData.last_name}
          onChange={handleRegisterChange}
        />
      </div>
            <div>
        <label>Имя:</label>
        <input
          type="text"
          name="first_name"
          value={registerData.first_name}
          onChange={handleRegisterChange}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={registerData.email}
          onChange={handleRegisterChange}
        />
      </div>
      <button type="submit">Зарегистрироваться</button>
      <p>
        Уже есть аккаунт?{' '}
        <span onClick={() => switchForm('login')} style={{ cursor: 'pointer', color: 'blue' }}>
          Войти
        </span>
      </p>
    </form>
  );
}

export default RegisterForm;
