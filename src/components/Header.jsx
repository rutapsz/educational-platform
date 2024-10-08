import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ openModal }) => {
  return (
    <header>
      <nav>
        <ul className="menu">
          <li>
            <Link to="/">Логотип с названием</Link>
          </li>
          <li>
            <Link to="/courses">Курсы</Link>
          </li>
          <li>
            <Link to="/test">Страница для тестов</Link>
          </li>
          <li>
            <Link to="/add-course">Изменить курсы</Link>
          </li>
        </ul>
        <ul className="authorization">
          <li>
            <Link to="/profile">Профиль</Link>
          </li>
          <li>
            <span onClick={() => openModal('register')} style={{ cursor: 'pointer' }}>Регистрация</span>
          </li>
          <li>
            <span onClick={() => openModal('login')} style={{ cursor: 'pointer' }}>Вход</span>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
