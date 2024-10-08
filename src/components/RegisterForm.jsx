import React, { useState } from 'react';

function RegisterForm({ switchForm }) {
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    login: '',
    password: ''
  });

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value
    });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    
    console.log('Register Data:', registerData);
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
      <button type="submit">Зарегистрироваться</button>
      <p>
        Уже есть аккаунт? <span onClick={() => switchForm('login')} style={{ cursor: 'pointer', color: 'blue' }}>Войти</span>
      </p>
    </form>
  );
}

export default RegisterForm;
