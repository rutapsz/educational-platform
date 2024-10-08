import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddCourse.css';
import TextEditor from '../components/TextEditor';

const AddCourse = ({ addCourse }) => {
  const [courseTitle, setCourseTitle] = useState('');
  const [topics, setTopics] = useState([{ title: '', sections: [{ title: '', text: '' }] }]);
  const navigate = useNavigate();

  const handleCourseSubmit = (e) => {
    e.preventDefault();
    const newCourse = {
      id: Math.random(),
      title: courseTitle,
      topics,
    };
    addCourse(newCourse);
    navigate('/courses');
  };

  const handleAddTopic = () => {
    setTopics([...topics, { title: '', sections: [{ title: '', text: '' }] }]);
  };

  const handleAddSection = (topicIndex) => {
    const updatedTopics = [...topics];
    updatedTopics[topicIndex].sections.push({ title: '', text: '' });
    setTopics(updatedTopics);
  };

  const handleTopicChange = (topicIndex, e) => {
    const updatedTopics = [...topics];
    updatedTopics[topicIndex].title = e.target.value;
    setTopics(updatedTopics);
  };

  const handleSectionChange = (topicIndex, sectionIndex, field, value) => {
    const updatedTopics = [...topics];
    updatedTopics[topicIndex].sections[sectionIndex][field] = value;
    setTopics(updatedTopics);
  };

  const handleDeleteTopic = (topicIndex) => {
    const updatedTopics = topics.filter((_, index) => index !== topicIndex);
    setTopics(updatedTopics);
  };

  const handleDeleteSection = (topicIndex, sectionIndex) => {
    const updatedTopics = [...topics];
    updatedTopics[topicIndex].sections = updatedTopics[topicIndex].sections.filter((_, index) => index !== sectionIndex);
    setTopics(updatedTopics);
  };

  return (
    <div className="add-course-container">
      <h2>Создание нового курса</h2>
      <form onSubmit={handleCourseSubmit}>
        <div className="form-group">
          <label htmlFor="courseTitle">Название курса</label>
          <input
            type="text"
            id="courseTitle"
            className="input-field"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            required
            placeholder="Введите название курса"
          />
        </div>

        {topics.map((topic, topicIndex) => (
          <div key={topicIndex} className="topic-section">
            <label htmlFor={`topic-${topicIndex}`}>Тема {topicIndex + 1}</label>
            <input
              type="text"
              id={`topic-${topicIndex}`}
              className="input-field"
              value={topic.title}
              onChange={(e) => handleTopicChange(topicIndex, e)}
              required
              placeholder="Введите название темы"
            />
            <button type="button" className="gray-button delete-button" onClick={() => handleDeleteTopic(topicIndex)}>
              Удалить тему
            </button>

            {topic.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="section-editor">
                <label>Раздел {sectionIndex + 1}</label>
                <input
                  type="text"
                  className="input-field"
                  value={section.title}
                  onChange={(e) => handleSectionChange(topicIndex, sectionIndex, 'title', e.target.value)}
                  required
                  placeholder="Введите название раздела"
                />
                <TextEditor
                  initialValue={section.text}
                  onChange={(content) => handleSectionChange(topicIndex, sectionIndex, 'text', content)}
                />
                <button
                  type="button"
                  className="gray-button delete-button"
                  onClick={() => handleDeleteSection(topicIndex, sectionIndex)}
                >
                  Удалить раздел
                </button>
              </div>
            ))}
            <button
              type="button"
              className="gray-button add-section-button"
              onClick={() => handleAddSection(topicIndex)}
            >
              Добавить раздел
            </button>
          </div>
        ))}
        <button type="button" className="gray-button add-topic-button" onClick={handleAddTopic}>
          Добавить тему
        </button>
        <button type="submit" className="create-course-button">
          Создать курс
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
