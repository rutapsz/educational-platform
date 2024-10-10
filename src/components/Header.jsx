import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ openModal }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    setIsAuthenticated(!!accessToken);
  }, []);

  const handleLogout = () => {
    // Удаляем токены из localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    window.location.reload();
  };

  return (
    <header>
      <nav>
        <ul className="menu">
          <li>
            <Link to="/">Лого Право Творчества</Link>
          </li>
          <li>
            <Link to="/add-course">Изменить курсы</Link>
          </li>
        </ul>
        <ul className="authorization">
          {isAuthenticated ? (
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
