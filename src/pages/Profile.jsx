import React, { useEffect, useState } from 'react';
import client from "../components/requests";
import './Profile.css';

const TestResults = () => {
  const [testResults, setTestResults] = useState([]);
  const [courses, setCourses] = useState([]);
  const [tests, setTests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [allTestsPassed, setAllTestsPassed] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const get_profile =  () => {
        client.get(`/api/user/${localStorage.getItem('username')}/`, {
            withCredentials: true,
        }).then(res => {
          setUserData(res.data);
        }).catch(error => {
          setError(error);
        });
  };


  useEffect(() => {
    get_profile(); // Вызов функции для получения данных профиля при загрузке компонента
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('username');

    const fetchTestResults = async () => {
      try {
        const resultsResponse = await client.get(`/api/testresults/?user=${userId}`);
        setTestResults(resultsResponse.data);
      } catch (error) {
        console.error('Ошибка при загрузке результатов тестов:', error);
      }
    };

    const fetchCourses = async () => {
      try {
        const coursesResponse = await client.get('/api/courses/');
        setCourses(coursesResponse.data);
      } catch (error) {
        console.error('Ошибка при загрузке курсов:', error);
      }
    };

    const fetchTests = async () => {
      try {
        const testsResponse = await client.get('/api/tests/');
        setTests(testsResponse.data);
      } catch (error) {
        console.error('Ошибка при загрузке тестов:', error);
      }
    };

    const fetchQuestions = async () => {
      try {
        const questionsResponse = await client.get('/api/questions/');
        setQuestions(questionsResponse.data);
      } catch (error) {
        console.error('Ошибка при загрузке вопросов:', error);
      }
    };

    fetchTestResults();
    fetchCourses();
    fetchTests();
    fetchQuestions();
  }, []);

  useEffect(() => {
    checkIfAllTestsPassed();
  }, [testResults, tests, questions]);

  const checkIfAllTestsPassed = () => {
    const allPassed = testResults.every(result => {
      const test = tests.find(t => t.id === result.test);
      if (!test) return false;

      const testQuestions = questions.filter(q => q.test === test.id);
      const totalQuestions = testQuestions.length;
      const passingScore = totalQuestions * 0.5;

      return result.total_score >= passingScore;
    });
    setAllTestsPassed(allPassed);
  };

  const groupedResults = testResults.reduce((acc, result) => {
    const test = tests.find(t => t.id === result.test);
    if (!test) return acc;

    const course = courses.find(c => c.id === test.course);
    if (!course) return acc;

    if (!acc[course.id]) {
      acc[course.id] = {
        courseName: course.name,
        results: []
      };
    }

    acc[course.id].results.push({
      module: test.module,
      testName: test.name,
      totalScore: result.total_score,
      testDate: result.test_date
    });

    return acc;
  }, {});

const handleGetCertificate = async (courseId) => {
    const userId = localStorage.getItem('username');
    try {
      const response = await client.post('/api/certificates/', { user: userId, course_id: courseId }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate_${userId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Ошибка при получении сертификата:', error);
    }
  };


  return (
    <div className="container">
      <div className="profile-container">
        <div className="userInfo">
          <h1 className="title">Профиль пользователя</h1>
          {error && <p className="error">{error}</p>}
          {userData ? (
            <div>
              <p><strong>Логин:</strong> {userData.username}</p>
              <p><strong>Фамилия:</strong> {userData.first_name}</p>
              <p><strong>Имя:</strong> {userData.last_name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
            </div>
          ) : (
            <p>Загрузка данных профиля...</p>
          )}
        </div>
      </div>

      <h1 className="title">Результаты тестов</h1>
      <div className="results-container">
        {Object.keys(groupedResults).map(courseId => (
          <div key={courseId} className="course">
            <h2>{groupedResults[courseId].courseName}</h2>
            {groupedResults[courseId].results.map((result, index) => (
              <div key={index} className="testResult">
                <p>Модуль: {result.module}</p>
                <p>Название теста: {result.testName}</p>
                <p>Общий счет: {result.totalScore}</p>
                <p>Дата теста: {new Date(result.testDate).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
      {allTestsPassed && (
        <button onClick={handleGetCertificate(courseId)} className="button">Получить сертификат</button>
      )}
    </div>
  );

  function getCourseName(testId) {
    const test = tests.find(t => t.id === testId);
    if (!test) {
      console.log(`Тест с ID ${testId} не найден`);
      return 'Неизвестный курс';
    }
    const course = courses.find(c => c.id === test.course);
    if (!course) {
      console.log(`Курс с ID ${test.course} не найден`);
    }
    return course ? course.name : 'Неизвестный курс';
  }

  function getModuleNumber(testId) {
    const test = tests.find(t => t.id === testId);
    if (!test) {
      console.log(`Тест с ID ${testId} не найден`);
      return 'Неизвестный модуль';
    }
    return test.module !== null ? test.module : 'Неизвестный модуль';
  }

  function getTestName(testId) {
    const test = tests.find(t => t.id === testId);
    if (!test) {
      console.log(`Тест с ID ${testId} не найден`);
      return 'Неизвестный тест';
    }
    return test.name ? test.name : 'Неизвестный тест';
  }
};

export default TestResults;
