import React from 'react';
import PropTypes from 'prop-types';

const Text = ({ children, className = '' }) => {
  return (
    <div className={`text-component ${className}`}>
      <p className="text-title">{children}</p>
    </div>
  );
};

Text.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Text;
