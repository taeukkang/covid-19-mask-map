import React, { Suspense } from "react";
import { MaskDataContextProvider } from "./context/MaskDataContext";
import AppNav from "./components/AppNav";
import MaskStatus from "./components/MaskStatus";
import "./App.css";

function App() {
    return (
        // TODO: needs a better fallback
        <Suspense fallback={<div></div>}>
            <MaskDataContextProvider>
                <header className="App-header">
                    <AppNav />
                </header>
                <MaskStatus />
            </MaskDataContextProvider>
        </Suspense>
    );
}

export default App;
