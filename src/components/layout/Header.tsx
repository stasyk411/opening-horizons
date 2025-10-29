// 📝 ШАГ 2: Удаляем логику авторизации из Header
const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header__content">
        <h1 className="header__title">Колесо Жизни</h1>
        <nav className="header__nav">
          {/* Убираем кнопку входа и оставляем только навигацию */}
        </nav>
      </div>
    </header>
  );
};
