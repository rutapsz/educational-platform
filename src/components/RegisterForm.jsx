import React, { useState } from 'react';
import axios from 'axios';



function RegisterForm({ switchForm }) {
  
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Register Data:', registerData);
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: registerData.login,
          password: registerData.password,
          email: registerData.email,
          role: 'user'
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
        <label>Имя:</label>
        <input
          type="text"
          name="firstName"
          value={registerData.firstName}
          onChange={handleRegisterChange}
        />
      </div>
      <div>
        <label>Фамилия:</label>
        <input
          type="text"
          name="lastName"
          value={registerData.lastName}
          onChange={handleRegisterChange}
        />
      </div>
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
