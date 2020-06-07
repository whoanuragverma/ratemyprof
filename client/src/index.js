import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import "antd/dist/antd.css";
import SearchBarHome from "./components/searchbarhome";
import SearchFullPage from "./components/searchfullpage";
import UserMenu from "./components/usermenu";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter, Route } from "react-router-dom";
ReactDOM.render(
    <BrowserRouter>
        <React.StrictMode>
            <Route exact path="/" component={SearchBarHome} />
            <Route path="/search" component={SearchFullPage} />
            <Route path="/user" component={UserMenu} />
        </React.StrictMode>
    </BrowserRouter>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
