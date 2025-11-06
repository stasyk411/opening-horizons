import React from "react";

interface LifeWheelAppProps {
  isMobile: boolean;
}

const LifeWheelApp: React.FC<LifeWheelAppProps> = ({ isMobile }) => {
  return (
    <div style={{ padding: isMobile ? "15px" : "20px" }}>
      <h2 style={{ color: "#8A2BE2", marginBottom: "20px" }}>
        🎡 Колесо баланса жизни
      </h2>
      <div
        style={{
          background: "rgba(255,255,255,0.1)",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <p>Функционал колеса баланса будет добавлен позже.</p>
        <p style={{ fontSize: "3em", margin: "20px 0" }}>🎯</p>
        <p>Работает над балансом всех сфер жизни</p>
      </div>
    </div>
  );
};

export { LifeWheelApp };
