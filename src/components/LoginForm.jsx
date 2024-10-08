import React, { useState } from 'react';

function LoginForm({ switchForm }) {
  const [loginData, setLoginData] = useState({
    login: '',
    password: ''
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    
    console.log('Login Data:', loginData);
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
        />
      </div>
      <div>
        <label>Пароль:</label>
        <input
          type="password"
          name="password"
          value={loginData.password}
          onChange={handleLoginChange}
        />
      </div>
      <button type="submit">Войти</button>
      <p>
        Нет аккаунта? <span onClick={() => switchForm('register')} style={{ cursor: 'pointer', color: 'blue' }}>Зарегистрироваться</span>
      </p>
    </form>
  );
}

export default LoginForm;
