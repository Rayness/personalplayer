import React from "react";
import { Link } from "react-router-dom";

export const Home = () => {
	return (
		<div className="App">
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				/>
				<title>Заголовок страницы</title>
			</head>
			<header className="header">
				<div className="site_name">
					<h2>Personal Music</h2>
					<nav className="menu">
						<Link to="/" className="sub_menu">
							Главная страница
						</Link>
						<Link to="/catalog" className="sub_menu">
							Каталог
						</Link>
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
};
