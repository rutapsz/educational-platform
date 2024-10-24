import React, { useEffect, useState } from 'react';
import client from "../components/requests";
import './Profile.css';

const TestResults = () => {
  const [testResults, setTestResults] = useState([]);
  const [courses, setCourses] = useState([]);
  const [tests, setTests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const get_profile = () => {
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

  const groupedResults = tests.reduce((acc, test) => {
    const course = courses.find(c => c.id === test.course);
    if (!course) return acc;

    if (!acc[course.id]) {
      acc[course.id] = {
        courseName: course.name,
        results: [],
        isEligibleForCertificate: true, // Начальное значение флага
      };
    }

    const userResult = testResults.find(r => r.test === test.id);

    acc[course.id].results.push({
      module: test.module,
      testName: test.name,
      totalScore: userResult ? userResult.total_score : 0, // Если нет результата, ставим 0
      testDate: userResult ? userResult.test_date : null,
      testId: test.id // Добавляем идентификатор теста для дальнейшего использования
    });

    return acc;
  }, {});

  // Проверяем, все ли тесты в курсе прошли успешно
  Object.keys(groupedResults).forEach(courseId => {
    groupedResults[courseId].results.forEach(result => {
      const totalQuestions = questions.filter(q => q.test === result.testId).length;

      if (totalQuestions > 0) {
        const passingScore = Math.ceil(totalQuestions * 0.8);
        // Если результат меньше проходного балла, устанавливаем флаг в false
        if (result.totalScore < passingScore) {
          groupedResults[courseId].isEligibleForCertificate = false;
        }
      } else {
        // Если вопросов нет, считаем, что тест не пройден
        groupedResults[courseId].isEligibleForCertificate = false;
      }
    });
  });

  // const handleCertificateClick = (courseId) => {
  //   const userId = userData.id; // Получите ID пользователя из данных профиля
  //   const url = `/api/generate_certificate/${userId}/${courseId}/`;
    
  //   // Открыть PDF в новом окне
  //   window.open(url, '_blank');
  // };

  const userId = localStorage.getItem('username'); // Берем ID пользователя

  const downloadCertificate = async (courseId) => {
    try {
      const response = await client.post('/api/certificates/', {
        user: userId,
        course_id: courseId,
      }, { responseType: 'blob' }); // Указываем тип ответа как blob

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate_${courseId}.pdf`); // Имя файла
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Ошибка при загрузке сертификата:', err);
      alert('Ошибка при получении сертификата');
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
                <p>Дата теста: {result.testDate ? new Date(result.testDate).toLocaleString() : 'Не пройден'}</p>
              </div>
            ))}
            {groupedResults[courseId].isEligibleForCertificate && (
              <button className="button" onClick={() => downloadCertificate(courseId)}>Получить сертификат</button>
            )}
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default TestResults;
