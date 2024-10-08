import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import './CoursePage.css';

const CoursePage = ({ courses }) => {
  const { id } = useParams();
  const course = courses.find(course => course.id === parseFloat(id));

  if (!course) {
    return <div>Курс не найден.</div>;
  }

  const [activeTopicIndex, setActiveTopicIndex] = useState(0); // Track selected topic
  const [activeSectionIndex, setActiveSectionIndex] = useState(null); // Track selected section

  const handleTopicClick = (topicIndex) => {
    setActiveTopicIndex(topicIndex);
    setActiveSectionIndex(null); // Reset section when changing topic
  };

  const handleSectionClick = (sectionIndex) => {
    setActiveSectionIndex(sectionIndex); // Set the active section
  };

  return (
    <div className="course-page-container">
      <div className="sidebar">
        <h3>Темы курса</h3>
        <ul>
          {course.topics.map((topic, topicIndex) => (
            <li key={topicIndex}>
              <div
                className={`sidebar-topic ${activeTopicIndex === topicIndex ? 'active' : ''}`}
                onClick={() => handleTopicClick(topicIndex)}
              >
                {topic.title}
              </div>
              <ul className="section-list">
                {topic.sections.map((section, sectionIndex) => (
                  <li key={sectionIndex}>
                    <div
                      className={`sidebar-section ${activeSectionIndex === sectionIndex ? 'active' : ''}`}
                      onClick={() => handleSectionClick(sectionIndex)}
                    >
                      {section.title}
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <div className="content">
        {activeSectionIndex !== null && (
          <div className="section-content">
            <h4>{course.topics[activeTopicIndex].sections[activeSectionIndex].title}</h4>
            <Editor 
              editorState={EditorState.createWithContent(
                convertFromRaw(JSON.parse(course.topics[activeTopicIndex].sections[activeSectionIndex].text))
              )}
              readOnly={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePage;
