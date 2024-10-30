import React from "react";
import Catalog from "../pages/catalog/catalog.tsx";
import { Home } from "../pages/home/home.tsx";
import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";

const AppRouter = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" Component={Home} />
				<Route path="/catalog" Component={Catalog} />
			</Routes>
		</BrowserRouter>
	);
};

export default AppRouter;
