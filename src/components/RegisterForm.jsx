import React, { useState } from 'react';
import axios from 'axios';
import client from "./requests";
import './RegisterForm.css';

function RegisterForm({ switchForm, courseId = false}) {
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);

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
  
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Register Data:', registerData);

    client.post('/api/registration/', {
          userid: registerData.id,
          username: registerData.username,
          password: registerData.password,
          first_name: registerData.first_name,
          last_name: registerData.last_name,
          email: registerData.email,
        }, {
          withCredentials: true
      }).then(res => {
          console.log('User registered successfully');
          client.post('/api/login_user/', {
            username: registerData.username,
            password: registerData.password
          }).then(resp => {
              localStorage.setItem('userid', resp.data.userid);
              localStorage.setItem('username', resp.data.username);
              localStorage.setItem('staff', resp.data.staff);
              if (courseId) {
                  window.location.href = `/course/${courseId}`;
              } else {
                  window.location.reload();
        }
          }).catch(error => {
              console.error('Ошибка при входе:', error.resp?.data || error);
          });
      }).catch(error => {console.log('Registration failed:', error);})}


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
      <div className="checkbox-container">
        <input
          type="checkbox"
          id="terms"
          checked={isTermsChecked}
          onChange={(e) => setIsTermsChecked(e.target.checked)}
        />
        <label htmlFor="terms">
          Я принимаю <a href="./Пользовательское соглашение.pdf" target="_blank" rel="noopener noreferrer">Пользовательское соглашение</a>
        </label>
      </div>
      <div className="checkbox-container">
          <input
            type="checkbox"
            id="privacy"
            checked={isPrivacyChecked}
            onChange={(e) => setIsPrivacyChecked(e.target.checked)}
          />
          <label htmlFor="privacy">
            Я принимаю <a href="./Согласие на обработку ПД.pdf" target="_blank" rel="noopener noreferrer">Согласие на обработку персональных данных</a>
          </label>
        </div>

        <button
          type="submit"
          disabled={!isTermsChecked || !isPrivacyChecked}
          style={{ marginTop: '10px' }}
        >
          Зарегистрироваться
        </button>
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
