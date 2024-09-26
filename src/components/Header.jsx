import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <>
    <header>
    {/* <div class="logo">Название</div> */}
    <nav> 
      <ul class="menu">
        <li>
          <Link to="/">Логотип с названием</Link>
        </li>
        <li>
          <Link to="/courses">Курсы</Link>
        </li>
      </ul>
      <ul class="authorization">
        <li>
          <Link to="/signup">Регистрация</Link>
        </li>
        <li>
          <Link to="/login">Вход</Link>
        </li>
      </ul>
    </nav>
    </header>
    </>
    
  );
};

export default Header;
