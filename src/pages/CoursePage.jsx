import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CoursePage.css';

const CoursePage = () => {
  const { id } = useParams();
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [courseName, setCourseName] = useState('');

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        // загружаем название курса
        const courseResponse = await axios.get(`http://localhost:8000/api/courses/${id}/`);
        setCourseName(courseResponse.data.name);

        // загружаем топики курса
        const topicsResponse = await axios.get(`http://localhost:8000/api/topics/?course=${id}`);
        setTopics(topicsResponse.data);
        
        // первый топик выбранн по умолчанию
        if (topicsResponse.data.length > 0) {
          setSelectedTopic(topicsResponse.data[0]);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных', error);
      }
    };
    fetchTopics();
  }, [id]);

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  // Сортировка топиков по номеру модуля и позиции
  const sortedTopics = topics.sort((a, b) => {
    if (a.module === b.module) {
      return a.position - b.position;
    }
    return a.module - b.module;
  });

  // Группировка топиков по модулям
  const groupedTopics = sortedTopics.reduce((groups, topic) => {
    const { module } = topic;
    if (!groups[module]) {
      groups[module] = [];
    }
    groups[module].push(topic);
    return groups;
  }, {});

  return (
    <div className="course-page-container">
      <div className="topics-navigation">
        <h2>Темы курса: {courseName}</h2> {/* Добавлено имя курса */}
        {Object.keys(groupedTopics).map((module) => (
          <div key={module}>
            <h3>Модуль {module}</h3>
            <ul>
              {groupedTopics[module].map((topic) => (
                <li
                  key={topic.id}
                  onClick={() => handleTopicSelect(topic)}
                  className={selectedTopic?.id === topic.id ? 'active' : ''}
                >
                  {topic.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="topic-content">
        {selectedTopic && (
          <div dangerouslySetInnerHTML={{ __html: selectedTopic.data_ref }} />
        )}
      </div>
    </div>
  );
};

export default CoursePage;
