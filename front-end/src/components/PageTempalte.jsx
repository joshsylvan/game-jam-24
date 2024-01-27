import { useEffect } from "react";
import { useGameContext } from "../context/GameContext";
import { useNavigate } from "react-router";

// eslint-disable-next-line react/prop-types
export const PageTemplate = ({ children }) => {
  const { name, id } = useGameContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id || (!name && window.location.pathname !== "/")) {
      navigate("/");
    }
  }, []);

  return <>{children}</>;
};
