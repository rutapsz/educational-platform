import React, { useState, useEffect } from 'react';
import './AddTest.css';
import client from "../components/requests";

const AddTest = () => {
  const [tests, setTests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  const [testName, setTestName] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [moduleNumber, setModuleNumber] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [score, setScore] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [isEditingTest, setIsEditingTest] = useState(false);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [isEditingAnswer, setIsEditingAnswer] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Получение списка тестов
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await client.get('http://localhost:8000/api/tests/',
          {withCredentials: true});
        setTests(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке тестов', error);
      }
    };
    fetchTests();
  }, []);

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

  // Получение вопросов по тесту
  const fetchQuestions = async (testId) => {
    try {
      const response = await client.get(`http://localhost:8000/api/questions/?test=${testId}`,
          {withCredentials: true});
      setQuestions(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке вопросов', error);
    }
  };

  // Получение ответов по вопросу
  const fetchAnswers = async (questionId) => {
    try {
      const response = await client.get(`http://localhost:8000/api/answers/?question=${questionId}`,
          {withCredentials: true});
      setAnswers(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке ответов', error);
    }
  };

  // Заполнение формы для редактирования теста
  const handleEditTest = (testId) => {
    const test = tests.find((t) => t.id === testId);
    if (test) {
      setSelectedTestId(test.id);
      setTestName(test.name);
      setSelectedCourseId(test.course);
      setModuleNumber(test.module);
      setIsEditingTest(true);
      fetchQuestions(testId);
    }
  };

  // Обработка создания или редактирования теста
  const handleTestSubmit = async (e) => {
    e.preventDefault();

    const updatedTest = {
      name: testName,
      course: selectedCourseId,
      module: moduleNumber,
    };

    try {
      if (isEditingTest) {
        await client.put(`http://localhost:8000/api/tests/${selectedTestId}/`, updatedTest,
          {withCredentials: true});
        setSuccessMessage('Тест успешно обновлен!');
      } else {
        const response = await client.post('http://localhost:8000/api/tests/', updatedTest,
          {withCredentials: true});
        setSelectedTestId(response.data.id);
        setSuccessMessage('Тест успешно создан!');
      }
      const updatedTests = await client.get('http://localhost:8000/api/tests/',
          {withCredentials: true});
      setTests(updatedTests.data);
      setIsEditingTest(false);
    } catch (error) {
      console.error('Ошибка при отправке данных теста', error);
    }
  };

  // Заполнение формы для редактирования вопроса
  const handleEditQuestion = (questionId) => {
    const question = questions.find((q) => q.id === questionId);
    if (question) {
      setSelectedQuestionId(question.id);
      setQuestionText(question.question);
      setScore(question.score);
      setIsEditingQuestion(true);
      fetchAnswers(questionId);
    }
  };

  // Обработка создания или редактирования вопроса
  const handleQuestionSubmit = async (e) => {
    e.preventDefault();

    const updatedQuestion = {
      test: selectedTestId,
      question: questionText,
      score: score,
    };

    try {
      if (isEditingQuestion) {
        await client.put(`http://localhost:8000/api/questions/${selectedQuestionId}/`, updatedQuestion, {withCredentials: true});
        setSuccessMessage('Вопрос успешно обновлен!');
      } else {
        await client.post('http://localhost:8000/api/questions/', updatedQuestion,
            {withCredentials: true});
        setSuccessMessage('Вопрос успешно создан!');
      }

      fetchQuestions(selectedTestId);
      setIsEditingQuestion(false);

      // Сброс формы
      setQuestionText('');
      setScore('');
      setSelectedQuestionId(null);
    } catch (error) {
      console.error('Ошибка при отправке данных вопроса', error);
    }
  };

  // Заполнение формы для редактирования ответа
  const handleEditAnswer = (answerId) => {
    const answer = answers.find((a) => a.id === answerId);
    if (answer) {
      setSelectedAnswerId(answer.id);
      setAnswerText(answer.answer);
      setIsCorrect(answer.is_correct);
      setIsEditingAnswer(true);
    }
  };

  // Обработка создания или редактирования ответа
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();

    const updatedAnswer = {
      question: selectedQuestionId,
      answer: answerText,
      is_correct: isCorrect,
    };

    try {
      if (isEditingAnswer) {
        await client.put(`http://localhost:8000/api/answers/${selectedAnswerId}/`, updatedAnswer, {withCredentials: true});
        setSuccessMessage('Ответ успешно обновлен!');
      } else {
        await client.post('http://localhost:8000/api/answers/', updatedAnswer,
            {withCredentials: true});
        setSuccessMessage('Ответ успешно создан!');
      }

      fetchAnswers(selectedQuestionId);
      setIsEditingAnswer(false);

      // Сброс формы
      setAnswerText('');
      setIsCorrect(false);
      setSelectedAnswerId(null);
    } catch (error) {
      console.error('Ошибка при отправке данных ответа', error);
    }
  };

  // Удаление теста
  const handleDeleteTest = async (testId) => {
    try {
      await client.delete(`http://localhost:8000/api/tests/${testId}/`,
          {withCredentials: true});
      setSuccessMessage('Тест успешно удален!');
      const updatedTests = await client.get('http://localhost:8000/api/tests/',
          {withCredentials: true});
      setTests(updatedTests.data);
      setSelectedTestId(null);
      setQuestions([]);
    } catch (error) {
      console.error('Ошибка при удалении теста', error);
    }
  };

  // Удаление вопроса
  const handleDeleteQuestion = async (questionId) => {
    try {
      await client.delete(`http://localhost:8000/api/questions/${questionId}/`,
            {withCredentials: true});
      setSuccessMessage('Вопрос успешно удален!');
      fetchQuestions(selectedTestId);
    } catch (error) {
      console.error('Ошибка при удалении вопроса', error);
    }
  };

  // Удаление ответа
  const handleDeleteAnswer = async (answerId) => {
    try {
      await client.delete(`http://localhost:8000/api/answers/${answerId}/`,
            {withCredentials: true});
      setSuccessMessage('Ответ успешно удален!');
      fetchAnswers(selectedQuestionId);
    } catch (error) {
      console.error('Ошибка при удалении ответа', error);
    }
  };

  return (
    <div className="add-test-container">
      <h1>{isEditingTest ? 'Редактировать тест' : 'Создать новый тест'}</h1>
      <form onSubmit={handleTestSubmit} className="add-test-form">
        <div>
          <label>Название теста</label>
          <input
            type="text"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Курс</label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            required
          >
            <option value="">Выберите курс</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
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
        <button type="submit">{isEditingTest ? 'Обновить тест' : 'Создать тест'}</button>
      </form>

      {selectedTestId && (
        <>
          <h2>{isEditingQuestion ? 'Редактировать вопрос' : 'Создать новый вопрос'}</h2>
          <form onSubmit={handleQuestionSubmit} className="add-question-form">
            <div>
              <label>Текст вопроса</label>
              <input
                type="text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Баллы</label>
              <input
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                required
              />
            </div>
            <button type="submit">{isEditingQuestion ? 'Обновить вопрос' : 'Создать вопрос'}</button>
          </form>

          <div className="question-list">
            <h2>Список вопросов</h2>
            <ul>
              {questions.map((question) => (
                <li key={question.id}>
                  <span>{question.question}</span>
                  <button onClick={() => handleEditQuestion(question.id)}>Редактировать</button>
                  <button onClick={() => handleDeleteQuestion(question.id)}>Удалить</button>
                </li>
              ))}
            </ul>
          </div>

          {selectedQuestionId && (
            <>
              <h2>{isEditingAnswer ? 'Редактировать ответ' : 'Создать новый ответ'}</h2>
              <form onSubmit={handleAnswerSubmit} className="add-answer-form">
                <div>
                  <label>Текст ответа</label>
                  <input
                    type="text"
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Правильный ответ</label>
                  <input
                    type="checkbox"
                    checked={isCorrect}
                    onChange={(e) => setIsCorrect(e.target.checked)}
                  />
                </div>
                <button type="submit">{isEditingAnswer ? 'Обновить ответ' : 'Создать ответ'}</button>
              </form>

              <div className="answer-list">
                <h2>Список ответов</h2>
                <ul>
                  {answers.map((answer) => (
                    <li key={answer.id}>
                      <span>{answer.answer}</span>
                      <button onClick={() => handleEditAnswer(answer.id)}>Редактировать</button>
                      <button onClick={() => handleDeleteAnswer(answer.id)}>Удалить</button>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </>
      )}

      <div className="test-list">
        <h2>Список тестов</h2>
        <ul>
          {tests.map((test) => (
            <li key={test.id}>
              <span>{test.name}</span>
              <button onClick={() => handleEditTest(test.id)}>Редактировать</button>
              <button onClick={() => handleDeleteTest(test.id)}>Удалить</button>
            </li>
          ))}
        </ul>
      </div>

      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default AddTest;
