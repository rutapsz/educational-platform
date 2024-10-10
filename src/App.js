import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import RegisterForm from './components/RegisterForm';
import WelcomePage from './pages/WelcomePage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AddCourse from './pages/AddCourse';
import CoursePage from './pages/CoursePage';
import Profile from './pages/Profile';
import AuthForm from './components/AuthForm';
import LoginForm from './components/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';
import { convertToRaw, ContentState } from 'draft-js';
import './App.css';

const App = () => {
  const [token, setToken] = useState(null);

  
  const rawEditorState1 = convertToRaw(ContentState.createFromText('Правообладатель – человек или организация, которые могут без ограничений распоряжаться и пользоваться приложением, а также вносить в него изменения и ограничивать его для использования.'));
  const rawEditorState2 = convertToRaw(ContentState.createFromText('С приложениями для мобильных устройств и ПК сталкивается каждый человек. Мы скачиваем банковские приложения, приложения для оказания госуслуг, игры. Устанавливая приложение, мы далеко не всегда знаем, можно ли его отправлять другу или коллеге и делаем это, не задумываясь о последствиях. Давайте разберемся, как использовать программу безопасно для себя.'));
  const rawEditorState3 = convertToRaw(ContentState.createFromText('Современные приложения работают для пользователя «из коробки». Так, алгоритм использования приложения сводится к следующему: скачать, открыть, потребить все полезные свой	ства приложения. При таком алгоритме опасность для пользователя сводится к минимуму.'));
  const rawEditorState4 = convertToRaw(ContentState.createFromText('Для пользователя было бы замечательно, если приложения продавались бы как вещи на рынке, но на деле так не работает. Купить приложение нельзя, можно приобрести право на его использование по лицензионному договору (п.1 ст. 1235 ГК РФ).'));

  const [courses, setCourses] = useState([
    {
      id: 1,
      title: 'Авторское право',
      description: 'Краткое описание курса по авторскому праву',
      topics: [
        {
          title: 'Как копировать приложения?',
          sections: [
            { title: 'Словарь терминов', text: JSON.stringify(rawEditorState1) },
            { title: 'Зачем читать пользовательское соглашение?', text: JSON.stringify(rawEditorState2) },
            { title: 'Можно ли создавать копии приложений?', text: JSON.stringify(rawEditorState3) },
            { title: 'Как передать приложение иному лицу?', text: JSON.stringify(rawEditorState4) },
          ],
        },
        {
          title: 'Тема 2',
          sections: [
            { title: 'раздел 1', text: JSON.stringify("1") },
          ]
        },
        {
          title: 'Тема 3',
          sections: [
            { title: 'раздел 1', text: JSON.stringify("2") },
          ],
        }
      ],
    },
  ]);

  const addCourse = (newCourse) => {
    console.log('Adding course:', newCourse);
    setCourses(prevCourses => [...prevCourses, newCourse]);
  };

  const editCourse = (updatedCourse) => {
    console.log('Editing course:', updatedCourse);
    setCourses(prevCourses => prevCourses.map(course => course.id === updatedCourse.id ? updatedCourse : course));
  };

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
        
        <Route path="/" element={<Home courses={courses} />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses courses={courses} />} />
        <Route path="/add-course" element={<AddCourse addCourse={addCourse} editCourse={editCourse} courses={courses} />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/profile" element={<WelcomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/course/:id" element={<CoursePage courses={courses} />} />
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
