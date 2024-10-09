import React, { useEffect, useState } from 'react';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token'); // Получите токен из localStorage
    if (!token) {
      setError('Токен не найден');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/me/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        setError('Ошибка при получении профиля: ' + response.status);
      }
    } catch (err) {
      setError('Ошибка: ' + err.message);
    }
  };

  useEffect(() => {
    fetchProfile(); // Вызов функции для получения данных профиля при загрузке компонента
  }, []);

  return (
    <div>
      <h1>Профиль пользователя</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {userData ? (
        <div>
          <p><strong>Логин:</strong> {userData.login}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Роль:</strong> {userData.role}</p>
        </div>
      ) : (
        <p>Загрузка данных профиля...</p>
      )}
    </div>
  );
};

export default ProfilePage;
