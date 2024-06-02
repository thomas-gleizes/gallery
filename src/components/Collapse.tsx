import React from "react";

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
}

const Collapse: React.FC<Props> = ({ children, isOpen }) => {
  return (
    <div
      style={{
        display: isOpen ? "block" : "none",
      }}
    >
      {children}
    </div>
  );
};

export default Collapse;
