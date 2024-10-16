import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import axios from "axios";

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
            <Link to="/">Лого Право Творчества</Link>
          </li>
          {localStorage.getItem('staff') === 'true' ? (
          <li>
            <Link to="/add-course">Изменить курсы</Link>
          </li> ) : (<li></li>)}
        </ul>
        <ul className="authorization">
          {localStorage.getItem('username') ? (
            <>
              <li>
                <Link to="/profile">Профиль</Link>
              </li>
              <li>
                <span onClick={handleLogout} style={{ cursor: 'pointer' }}>Выход</span>
              </li>
            </>
          ) : (
            <>
              <li>
                <span onClick={() => openModal('register')} style={{ cursor: 'pointer' }}>Регистрация</span>
              </li>
              <li>
                <span onClick={() => openModal('login')} style={{ cursor: 'pointer' }}>Вход</span>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
