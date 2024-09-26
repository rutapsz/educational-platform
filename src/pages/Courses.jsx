import React, { useState } from 'react';
import './Courses.css';

const coursesData = [
  { id: 1, title: 'Авторское право', description: 'текст про курс' },
  { id: 2, title: 'Защита прав на ПО', description: 'текст про курс' },
  { id: 3, title: 'Курс 3', description: 'Для красоты' },
];

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCourses = coursesData.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="courses-container">
      <input
        type="text"
        placeholder="Поиск по курсам..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
      <div className="courses-grid">
        {filteredCourses.map((course) => (
          <div key={course.id} className="course-card">
            <h2>{course.title}</h2>
            <p>{course.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
