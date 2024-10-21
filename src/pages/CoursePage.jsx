import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './CoursePage.css';
import client from "../components/requests";

const CoursePage = () => {
  const { id } = useParams();
  const [topics, setTopics] = useState([]);
  const [tests, setTests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [userResponses, setUserResponses] = useState({});
  const [scores, setScores] = useState({});
  const [courseName, setCourseName] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultSuccess, setResultSuccess] = useState(false);
  const [readTopics, setReadTopics] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загружаем название курса
        const courseResponse = await client.get(`/api/courses/${id}/`);
        setCourseName(courseResponse.data.name);

        // Загружаем топики курса
        const topicsResponse = await client.get(`/api/topics/?course=${id}`);
        setTopics(topicsResponse.data);

        // Загружаем тесты
        const testsResponse = await client.get(`/api/tests/?course=${id}`);
        setTests(testsResponse.data);

        // Загружаем вопросы
        const questionsResponse = await client.get('/api/questions/');
        setQuestions(questionsResponse.data);

        // Загружаем ответы
        const answersResponse = await client.get('/api/answers/');
        setAnswers(answersResponse.data);

        // // Устанавливаем первый топик по умолчанию, если он есть
        // if (topicsResponse.data.length > 0) {
        //   setSelectedTopic(topicsResponse.data[0]);
        // }
      } catch (error) {
        console.error('Ошибка при загрузке данных', error);
      }
    };
    fetchData();
  }, [id]);
  useEffect(() => {
    const fetchTestResults = async () => {
      const userId = localStorage.getItem('username');
      if (!userId) return;

      try {
        const resultsResponse = await client.get(`/api/testresults/?user=${userId}`);
        setTestResults(resultsResponse.data);
      } catch (error) {
        console.error('Ошибка при загрузке результатов тестов:', error);
      }
      
    };

    fetchTestResults();
  }, []);
  useEffect(() => {
    const fetchReadTopics = async () => {
      const userId = localStorage.getItem('username');
      if (!userId) return;
  
      try {
        const readTopicsResponse = await client.get(`/api/readtopics/?user=${userId}`);
        
        // Преобразуем данные в формат объекта { topicId: true }
        const readTopicsData = readTopicsResponse.data.reduce((acc, topicData) => {
          acc[topicData.topic] = true;  // Используем topic как ключ и ставим true, если прочитан
          return acc;
        }, {});
  
        // Логируем для проверки
        console.log('Прочитанные топики после преобразования:', readTopicsData);
        
        // Обновляем состояние с прочитанными топиками
        setReadTopics(readTopicsData);
      } catch (error) {
        console.error('Ошибка при загрузке прочитанных топиков:', error);
      }
    };
  
    fetchReadTopics();
  }, []);
  const countQuestionsForTest = (testId, questions) => {
    // Фильтруем вопросы, связанные с данным тестом
    const relatedQuestions = questions.filter(question => question.test === testId);
    // Возвращаем количество вопросов
    return relatedQuestions.length;
  };
  // Функция для проверки доступности модуля
  const isModuleAccessible = (module) => {
    const previousTest = tests.find(test => test.module === module - 1);
    if (!previousTest) return true; // Если нет предыдущего теста, разблокируем модуль
  
    const result = testResults.find(result => result.test === previousTest.id);
    if (!result) return false; // Если результата теста нет, блокируем модуль
  
    // Проверяем, что результат теста и количество вопросов существуют
    const correctScore = result.total_score || 0;
    const totalQuestions = countQuestionsForTest(previousTest.id, questions);
  
    // // Если в тесте нет вопросов, считаем, что тест не пройден
    // if (totalQuestions === 0) return false;
  
    // Рассчитываем процент прохождения
    const scorePercentage = (correctScore / totalQuestions) * 100;
  
    // Возвращаем доступность модуля только если процент >= 50
    return scorePercentage >= 50;
  };
  

  const markTopicAsRead = async (topicId, isRead) => {
    const userId = localStorage.getItem('username');
    if (!userId) return;

    try {
        if (isRead) {
            await client.post(`/api/readtopics/`, { user: userId, topic: topicId });
            setReadTopics((prev) => ({
                ...prev,
                [topicId]: true,
            }));
        } else {
            // Сначала находим id записи Readtopics
            const response = await client.get(`/api/readtopics/?user=${userId}&topic=${topicId}`);
            if (response.data.length > 0) {
                const readTopicId = response.data[0].id; // Получаем id записи

                await client.delete(`/api/readtopics/${readTopicId}/`); // Удаляем статус прочитанного
                setReadTopics((prev) => {
                    const updatedTopics = { ...prev };
                    delete updatedTopics[topicId]; // Удаляем топик из объекта
                    return updatedTopics;
                });
            } else {
                console.error('Запись Readtopics не найдена для удаления');
            }
        }
    } catch (error) {
        console.error('Ошибка при отметке топика как прочитанного или непрочитанного:', error);
    }
};

  const handleTopicSelect = async (topic) => {
    setSelectedTest(null);
    setSelectedTopic(topic);
  
  };
  
  const handleTestSelect = (test) => {
    setSelectedTopic(null);
    setSelectedTest(test);
  };

  const handleSubmit = async (e, testId) => {
    e.preventDefault();
    let correctCount = 0;
    let totalQuestions = 0;
  
    // Подсчёт правильных ответов
    questions.forEach(question => {
      if (question.test === testId) {
        totalQuestions++;
        const questionAnswers = answers.filter(a => a.question === question.id);
        const correctAnswers = questionAnswers.filter(a => a.is_correct);
  
        if (questionAnswers.length === 1) {
          const userAnswer = userResponses[question.id] || '';
          if (userAnswer.toLowerCase() === questionAnswers[0].answer.toLowerCase()) {
            correctCount++;
          }
        } else if (correctAnswers.length === 1) {
          const userAnswer = userResponses[question.id];
          if (userAnswer === correctAnswers[0].answer) {
            correctCount++;
          }
        } else {
          const userAnswers = userResponses[question.id] || [];
          const isAllCorrect = correctAnswers.every(answer => userAnswers.includes(answer.answer));
          const isAnyIncorrect = questionAnswers.some(answer => !answer.is_correct && userAnswers.includes(answer.answer));
  
          if (isAllCorrect && !isAnyIncorrect) {
            correctCount++;
          }
        }
      }
    });
    

    setScores(prev => ({ ...prev, [testId]: { correct: correctCount, total: totalQuestions } }));
    
    const scorePercent = (correctCount / totalQuestions) * 100;
    setResultSuccess(scorePercent > 50);
    setShowResultModal(true);

    // Получение ID пользователя из localStorage
    const userId = localStorage.getItem('username');
    if (!userId) {
      console.error("ID пользователя не найден");
      return;
    }
  
    // Данные для отправки
    const attemptData = {
      user: userId,
      test: testId,
      total_score: correctCount,
      try_numb: 1, 
      test_date: new Date().toISOString(),
    };
  
    try {
      const response = await client.post('/api/testresults/', attemptData, { withCredentials: true });
      setScores(response.data);
      console.log("Результаты успешно отправлены:", response.data);
  
    } catch (error) {
      console.error('Ошибка при отправке результатов теста', error);
    }
  };
  
  

  const handleTextInputChange = (questionId, value) => {
    setUserResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleRadioChange = (questionId, value) => {
    setUserResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleCheckboxChange = (questionId, value) => {
    setUserResponses(prev => {
      const existingAnswers = prev[questionId] || [];
      if (existingAnswers.includes(value)) {
        return { ...prev, [questionId]: existingAnswers.filter(answer => answer !== value) };
      } else {
        return { ...prev, [questionId]: [...existingAnswers, value] };
      }
    });
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

  const closeModal = () => {
    setShowResultModal(false);
    window.location.reload(); // Перезагрузка страницы
  };
  
    // Функция для обработки ссылок
    const handleLinks = (html) => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
  
      // Найти все ссылки и установить target="_blank"
      const links = tempDiv.getElementsByTagName('a');
      for (let i = 0; i < links.length; i++) {
        links[i].setAttribute('target', '_blank');
        links[i].setAttribute('rel', 'noopener noreferrer'); // Для безопасности
      }
  
      return tempDiv.innerHTML;
    };
  
  return (
    <div className="course-page-container">
      <div className="topics-navigation">
        <h2>{courseName}</h2>
        {Object.keys(groupedTopics).map((module) => (
          <div key={module}>
            <h3>Модуль {module}</h3>
            <ul>
            {groupedTopics[module].map((topic) => (
              <li
                key={topic.id}
                onClick={() =>
                  isModuleAccessible(topic.module) && handleTopicSelect(topic)
                }
                className={`${
                  selectedTopic?.id === topic.id
                    ? 'active'
                    : isModuleAccessible(topic.module)
                    ? readTopics[topic.id]
                      ? 'read-topic'
                      : ''
                    : 'disabled'
                }`}
              >
                {topic.name}{' '}
                {!isModuleAccessible(topic.module)}
              </li>
            ))}
              {tests
              .filter((test) => test.module === parseInt(module))
              .map((test, index) => (
                <li
                  key={test.id}
                  onClick={() =>
                    isModuleAccessible(test.module) && handleTestSelect(test)
                  }
                  className={`${
                    selectedTest?.id === test.id
                      ? 'active'
                      : isModuleAccessible(test.module + 1) 
                      ? 'completed-test' 
                      : isModuleAccessible(test.module)
                      ? '' 
                      : 'disabled' 
                  }`}
                >
                  Тест {index + 1}: {test.name}{' '} 
                  {!isModuleAccessible(test.module)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="topic-content">
      {selectedTopic && (
        <div>
          <div dangerouslySetInnerHTML={{ __html: handleLinks(selectedTopic.data_ref) }} />
          <label className="read-button">
          <input 
              type="checkbox" 
              checked={!!readTopics[selectedTopic.id]} 
              onChange={() => 
                markTopicAsRead(selectedTopic.id, !readTopics[selectedTopic.id]) 
              } 
            />
            <span>Прочитано</span>
        </label>
        </div>
      )}
        {selectedTest && (
          <div className="test-section">
            <h3 className="test-title">{selectedTest.name}</h3>
            <form
              className="test-form"
              onSubmit={(e) => handleSubmit(e, selectedTest.id)}
            >
              {questions
                .filter((q) => q.test === selectedTest.id)
                .map((question) => {
                  const questionAnswers = answers.filter(
                    (a) => a.question === question.id
                  );
                  const correctAnswers = questionAnswers.filter(
                    (a) => a.is_correct
                  );
  
                  return (
                    <div key={question.id} className="test-question">
                      <p>{question.question}</p>
                      {questionAnswers.length === 1 ? (
                        <input
                          type="text"
                          className="test-input enhanced-input"
                          placeholder="Введите ваш ответ"
                          value={userResponses[question.id] || ''}
                          onChange={(e) =>
                            handleTextInputChange(question.id, e.target.value)
                          }
                        />
                      ) : correctAnswers.length === 1 ? (
                        questionAnswers.map((answer) => (
                          <div key={answer.id} className="test-answer">
                            <label><input
                              type="radio"
                              className="test-radio"
                              name={`question-${question.id}`}
                              value={answer.answer}
                              checked={
                                userResponses[question.id] === answer.answer
                              }
                              onChange={() =>
                                handleRadioChange(question.id, answer.answer)
                              }
                            />
                            {answer.answer}</label>
                          </div>
                        ))
                      ) : (
                        questionAnswers.map((answer) => (
                          <div key={answer.id} className="test-answer">
                            <label><input
                              type="checkbox"
                              className="test-checkbox"
                              value={answer.answer}
                              checked={(userResponses[question.id] || []).includes(
                                answer.answer
                              )}
                              onChange={() =>
                                handleCheckboxChange(question.id, answer.answer)
                              }
                            />
                            {answer.answer}</label>
                          </div>
                        ))
                      )}
                    </div>
                  );
                })}
              <button type="submit" className="test-button">
                Проверить тест
              </button>
            </form>
            {scores[selectedTest.id] && (
              <h3 className="test-result">
                Верные ответы: {scores[selectedTest.id].correct} из{' '}
                {scores[selectedTest.id].total}
              </h3>
            )}
          </div>
        )}
      </div>
      {showResultModal && (
        <div className={`result-modal ${resultSuccess ? 'modal-success' : 'modal-fail'}`}>
          <div className="result-content">
            <h3>{resultSuccess ? 'Поздравляем! Вы прошли тест.' : 'К сожалению, вы не прошли тест.'}</h3>
            <button onClick={closeModal}>Закрыть</button>
          </div>
        </div>
      )}
    
    </div>
    
  );
  
};

export default CoursePage;
