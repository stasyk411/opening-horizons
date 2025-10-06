// Простой компонент колеса баланса
export default function BalanceWheel() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl shadow-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Колесо баланса жизни</h1>
        <p className="text-white/90">Оцени каждую сферу своей жизни</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {["Здоровье", "Развитие", "Финансы", "Хобби", "Семья", "Карьера"].map((area) => (
          <div key={area} className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{area}</h3>
            <p className="text-gray-600">Нажми чтобы оценить</p>
          </div>
        ))}
      </div>
    </div>
  );
}
