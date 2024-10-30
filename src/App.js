import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Заголовок страницы</title>
        <link rel="stylesheet" type="text/css" href="style.css"/>
      </head>
      <header class="header">
        <div class="site_name">
            <h2>
                Personal Music
            </h2>
            <nav class="menu">
                <a class="sub_menu" href="index.html">Главная страница</a>
                <a class="sub_menu" href="catalog.html">Каталог</a>
              </nav>
        </div>
      </header>
      <main>
        <audio controls id="song">
            <source src="media/RIOT - Overkill.mp3" type="audio/mpeg" />
        </audio>
        <input type="range" value="0" id="progress"></input>
      </main>
    </div>
  );
}

export default App;
