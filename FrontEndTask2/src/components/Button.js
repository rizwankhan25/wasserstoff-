'use client';

import React from 'react';

export default function Button({ type = 'button', className = '', onClick, children }) {
  return (
    <button type={type} className={`btn btn-danger ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}
