import React from 'react';
import { Link } from 'react-router-dom';

const Courses = ({ courses }) => {
  console.log('Courses in Courses component:', courses);

  return (
    <div>
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            <Link to={`/course/${course.id}`}>{course.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Courses;
