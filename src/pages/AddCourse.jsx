import React, { useState, useEffect } from 'react';
import './AddCourse.css';
import client from "../components/requests";

const AddCourse = () => {
  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [topicName, setTopicName] = useState('');
  const [moduleNumber, setModuleNumber] = useState('');
  const [position, setPosition] = useState('');
  const [dataRef, setDataRef] = useState('');
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Получение списка курсов
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await client.get('http://localhost:8000/api/courses/',
          {withCredentials: true});
        setCourses(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке курсов', error);
      }
    };
    fetchCourses();
  }, []);

  // Получение топиков по курсу
  const fetchTopics = async (courseId) => {
    try {
      const response = await client.get(`http://localhost:8000/api/topics/?course=${courseId}`,
          {withCredentials: true});
      setTopics(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке топиков', error);
    }
  };

  // Заполнение формы для редактирования курса
  const handleEditCourse = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      setSelectedCourseId(course.id);
      setCourseName(course.name);
      setCourseDescription(course.main_info);
      setIsEditingCourse(true);
      fetchTopics(courseId);
    }
  };

  // Обработка создания или редактирования курса
  const handleCourseSubmit = async (e) => {
    e.preventDefault();

    const updatedCourse = {
      name: courseName,
      main_info: courseDescription,
    };

    try {
      if (isEditingCourse) {
        await client.put(`http://localhost:8000/api/courses/${selectedCourseId}/`, updatedCourse,
          {withCredentials: true});
        setSuccessMessage('Курс успешно обновлен!');
      } else {
        const response = await client.post('http://localhost:8000/api/courses/', updatedCourse,
          {withCredentials: true});
        setSelectedCourseId(response.data.id);
        setSuccessMessage('Курс успешно создан!');
      }
      const updatedCourses = await client.get('http://localhost:8000/api/courses/',
          {withCredentials: true});
      setCourses(updatedCourses.data);
      setIsEditingCourse(false);
    } catch (error) {
      console.error('Ошибка при отправке данных курса', error);
    }
  };

  // Заполнение формы для редактирования топика
  const handleEditTopic = (topicId) => {
    const topic = topics.find((t) => t.id === topicId);
    if (topic) {
      setSelectedTopicId(topic.id);
      setTopicName(topic.name);
      setModuleNumber(topic.module);
      setPosition(topic.position);
      setDataRef(topic.data_ref);
      setIsEditingTopic(true);
    }
  };

  // Обработка создания или редактирования топика
  const handleTopicSubmit = async (e) => {
    e.preventDefault();

    const updatedTopic = {
      course: selectedCourseId,
      name: topicName,
      module: moduleNumber,
      position: position,
      data_ref: dataRef,
    };

    try {
      if (isEditingTopic) {
        await client.put(`http://localhost:8000/api/topics/${selectedTopicId}/`, updatedTopic, {withCredentials: true});
        setSuccessMessage('Топик успешно обновлен!');
      } else {
        await client.post('http://localhost:8000/api/topics/', updatedTopic,
            {withCredentials: true});
        setSuccessMessage('Топик успешно создан!');
      }

      fetchTopics(selectedCourseId);
      setIsEditingTopic(false);

      // Сброс формы
      setTopicName('');
      setModuleNumber('');
      setPosition('');
      setDataRef('');
      setSelectedTopicId(null);
    } catch (error) {
      console.error('Ошибка при отправке данных топика', error);
    }
  };

  // Удаление курса
  const handleDeleteCourse = async (courseId) => {
    try {
      await client.delete(`http://localhost:8000/api/courses/${courseId}/`,
          {withCredentials: true});
      setSuccessMessage('Курс успешно удален!');
      const updatedCourses = await client.get('http://localhost:8000/api/courses/',
          {withCredentials: true});
      setCourses(updatedCourses.data);
      setSelectedCourseId(null);
      setTopics([]);
    } catch (error) {
      console.error('Ошибка при удалении курса', error);
    }
  };

  // Удаление топика
  const handleDeleteTopic = async (topicId) => {
    try {
      await client.delete(`http://localhost:8000/api/topics/${topicId}/`,
            {withCredentials: true});
      setSuccessMessage('Топик успешно удален!');
      fetchTopics(selectedCourseId);
    } catch (error) {
      console.error('Ошибка при удалении топика', error);
    }
  };

  return (
    <div className="add-course-container">
      <h1>{isEditingCourse ? 'Редактировать курс' : 'Создать новый курс'}</h1>
      <form onSubmit={handleCourseSubmit} className="add-course-form">
        <div>
          <label>Название курса</label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Описание курса</label>
          <textarea
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">{isEditingCourse ? 'Обновить курс' : 'Создать курс'}</button>
      </form>

      {selectedCourseId && (
        <>
          <h2>{isEditingTopic ? 'Редактировать топик' : 'Создать новый топик'}</h2>
          <form onSubmit={handleTopicSubmit} className="add-topic-form">
            <div>
              <label>Название топика</label>
              <input
                type="text"
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Номер модуля</label>
              <input
                type="number"
                value={moduleNumber}
                onChange={(e) => setModuleNumber(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Позиция</label>
              <input
                type="number"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Содержимое (data_ref)</label>
              <textarea
                value={dataRef}
                onChange={(e) => setDataRef(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit">{isEditingTopic ? 'Обновить топик' : 'Создать топик'}</button>
          </form>

          <div className="topic-list">
            <h2>Список топиков</h2>
            <ul>
              {topics.map((topic) => (
                <li key={topic.id}>
                  <span>{topic.name}</span>
                  <button onClick={() => handleEditTopic(topic.id)}>Редактировать</button>
                  <button onClick={() => handleDeleteTopic(topic.id)}>Удалить</button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <div className="course-list">
        <h2>Список курсов</h2>
        <ul>
          {courses.map((course) => (
            <li key={course.id}>
              <span>{course.name}</span>
              <button onClick={() => handleEditCourse(course.id)}>Редактировать</button>
              <button onClick={() => handleDeleteCourse(course.id)}>Удалить</button>
            </li>
          ))}
        </ul>
      </div>

      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default AddCourse;
