'use client';

import React, { useRef } from 'react';

export default function FileUpload({ label = 'Upload avatar', onFileSelect }) {
  const fileInputRef = useRef();

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (onFileSelect) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="mb-3">
      <label className="form-label text-white">{label}</label>
      <div className="upload-box text-center" onClick={handleFileClick} role="button">
        <div className="fs-1 text-warning mb-2">📁</div>
        <p className="mb-0 text-white">Drag and drop or click to upload</p>
        <input
          type="file"
          accept="image/png, image/jpeg"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
      <small className="text-light-emphasis d-block mt-1">
        Upload your photo (256 x 256), max size: 500KB.
      </small>
    </div>
  );
}
