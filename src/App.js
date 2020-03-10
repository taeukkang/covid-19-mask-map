import React, { useEffect, useState, useRef, Suspense } from "react";
import MaskMap from "./components/MaskMap";
import { MaskDataContextProvider } from "./context/MaskDataContext";

function App() {
    return (
        // TODO: needs a better fallback
        <Suspense fallback={<div></div>}>
            <MaskDataContextProvider>
                <MaskMap />
            </MaskDataContextProvider>
        </Suspense>
    );
}

export default App;
