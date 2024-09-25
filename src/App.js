import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import RegisterForm from './components/RegisterForm'; // Импорт формы регистрации
import WelcomePage from './pages/WelcomePage'; // Импорт страницы приветствия

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/register" element={<RegisterForm />} /> {/* Маршрут для формы регистрации */}
        <Route path="/welcome" element={<WelcomePage />} /> {/* Маршрут для страницы приветствия */}
      </Routes>
    </Router>
  );
};

export default App;


