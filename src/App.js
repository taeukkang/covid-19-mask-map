import React, { useEffect, useState, useRef, Suspense } from "react";
import MaskMap from "./MaskMap";

function App() {
    return (
        // TODO: needs a better fallback
        <Suspense fallback={<div></div>}>
            <MaskMap />
        </Suspense>
    );
}

export default App;
