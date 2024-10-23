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
  // const currentModule = selectedTest.module;
  // const nextModule = parseInt(currentModule) + 1;
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

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

        // Устанавливаем первый топик по умолчанию, если он есть
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
    return scorePercentage >= 80;
  };
  
  const handleMarkAsReadAndMoveNext = (topicId, isRead) => {
    markTopicAsRead(topicId, isRead);
    if (isRead) {
      const nextItem = findNextItem(topicId, 'next');
      if (nextItem) handleSelectNextItem(nextItem);
    }
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

  const findNextItem = (currentItemId, direction) => {
    // Находим текущий модуль
    const currentModule = Object.keys(groupedTopics).find((module) =>
      groupedTopics[module].some((topic) => topic.id === currentItemId) //||
      // tests.some((test) => test.id === currentItemId && test.module === parseInt(module))
    );
  
    if (!currentModule) return null; // Проверка на существование модуля
  
    const topicsInCurrentModule = groupedTopics[currentModule];
    const currentTopicIndex = topicsInCurrentModule.findIndex(
      (topic) => topic.id === currentItemId
    );
    const currentTestIndex = tests.findIndex(
      (test) => test.id === currentItemId && test.module === parseInt(currentModule)
    );
  
    if (direction === 'next') {
      // Логика для кнопки "Вперед"
      // Переход к следующему топику в текущем модуле
      if (currentTopicIndex !== -1 && currentTopicIndex + 1 < topicsInCurrentModule.length) {
        return topicsInCurrentModule[currentTopicIndex + 1]; // Возвращаем следующий топик
      }
  
      // Если это последний топик, переходим к первому тесту текущего модуля
      if (currentTopicIndex === topicsInCurrentModule.length - 1) {
        return tests.find((test) => test.module === parseInt(currentModule)); // Первый тест текущего модуля
      }
  
      // Переход к первому топику следующего модуля
      const nextModule = parseInt(currentModule) + 1;
      if (groupedTopics[nextModule]) {
        return groupedTopics[nextModule][0]; // Первый топик следующего модуля
      }
  
      return null; // Если нет следующего элемента
    } else if (direction === 'prev') {
      // Логика для кнопки "Назад"
      // if (parseInt(currentModule) === 2) {
      //   return topicsInCurrentModule[0];
      // }
      // Если текущий элемент - тест
      if (currentTestIndex !== -1) {
        // Если находимся на тесте в третьем модуле, возвращаем первый топик третьего модуля
        if (parseInt(currentModule) === 2) {
          return 2; // Возвращаем первый топик третьего модуля
        }
        
        // Для других модулей возвращаем последний топик текущего модуля
        return topicsInCurrentModule[topicsInCurrentModule.length - 1]; // Последний топик текущего модуля
      }
  
      // Если текущий элемент - топик
      if (currentTopicIndex > 0) {
        return topicsInCurrentModule[currentTopicIndex - 1]; // Возвращаем предыдущий топик
      }
  
      // Переход к последнему тесту предыдущего модуля
      const prevModule = parseInt(currentModule) - 1;
      if (prevModule >= 0 && groupedTopics[prevModule]) {
        const lastTest = tests.filter((test) => test.module === prevModule);
        if (lastTest.length > 0) {
          return lastTest[lastTest.length - 1]; // Последний тест предыдущего модуля
        }
      }
    }
  
    return null; // Если больше нет элементов для перехода
  };
  
  const handleSelectNextItem = (item) => {
    if (item?.data_ref) {
      handleTopicSelect(item); // Если это топик
    } else /*if (item?.name && item?.module)*/ {
      handleTestSelect(item); // Если это тест
    }
  };

  

  const handleTopicSelect = async (topic) => {
    setSelectedTest(null);
    setSelectedTopic(topic);
    localStorage.setItem('selectedTopic', topic.id);
  };
  
  const handleTestSelect = (test) => {
    setSelectedTopic(null);
    setSelectedTest(test);
    localStorage.setItem('selectedTest', test.id);
  };

  useEffect(() => {
    const savedTopicId = localStorage.getItem('selectedTopic');
    const savedTestId = localStorage.getItem('selectedTest');

    // Устанавливаем только одно состояние
    if (savedTopicId) {
      const savedTopic = topics.find(topic => topic.id === parseInt(savedTopicId));
      if (savedTopic) {
        setSelectedTopic(savedTopic);
        setSelectedTest(null); // Сбрасываем тест
      }
    } else if (savedTestId) {
      const savedTest = tests.find(test => test.id === parseInt(savedTestId));
      if (savedTest) {
        setSelectedTest(savedTest);
        setSelectedTopic(null); // Сбрасываем топик
      }
    }
  }, [topics, tests]);

  useEffect(() => {
    if (!selectedTopic && !selectedTest && topics.length > 0) {
      setSelectedTopic(topics[0]); // Устанавливаем первый топик
    }
  }, [selectedTopic, selectedTest, topics]);

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

  const handleNextModule = () => {
    const currentModule = selectedTest.module;
    const nextModule = parseInt(currentModule) + 1;
  
    // Исключение для третьего модуля
    if (currentModule === 3) {
      window.location.href = '/profile';
      return;
    }
  
    // Переход на первый топик следующего модуля, если он есть
    if (groupedTopics[nextModule]) {
      const firstTopicInNextModule = groupedTopics[nextModule][0];
      handleTopicSelect(firstTopicInNextModule);
    } else {
      console.log('Следующий модуль не найден');
    }
  };

  const closeModal = () => {
    
    setShowResultModal(false);
    if (resultSuccess) {
      handleNextModule(); // Переход на следующий модуль при успешном тесте
    }
    const currentModule = selectedTest.module;
    if (currentModule != 3) {
      window.location.reload();
    }
    
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
  
    const isFirstItem = (topicId) =>
      !findNextItem(topicId, 'prev'); // Нет предыдущего элемента
    const isLastItem = (topicId) =>
      !findNextItem(topicId, 'next');

    const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="course-page-container">
      <div className="mobile-nav-toggle" onClick={toggleMobileNav}>
        <span>{isMobileNavOpen ? 'Закрыть меню курса' : 'Меню курса'}</span>
      </div>
      <div className={`topics-navigation ${isMobileNavOpen ? 'open' : ''}`}>
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
                  Тест {(test.module)}: {test.name}{' '} 
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
            <div
              dangerouslySetInnerHTML={{
                __html: handleLinks(selectedTopic.data_ref),
              }}
            />
            <div className="navigation-buttons">
              {!isFirstItem(selectedTopic.id) && (
                <button
                  className="nav-button"
                  onClick={() => {
                    const prevItem = findNextItem(selectedTopic.id, 'prev');
                    if (prevItem) {
                      handleSelectNextItem(prevItem);
                      scrollToTop(); // Прокрутка к верху страницы
                    }
                  }}
                >
                  Назад
                </button>
              )}
              <label className="read-button">
                <input
                  type="checkbox"
                  checked={!!readTopics[selectedTopic.id]}
                  onChange={(e) =>
                    handleMarkAsReadAndMoveNext(
                      selectedTopic.id,
                      e.target.checked
                    )
                  }
                />
                <span>Текст прочитан и понят</span>
              </label>
              {!isLastItem(selectedTopic.id) && (
                <button
                  className="nav-button"
                  onClick={() => {
                    const nextItem = findNextItem(selectedTopic.id, 'next');
                    if (nextItem) {
                      handleSelectNextItem(nextItem);
                      scrollToTop(); // Прокрутка к верху страницы
                    }
                  }}
                >
                  Вперед
                </button>
              )}
            </div>
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
            {/* <div className="navigation-buttons">
              Стрелка назад
              <button
                className="nav-button"
                onClick={() => {
                  const prevItem = findNextItem(selectedTest.id, 'prev');
                  if (prevItem) {
                    handleSelectNextItem(prevItem);
                    scrollToTop();
                  }
                }}
              >
                Назад
              </button>

              {isModuleAccessible(selectedTest.module+1) && (
                <button
                  className="nav-button"
                  onClick={() => {
                    const nextItem = findNextItem(selectedTest.id, 'next');
                    if (nextItem) {
                      handleSelectNextItem(nextItem);
                      scrollToTop();
                    }
                  }}
                >
                  Вперед
                </button>
              )}
            </div> */}

          </div>
          
        )}
      </div>
      {showResultModal && (
        <div className={`result-modal ${resultSuccess ? 'modal-success' : 'modal-fail'}`}>
          <div className="result-content">
            <h3>
              {resultSuccess ? 'Поздравляем! Вы прошли тест.' : 'К сожалению, вы не прошли тест.'}
            </h3>
            <button onClick={closeModal}>Закрыть</button>
          </div>
        </div>
      )}
    
    </div>
    
  );
  
};

export default CoursePage;
