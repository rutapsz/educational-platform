import React, { useState, useEffect } from 'react'; 
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';

const TextEditor = ({ onChange, initialValue }) => {
  const [editorState, setEditorState] = useState(() => {
    if (initialValue) {
      return EditorState.createWithContent(convertFromRaw(JSON.parse(initialValue)));
    }
    return EditorState.createEmpty();
  });

  const handleEditorChange = (state) => {
    setEditorState(state);
    const rawContent = JSON.stringify(convertToRaw(state.getCurrentContent()));
    onChange(rawContent); // Pass raw content to the parent
  };

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '10px', minHeight: '200px' }}>
      <Editor
        editorState={editorState}
        onChange={handleEditorChange}
        handleKeyCommand={handleKeyCommand}
        placeholder="Введите текст раздела..."
      />
    </div>
  );
};

export default TextEditor;