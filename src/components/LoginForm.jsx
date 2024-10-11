import React, { useState } from 'react';
import axios from 'axios';

function LoginForm({ switchForm }) {
  const [loginData, setLoginData] = useState({
    login: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', {
        username: loginData.login,
        password: loginData.password
      });

      console.log(response.data);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      console.log(localStorage.getItem('access_tocken'));


      window.location.reload();
    } catch (error) {
      console.error('Ошибка при входе:', error.response?.data || error);
      setErrorMessage(error.response?.data?.error || 'Ошибка при входе');
    }
  };

  return (
    <form onSubmit={handleLoginSubmit} className="form">
      <h2>Вход</h2>
      <div>
        <label>Логин:</label>
        <input
          type="text"
          name="login"
          value={loginData.login}
          onChange={handleLoginChange}
          required
        />
      </div>
      <div>
        <label>Пароль:</label>
        <input
          type="password"
          name="password"
          value={loginData.password}
          onChange={handleLoginChange}
          required
        />
      </div>
      <button type="submit">Войти</button>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <p>
        Нет аккаунта?{' '}
        <span onClick={() => switchForm('register')} style={{ cursor: 'pointer', color: 'blue' }}>
          Зарегистрироваться
        </span>
      </p>
    </form>
  );
}

export default LoginForm;
