import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Авторика</p>
        <div className="footer-links">
        <a href="/Пользовательское соглашение.pdf" target="_blank" rel="noopener noreferrer">Пользовательское соглашение</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
