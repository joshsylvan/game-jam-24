/* eslint-disable react/prop-types */
import "./button.css";

export const Button = ({ children, onClick, hueRotation }) => {
  return (
    <button
      className="tron-button"
      onClick={onClick}
      style={{ filter: "hue-rotate(" + hueRotation + "deg)" }}
    >
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      {children}
    </button>
  );
};
