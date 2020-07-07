import React, { createContext, useContext, useState } from "react";

export const MaskDataContext = createContext({
    mapObj: null,
    setMapObj: () => {},
    maskStores: {},
    setMaskStores: () => {},
    centerCoord: null,
    setCenterCoord: () => {},
    markerFilter: {
        plenty: true,
        some: true,
        few: true,
        empty: false,
    },
    setMarkerFilter: () => {},
});

export function MaskDataContextProvider({ children }) {
    const [mapObj, setMapObj] = useState(null);
    const [maskStores, setMaskStores] = useState([]);
    const [centerCoord, setCenterCoord] = useState(null);
    const [markerFilter, setMarkerFilter] = useState({
        plenty: true,
        some: true,
        few: true,
        empty: false,
    });

    return (
        <MaskDataContext.Provider
            value={{
                mapObj,
                setMapObj,
                maskStores,
                setMaskStores,
                centerCoord,
                setCenterCoord,
                markerFilter,
                setMarkerFilter,
            }}>
            {children}
        </MaskDataContext.Provider>
    );
}

export function useMaskData() {
    const context = useContext(MaskDataContext);

    if (context === undefined) {
        throw new Error(
            "useMaskData must be used within a MaskDataContextProvider"
        );
    }
    return context;
}
