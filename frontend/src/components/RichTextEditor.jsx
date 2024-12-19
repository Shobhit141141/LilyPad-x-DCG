import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ label, value, onChange, error }) => {
  const [editorValue, setEditorValue] = useState(value || '');

  const handleChange = (content) => {
    setEditorValue(content);
    if (onChange) {
      onChange(content);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700">{label}:</label>
      <ReactQuill
        value={editorValue}
        onChange={handleChange}
        className="bg-white border border-gray-300 rounded"
      />
      {error && (
        <p className="text-red-500">{error}</p>
      )}
    </div>
  );
};

export default RichTextEditor;
