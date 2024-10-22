
import React from 'react';
import './Avatar.css';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Avatar = ({ userName }) => {
  const initial = userName ? userName.charAt(0).toUpperCase() : '?';
  const backgroundColor = getRandomColor();

  return (
    <div
      className="avatar"
      style={{ backgroundColor }}
    >
      {initial}
    </div>
  );
};

export default Avatar;
