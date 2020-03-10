import React, { useState, useContext, createContext } from "react";

export const MaskDataContext = createContext({
    mapObj: null,
    setMapObj: () => {}
});

export function MaskDataContextProvider({ children }) {
    const [mapObj, setMapObj] = useState(null);

    return (
        <MaskDataContext.Provider
            value={{
                mapObj,
                setMapObj
            }}>
            {children}
        </MaskDataContext.Provider>
    );
}

export function useMaskData() {
    const context = useContext(MaskDataContext);

    if (context === undefined) {
        throw new Error("useMaskData must be used within a MaskDataContextProvider");
    }
    return context;
}
