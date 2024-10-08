import React from 'react';
import './Home.css'; // Create a CSS file for grid styles
import { Link } from 'react-router-dom';

const Home = ({ courses = [] }) => {
  return (
    <div className="courses-container">
      <h1>Информация о сайте</h1>
      <h1>Курсы</h1>
      <div className="courses-grid">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div key={course.id} className="course-card">
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <Link to={`/course/${course.id}`}>Посмотреть курс</Link>
            </div>
          ))
        ) : (
          <p>No courses available</p>
        )}
      </div>
    </div>
  );
};

export default Home;
