import React, { useState } from 'react';
import axios from 'axios';

function RegisterForm({ switchForm }) {
  const [registerData, setRegisterData] = useState({
    login: '',
    password: '',
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
          login: registerData.login,
          password: registerData.password,
          email: registerData.email,
          role: 'user', 
          token: null,
          seance: null
        }),
      });
  
      if (response.ok) {
        console.log('User registered successfully');
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
          name="login"
          value={registerData.login}
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
