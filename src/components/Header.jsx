import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import './Avatar.css';
import axios from "axios";
import logo from './logo.png';

const Header = ({ openModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    axios.post(process.env.REACT_APP_LINK + ':' + process.env.REACT_APP_BACK + "/api/logout_user/",
      {},
      {
        withCredentials: true,
        withXSRFToken: true,
      }).then(res => {
        localStorage.setItem('username', '');
        localStorage.setItem('staff', '');
        window.location.replace(process.env.REACT_APP_LINK + ':' + process.env.REACT_APP_FRONT);
      }).catch(error => {
        localStorage.setItem('username', '');
        localStorage.setItem('staff', '');
        window.location.replace(process.env.REACT_APP_LINK + ':' + process.env.REACT_APP_FRONT);
      });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <div className="logo-container">
        <Link to="/">
          <img src={logo} alt="Логотип" style={{ width: '25vh', height: 'auto' }} />
        </Link>
      </div>
      <nav>
        <ul className={`menu ${isMenuOpen ? 'show' : ''}`}>
          {localStorage.getItem('staff') === 'true' ? (
            <>
              <li>
                <Link className="auth-button" to="/add-course">Изменить курсы</Link>
              </li>
              <li>
                <Link className="auth-button" to="/add-test">Изменить тесты</Link>
              </li>
            </>
          ) : null}
        </ul>
        <ul className={`authorization ${isMenuOpen ? 'show' : ''}`}>
          {localStorage.getItem('username') ? (
            <>
              <li>
                <Link to="/profile" className="auth-button">
                  {/* <Avatar userName={localStorage.getItem('username')} /> */}
                  Профиль
                </Link>
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
      <div className="mobile-menu-icon" onClick={toggleMenu}>
        <span className="menu-icon">&#9776;</span>
      </div>
    </header>
  );
};

export default Header;
