// // src/components/Heading.js
// "use client";
// import React from "react";

// const Heading = () => {
//   return (
//     <div className={`text-component`}>
//       <h3 className="heading-title">
//         Congrats, <span> Jonatan Kristof!</span> <br /> Your Ticket is ready.
//       </h3>
//     </div>
//   );
// };

// export default Heading;

// src/components/Heading.js
// src/components/Heading.js
'use client';
import React from 'react';
import PropTypes from 'prop-types';

const Heading = ({ children, className = '' }) => {
  return (
    <div className={`heading-component ${className}`}>
      <h3 className="heading">{children}</h3>
    </div>
  );
};

Heading.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Heading;


