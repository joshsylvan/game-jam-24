/* eslint-disable react/prop-types */
import clsx from "clsx";
import "./button.css";

export const Button = ({ children, onClick, hueRotation, className }) => {
  return (
    <button
      className={clsx("tron-button", className)}
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
