import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TestPage.css';

const Test = () => {
    const [text, setText] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/docx')
          .then(response => {
            console.log(response.data);
            setText(response.data);
          })
          .catch(error => console.error('Error fetching the data:', error));
      }, []);

  return (
    <div className="container">
      <h1>DOCX Content</h1>
      {text.map((paragraph, index) => (
        <p key={index} className="paragraph">{paragraph}</p>
      ))}
    </div>
  );
};

export default Test;
