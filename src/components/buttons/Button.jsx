import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ text, classname, onClick, children }) => {
  return (
    <button className={classname} onClick={onClick}>
      {children} {text}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string, // `text` is an optional string prop
  classname: PropTypes.string,       // `classname` is an optional string prop
  onClick: PropTypes.func,           // `onClick` is a function prop
  children: PropTypes.node           // `children` can be any valid React node
};

export default Button;