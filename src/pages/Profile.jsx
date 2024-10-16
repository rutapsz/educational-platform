import React, { useEffect, useState } from 'react';
import client from "../components/requests";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [error, setError] = useState(null);
  const [certificateAvailable, setCertificateAvailable] = useState(false);

  const username = localStorage.getItem('username');

  const getProfile = async () => {
    try {
      const response = await client.get(`/api/user/${username}/`, { withCredentials: true });
      setUserData(response.data);
    } catch (error) {
      setError(error);
    }
  };

  const getTestResults = async () => {
    try {
      const response = await client.get(`/api/testresults/?user=${username}/`, { withCredentials: true });
      setTestResults(response.data);
      checkCertificateEligibility(response.data);
    } catch (error) {
      setError(error);
    }
  };

  const checkCertificateEligibility = (results) => {
    const completedTests = results.filter(result => result.total_score >= 50);
    const allTestsCompleted = completedTests.length === results.length && results.length > 0;
    setCertificateAvailable(allTestsCompleted);
  };

  useEffect(() => {
    getProfile();
    getTestResults();
  }, []);

  // Групировка тестов по курсам
  const groupedResults = testResults.reduce((acc, result) => {
    const courseName = result.course_name || 'Неизвестный курс';
    if (!acc[courseName]) {
      acc[courseName] = [];
    }
    acc[courseName].push(result);
    return acc;
  }, {});

  return (
    <div>
      <h1>Профиль пользователя</h1>
      {error && <p style={{ color: 'red' }}>{error.message}</p>}

      {userData ? (
        <div>
          <p><strong>Логин:</strong> {userData.username}</p>
          <p><strong>Фамилия:</strong> {userData.first_name}</p>
          <p><strong>Имя:</strong> {userData.last_name}</p>
          <p><strong>Email:</strong> {userData.email}</p>

          <h2>Результаты тестов</h2>
          {Object.entries(groupedResults).length > 0 ? (
            Object.entries(groupedResults).map(([course, results]) => (
              <div key={course}>
                <h3>{course}</h3>
                <ul>
                  {results.map((result) => (
                    <li key={result.id}>
                      <strong>Модуль:</strong> {result.module_name} | 
                      <strong> Балл:</strong> {result.total_score} | 
                      <strong> Попытка:</strong> {result.try_numb} | 
                      <strong> Дата:</strong> {new Date(result.test_date).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>Нет пройденных тестов.</p>
          )}

          {certificateAvailable && (
            <button onClick={() => alert('Сертификат получен!')}>
              Получить сертификат
            </button>
          )}
        </div>
      ) : (
        <p>Загрузка данных профиля...</p>
      )}
    </div>
  );
};

export default ProfilePage;
