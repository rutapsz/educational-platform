import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import RegisterForm from './components/RegisterForm';
import AddCourse from './pages/AddCourse';
import AddTest from './pages/AddTest';
import CoursePage from './pages/CoursePage';
import Profile from './pages/Profile';
import AuthForm from './components/AuthForm';
import LoginForm from './components/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';
import { convertToRaw, ContentState } from 'draft-js';
import './App.css';
import axios from "axios";


const App = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showModal, setShowModal] = useState(false);


  const openModal = (formType) => {
    setShowRegister(formType === 'register');
    setShowModal(true);
  };


  const closeModal = () => {
    setShowModal(false);
  };

  const switchForm = (formType) => {
    setShowRegister(formType === 'register');
  };

  return (
    <Router>
      <Header openModal={openModal} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-course" element={<AddCourse />} />
        <Route path="/add-test" element={<AddTest />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/course/:id" element={<CoursePage />} />
      </Routes>
      <Footer />
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>×</button>
            {showRegister ? <RegisterForm switchForm={switchForm} /> : <LoginForm switchForm={switchForm} />}
          </div>
        </div>
      )}
    </Router>
  );
};

export default App;
