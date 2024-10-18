import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import axios from "axios";
import logo from './logo.png';

const Header = ({ openModal }) => {

  const handleLogout =  () => {
    axios.post("http://localhost:8000/api/logout_user/",
        {},
        {
          withCredentials: true,
          withXSRFToken: true,
        }).then(res => {
        localStorage.setItem('username', '');
        localStorage.setItem('staff', '');
        window.location.replace('http://localhost:3000/');
        }).catch(error => {
            localStorage.setItem('username', '');
            localStorage.setItem('staff', '');
            window.location.replace('http://localhost:3000/');
        });
  };
  console.log(localStorage.getItem('username'));
  return (
    <header>
      <nav>
        <ul className="menu">
          <li>
            <Link to="/">
              <img src={logo} alt="Логотип" style={{ width: '25vh', height: 'auto' }} />
            </Link>
          </li>
          {/* <li>
            <Link to="/">Авторика</Link>
          </li> */}
          {localStorage.getItem('staff') === 'true' ? (
          <li className="authorization">
            <Link className="auth-button" to="/add-course">Изменить курсы</Link>

            <Link className="auth-button" to="/add-test">Изменить тесты</Link>
        </li> ) : (<li></li>)}
        </ul>
        <ul className="authorization">
          {localStorage.getItem('username') ? (
            <>
              <li>
                <Link to="/profile" className="auth-button">Профиль</Link>
              </li>
              <li>
                <span onClick={handleLogout} className="auth-button">Выход</span>
              </li>
            </>
          ) : (
            <>
              <li>
                <span onClick={() => openModal('register')} className="auth-button">Регистрация</span>
              </li>
              <li>
                <span onClick={() => openModal('login')} className="auth-button">Вход</span>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
