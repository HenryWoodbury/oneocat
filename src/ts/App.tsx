import carpe from 'styles/assets/carpe.svg';
import 'styles/global.sass';
import css from 'styles/app.module.sass';

function App() {
  return (
    <div className={css.app}>
      <header className={css.appHeader}>
        <img src={carpe} className={css.appLogo} alt="logo" />
      </header>
    </div>
  );
}

export default App;
