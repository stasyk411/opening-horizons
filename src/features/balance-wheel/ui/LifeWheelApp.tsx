import React, { useState, useEffect } from 'react';

interface LifeWheelAppProps {
  isMobile: boolean;
  settings: any;
}

export const LifeWheelApp: React.FC<LifeWheelAppProps> = ({ isMobile, settings }) => {
  const [dimensions, setDimensions] = useState({
    career: 5,
    finance: 5,
    health: 5,
    family: 5,
    friends: 5,
    hobbies: 5,
    development: 5,
    spirituality: 5
  });

  const [savedWheels, setSavedWheels] = useState<any[]>([]);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('lifeWheels');
    if (saved) {
      setSavedWheels(JSON.parse(saved));
    }
  }, []);

  const saveWheel = () => {
    const newWheel = {
      id: Date.now(),
      date: new Date().toLocaleDateString('ru-RU'),
      dimensions: { ...dimensions }
    };
    
    const updatedWheels = [newWheel, ...savedWheels.slice(0, 9)];
    setSavedWheels(updatedWheels);
    localStorage.setItem('lifeWheels', JSON.stringify(updatedWheels));
    
    alert('Колесо жизни сохранено! ?');
  };

  const loadWheel = (wheel: any) => {
    setDimensions(wheel.dimensions);
    setShowSaved(false);
  };

  const deleteWheel = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedWheels = savedWheels.filter(wheel => wheel.id !== id);
    setSavedWheels(updatedWheels);
    localStorage.setItem('lifeWheels', JSON.stringify(updatedWheels));
  };

  const wheelDimensions = [
    { key: 'career', label: 'Карьера', color: '#FF6B6B' },
    { key: 'finance', label: 'Финансы', color: '#4ECDC4' },
    { key: 'health', label: 'Здоровье', color: '#45B7D1' },
    { key: 'family', label: 'Семья', color: '#96CEB4' },
    { key: 'friends', label: 'Друзья', color: '#FFEAA7' },
    { key: 'hobbies', label: 'Хобби', color: '#DDA0DD' },
    { key: 'development', label: 'Развитие', color: '#98D8C8' },
    { key: 'spirituality', label: 'Духовность', color: '#F7DC6F' }
  ];

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '100%', 
      overflowX: 'hidden',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '30px',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '40px',
          fontSize: isMobile ? '2em' : '2.5em',
          color: 'white'
        }}>
          ? Колесо Жизни
        </h1>

        {!showSaved ? (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: '40px',
              alignItems: 'start'
            }}>
              {/* Wheel Visualization */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  position: 'relative',
                  width: isMobile ? '250px' : '300px',
                  height: isMobile ? '250px' : '300px',
                  margin: '0 auto',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                  borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)'
                }}>
                  {wheelDimensions.map((dim, index) => {
                    const angle = (index * 45) * Math.PI / 180;
                    const value = dimensions[dim.key as keyof typeof dimensions];
                    const radius = (value / 10) * (isMobile ? 110 : 130);
                    const x = Math.cos(angle) * radius + (isMobile ? 125 : 150);
                    const y = Math.sin(angle) * radius + (isMobile ? 125 : 150);
                    
                    return (
                      <div key={dim.key}>
                        <div style={{
                          position: 'absolute',
                          left: ${x}px,
                          top: ${y}px,
                          width: '12px',
                          height: '12px',
                          background: dim.color,
                          borderRadius: '50%',
                          transform: 'translate(-50%, -50%)',
                          border: '2px solid white'
                        }} />
                        <div style={{
                          position: 'absolute',
                          left: ${x}px,
                          top: ${y}px,
                          width: '2px',
                          height: ${radius}px,
                          background: dim.color,
                          opacity: 0.6,
                          transform: 	ranslate(-50%, -50%) rotate(rad),
                          transformOrigin: 'bottom center'
                        }} />
                      </div>
                    );
                  })}
                  
                  {/* Center point */}
                  <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: '8px',
                    height: '8px',
                    background: 'white',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)'
                  }} />
                </div>
              </div>

              {/* Controls */}
              <div>
                <div style={{
                  display: 'grid',
                  gap: '20px'
                }}>
                  {wheelDimensions.map(dim => (
                    <div key={dim.key} style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '15px',
                      borderRadius: '10px',
                      border: 2px solid 
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px'
                      }}>
                        <span style={{ 
                          fontWeight: 'bold',
                          color: dim.color
                        }}>
                          {dim.label}
                        </span>
                        <span style={{ 
                          background: dim.color,
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '14px'
                        }}>
                          {dimensions[dim.key as keyof typeof dimensions]}/10
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={dimensions[dim.key as keyof typeof dimensions]}
                        onChange={(e) => setDimensions(prev => ({
                          ...prev,
                          [dim.key]: parseInt(e.target.value)
                        }))}
                        style={{
                          width: '100%',
                          height: '8px',
                          background: linear-gradient(to right,  0%,  %, rgba(255,255,255,0.3) %, rgba(255,255,255,0.3) 100%),
                          borderRadius: '5px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div style={{
                  display: 'flex',
                  gap: '15px',
                  marginTop: '30px',
                  justifyContent: 'center'
                }}>
                  <button
                    onClick={saveWheel}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '25px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  >
                    ? Сохранить колесо
                  </button>
                  
                  {savedWheels.length > 0 && (
                    <button
                      onClick={() => setShowSaved(true)}
                      style={{
                        padding: '12px 24px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        border: '2px solid rgba(255, 255, 255, 0.5)',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        fontSize: '16px'
                      }}
                    >
                      ? История сохранений
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div>
            <button
              onClick={() => setShowSaved(false)}
              style={{
                padding: '10px 20px',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '20px',
                cursor: 'pointer',
                marginBottom: '20px'
              }}
            >
              ← Назад к колесу
            </button>
            
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
              ? История сохранений
            </h3>
            
            <div style={{
              display: 'grid',
              gap: '15px',
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              {savedWheels.map((wheel) => (
                <div
                  key={wheel.id}
                  onClick={() => loadWheel(wheel)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '15px',
                    borderRadius: '10px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontWeight: 'bold' }}>
                      Колесо от {wheel.date}
                    </span>
                    <button
                      onClick={(e) => deleteWheel(wheel.id, e)}
                      style={{
                        background: 'rgba(255, 100, 100, 0.3)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '5px 10px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
