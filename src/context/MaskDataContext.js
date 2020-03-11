import React, { useState, useContext, createContext, useEffect } from "react";

export const MaskDataContext = createContext({
    mapObj: null,
    setMapObj: () => {},
    maskStores: {},
    setMaskStores: () => {},
    centerCoord: null,
    setCenterCoord: () => {}
});

export function MaskDataContextProvider({ children }) {
    const [mapObj, setMapObj] = useState(null);
    const [maskStores, setMaskStores] = useState([]);
    const [centerCoord, setCenterCoord] = useState(null);

    return (
        <MaskDataContext.Provider
            value={{
                mapObj,
                setMapObj,
                maskStores,
                setMaskStores,
                centerCoord,
                setCenterCoord
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
