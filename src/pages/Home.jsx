import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import client from "../components/requests";

const Home = ({openModal}) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await client.get('/api/base/courses/');
        console.log(response)
        setCourses(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке курсов', error);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="home-container">
      <h1>Курсы</h1>
      <div className="course-grid">
        {courses.map((course) => (
          <div className="course-card" key={course.id}>
            <h2>{course.name}</h2>
            <p>{course.main_info}</p>
            { localStorage.getItem('username') ?
                (<Link to={`/course/${course.id}`} className="view-course-button">
                  Зайти на курс
                </Link>) : (
                    <span onClick={() => openModal('register')} className="view-course-button">Зайти на курс</span>
                )
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
