/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

import { loadingScreenFacts } from "./loadingScreenFacts";

import "./loader.css";

export const Loader = ({ showFacts = true }) => {
  const [fact, setFact] = useState(false);

  useEffect(() => {
    const newFact =
      loadingScreenFacts[Math.floor(Math.random() * loadingScreenFacts.length)];

    const interval = setInterval(() => setFact(newFact), 5000);
    return () => {
      clearInterval(interval);
    };
  }, [fact]);
  return (
    <div className="loader-container">
      <div className="loader">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p className="loader-text">Thinking</p>
      <p className="loader-fact">{showFacts && fact}</p>
    </div>
  );
};
