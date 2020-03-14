import React, { Suspense, useEffect } from "react";
import {
    MaskDataContextProvider,
    useMaskData
} from "../context/MaskDataContext";
import AppNav from "./AppNav";
import SearchLocation from "./SearchLocation";
import MaskMap from "./MaskMap";
import "../App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Routes from "./Routes";

function App() {
    const { centerCoord } = useMaskData();

    useEffect(() => {
        console.log(centerCoord);
    }, [centerCoord]);

    return (
        // TODO: needs a better fallback\
        <Suspense fallback={<div></div>}>
            <MaskDataContextProvider>
                <Router>
                    <AppNav />
                    <Routes />
                </Router>
            </MaskDataContextProvider>
        </Suspense>
    );
}

export default App;
