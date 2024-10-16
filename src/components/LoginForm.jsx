import React, { useState } from 'react';
import axios from 'axios';
import getCookie from './cookie'

const client = axios.create({
  baseURL: "http://localhost:8000"
})

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
    setErrorMessage('');
    console.log('-----');
    await client.post("/api/login_user/",
        {
            username: loginData.login,
            password: loginData.password,
        }, {
            withCredentials: true,
        }).then(res => {
            localStorage.setItem('userid', res.data.id);
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('staff', res.data.staff);
            window.location.reload();
        }).catch(error => {
            setErrorMessage('Введены не корректные логин и пароль');
    }) ;
    console.log(getCookie('csrftoken'));
    console.log('-----');
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
