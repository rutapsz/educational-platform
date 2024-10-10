import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CoursePage.css';

const CoursePage = () => {
  const { id } = useParams();
  const [topics, setTopics] = useState([]);
  const [tests, setTests] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [courseName, setCourseName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [totalScore, setTotalScore] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseResponse = await axios.get(`http://localhost:8000/api/courses/${id}/`);
        setCourseName(courseResponse.data.name);

        const topicsResponse = await axios.get(`http://localhost:8000/api/topics/?course=${id}`);
        setTopics(topicsResponse.data);

        const testsResponse = await axios.get(`http://localhost:8000/api/tests/?course=${id}`);
        setTests(testsResponse.data);

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
    setSelectedTopic(topic);
    setSelectedTest(null);
  };

  // Обработка выбора теста
  const handleTestSelect = async (test) => {
    setSelectedTest(test);
    setSelectedTopic(null);

    try {
      const questionsResponse = await axios.get(`http://localhost:8000/api/questions/?test=${test.id}`);
      setQuestions(questionsResponse.data);

      const answersResponse = await axios.get(`http://localhost:8000/api/answers/`);
      setAnswers(answersResponse.data);
    } catch (error) {
      console.error('Ошибка при загрузке вопросов и ответов', error);
    }
  };

  const handleAnswerInput = (questionId, answer) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleAnswerSelect = (questionId, answerId) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answerId,
    }));
  };

const handleSubmitTest = async () => {
  let score = 0;

  questions.forEach((question) => {
    const correctAnswers = answers.filter((answer) => answer.question === question.id && answer.is_correct);
    const userAnswer = userAnswers[question.id] || '';

    
    if (correctAnswers.length === 1 && typeof userAnswer === 'string') {
      if (userAnswer.toLowerCase() === correctAnswers[0].answer.toLowerCase()) {
        score += question.score;
      }
    } 
    else if (correctAnswers.length === 1 && typeof userAnswer === 'number') {
      if (correctAnswers[0].id === userAnswer) {
        score += question.score;
      }
    } 
    
    else if (correctAnswers.length > 1) {
      const userAnswerArray = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
      const correctAnswerIds = correctAnswers.map((answer) => answer.id);

      if (
        userAnswerArray.length === correctAnswerIds.length &&
        userAnswerArray.every((answerId) => correctAnswerIds.includes(answerId))
      ) {
        score += question.score;
      }
    }
  });

  setTotalScore(score);

  // Отправлка результатов теста
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const userResponse = await axios.get(`http://localhost:8000/api/users/?token=${token}`);
      const userId = userResponse.data[0].id;

      const previousResultResponse = await axios.get(
        `http://localhost:8000/api/testresults/?user=${userId}&test=${selectedTest.id}`
      );
      const previousResult = previousResultResponse.data[0];

      const data = {
        user: userId,
        test: selectedTest.id,
        total_score: score > (previousResult?.total_score || 0) ? score : previousResult?.total_score,
        try_numb: (previousResult?.try_numb || 0) + 1,
        test_date: new Date(),
      };

      if (previousResult) {
        await axios.put(`http://localhost:8000/api/testresults/${previousResult.id}/`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('http://localhost:8000/api/testresults/', data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.error('Ошибка при отправке результатов теста', error);
    }
  }
};

  const sortedTopics = topics.sort((a, b) => {
    if (a.module === b.module) {
      return a.position - b.position;
    }
    return a.module - b.module;
  });

  const groupedTopicsAndTests = sortedTopics.reduce((groups, topic) => {
    const { module } = topic;
    if (!groups[module]) {
      groups[module] = { topics: [], tests: [] };
    }
    groups[module].topics.push(topic);
    return groups;
  }, {});

  tests.forEach(test => {
    const { module } = test;
    if (groupedTopicsAndTests[module]) {
      groupedTopicsAndTests[module].tests.push(test);
    } else {
      groupedTopicsAndTests[module] = { topics: [], tests: [test] };
    }
  });

  return (
    <div className="course-page-container">
      <div className="topics-navigation">
        <h2>Темы курса: {courseName}</h2>
        {Object.keys(groupedTopicsAndTests).map((module) => (
          <div key={module}>
            <h3>Модуль {module}</h3>
            <ul>
              {groupedTopicsAndTests[module].topics.map((topic) => (
                <li
                  key={topic.id}
                  onClick={() => handleTopicSelect(topic)}
                  className={selectedTopic?.id === topic.id ? 'active' : ''}
                >
                  {topic.name}
                </li>
              ))}
              {groupedTopicsAndTests[module].tests.map((test) => (
                <li
                  key={test.id}
                  onClick={() => handleTestSelect(test)}
                  className={selectedTest?.id === test.id ? 'active' : ''}
                >
                  Тест: {test.name}
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
          <div>
            <h2>{selectedTest.name}</h2>
            {questions.map((question) => (
              <div key={question.id}>
                <p>{question.question}</p>
                {answers.filter((answer) => answer.question === question.id).length === 1 ? (
                  <input
                    type="text"
                    placeholder="Введите ваш ответ"
                    onChange={(e) => handleAnswerInput(question.id, e.target.value)}
                  />
                ) : (
                  answers
                    .filter((answer) => answer.question === question.id)
                    .map((answer) => (
                      <div key={answer.id}>
                        <label>
                          <input
                            type={answers.filter((a) => a.question === question.id && a.is_correct).length === 1 ? "radio" : "checkbox"}
                            name={`question-${question.id}`}
                            value={answer.id}
                            onChange={() => handleAnswerSelect(question.id, answer.id)}
                          />
                          {answer.answer}
                        </label>
                      </div>
                    ))
                )}
              </div>
            ))}
            <button onClick={handleSubmitTest}>Отправить ответы</button>
            {totalScore !== null && <p>Правильные ответы: {totalScore} из {questions.reduce((total, question) => total + question.score, 0)}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePage;
