'use client';

import React from 'react';

export default function TextInput({ label, placeholder, type = 'text', name, value, onChange }) {
  return (
    <div className="mb-3">
      <label className="form-label text-white">{label}</label>
      <input
        type={type}
        className="form-control custom-input"
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
}
