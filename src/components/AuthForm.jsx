import React from 'react';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import './AuthForm.css';

function AuthForm({ showRegister, closeModal, switchForm }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>&times;</button>
        {showRegister ? <RegisterForm switchForm={switchForm} /> : <LoginForm switchForm={switchForm} />}
      </div>
    </div>
  );
}

export default AuthForm;
