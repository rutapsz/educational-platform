import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CoursePage.css';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseResponse = await axios.get(`http://localhost:8000/api/courses/${id}/`);
        setCourseName(courseResponse.data.name);

        const topicsResponse = await axios.get(`http://localhost:8000/api/topics/?course=${id}`);
        setTopics(topicsResponse.data);

        const testsResponse = await axios.get('http://127.0.0.1:8000/api/tests/');
        setTests(testsResponse.data);

        const questionsResponse = await axios.get('http://127.0.0.1:8000/api/questions/');
        setQuestions(questionsResponse.data);

        const answersResponse = await axios.get('http://127.0.0.1:8000/api/answers/');
        setAnswers(answersResponse.data);

        if (topicsResponse.data.length > 0) {
          setSelectedTopic(topicsResponse.data[0]);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных', error);
      }
    };
    fetchData();
  }, [id]);

  const handleTopicSelect = (topic) => {
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

    // Отправка результатов теста на сервер
    const userId = localStorage.getItem('userId'); // ID пользователя из localStorage
    const attemptData = {
      user: userId,
      test: testId,
      // total_score: totalScore,
      total: totalQuestions,
    };

    try {
      await axios.post('http://127.0.0.1:8000/api/testresults/', attemptData);
      console.log('Результаты теста успешно отправлены на сервер');
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

  return (
    <div className="course-page-container">
      <div className="topics-navigation">
        <h2>Темы и тесты курса: {courseName}</h2> 
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
              {tests.filter(test => test.module === parseInt(module)).map(test => (
                <li
                  key={test.id}
                  onClick={() => handleTestSelect(test)}
                  className={selectedTest?.id === test.id ? 'active' : ''}
                >
                  {test.name}
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
        {selectedTest && (
          <div className="test-section">
            <h3 className="test-title">{selectedTest.name}</h3>
            <form className="test-form" onSubmit={(e) => handleSubmit(e, selectedTest.id)}>
              {questions.filter(q => q.test === selectedTest.id).map(question => {
                const questionAnswers = answers.filter(a => a.question === question.id);
                const correctAnswers = questionAnswers.filter(a => a.is_correct);

                return (
                  <div key={question.id} className="test-question">
                    <p>{question.question}</p>
                    {questionAnswers.length === 1 ? (
                      <input
                        type="text"
                        className="test-input"
                        placeholder="Введите ваш ответ"
                        value={userResponses[question.id] || ''}
                        onChange={(e) => handleTextInputChange(question.id, e.target.value)}
                      />
                    ) : correctAnswers.length === 1 ? (
                      questionAnswers.map(answer => (
                        <div key={answer.id} className="test-answer">
                          <input
                            type="radio"
                            className="test-radio"
                            name={`question-${question.id}`}
                            value={answer.answer}
                            checked={userResponses[question.id] === answer.answer}
                            onChange={() => handleRadioChange(question.id, answer.answer)}
                          />
                          <label>{answer.answer}</label>
                        </div>
                      ))
                    ) : (
                      questionAnswers.map(answer => (
                        <div key={answer.id} className="test-answer">
                          <input
                            type="checkbox"
                            className="test-checkbox"
                            value={answer.answer}
                            checked={(userResponses[question.id] || []).includes(answer.answer)}
                            onChange={() => handleCheckboxChange(question.id, answer.answer)}
                          />
                          <label>{answer.answer}</label>
                        </div>
                      ))
                    )}
                  </div>
                );
              })}
              <button type="submit" className="test-button">Проверить тест</button>
            </form>
            {scores[selectedTest.id] && (
              <h3 className="test-result">Верные ответы: {scores[selectedTest.id].correct} из {scores[selectedTest.id].total}</h3>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePage;
