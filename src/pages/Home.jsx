import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/courses/');
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
            <Link to={`/course/${course.id}`} className="view-course-button">
              Зайти на курс
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
