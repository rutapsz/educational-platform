import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [topicContent, setTopicContent] = useState('');

  // Получение всех курсов
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/courses/');
        setCourses(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке курсов', error);
      }
    };
    fetchCourses();
  }, []);

  // Получение топиков для выбранного курса
  const fetchTopics = async (courseId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/topics/?course=${courseId}`);
      setTopics(response.data);
      setSelectedCourseId(courseId);
      setSelectedTopicId(null);
      setTopicContent(''); // Сброс содержимого топика
    } catch (error) {
      console.error('Ошибка при загрузке топиков', error);
    }
  };

  // Получение содержимого выбранного топика
  const fetchTopicContent = async (topicId) => {
    try {
      const topic = topics.find((t) => t.id === topicId);
      setSelectedTopicId(topicId);
      setTopicContent(topic ? topic.data_ref : '');
    } catch (error) {
      console.error('Ошибка при загрузке содержимого топика', error);
    }
  };

  return (
    <div>
      <h1>Курсы</h1>
      <div>
        {courses.map((course) => (
          <button key={course.id} onClick={() => fetchTopics(course.id)}>
            {course.name}
          </button>
        ))}
      </div>

      {selectedCourseId && (
        <div>
          <h2>Топики</h2>
          <ul>
            {topics.map((topic) => (
              <li key={topic.id}>
                <button onClick={() => fetchTopicContent(topic.id)}>
                  {topic.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedTopicId && (
        <div>
          <h3>Содержимое топика</h3>
          <div dangerouslySetInnerHTML={{ __html: topicContent }}></div>
        </div>
      )}
    </div>
  );
};

export default CoursePage;
