import React, { Suspense } from "react";
import "./App.css";
import AppNav from "./components/AppNav";
import SearchWrapper from "./components/SearchWrapper";
import { MaskDataContextProvider } from "./context/MaskDataContext";

function App() {
    return (
        // TODO: needs a better fallback
        <Suspense fallback={<div></div>}>
            <MaskDataContextProvider>
                <header className="App-header">
                    <AppNav />
                </header>
                <SearchWrapper />
            </MaskDataContextProvider>
        </Suspense>
    );
}

export default App;
