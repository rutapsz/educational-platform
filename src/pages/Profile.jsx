import React, { useEffect, useState } from 'react';
import axios from "axios";
import client from "../components/requests";

const ProfilePage = () => {
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

  return (
    <div>
      <h1>Профиль пользователя</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
  );
};

export default ProfilePage;
