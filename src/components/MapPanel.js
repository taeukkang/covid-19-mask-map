import React, { useRef, useEffect } from "react";
import useNaverMaps from "../hooks/useNaverMaps";
import { useMaskData } from "../context/MaskDataContext";

function MapPanel() {
    const { setMapObj } = useMaskData();
    const mapRef = useRef();
    const loadMap = useNaverMaps();

    useEffect(() => {
        setMapObj(loadMap(mapRef));
    }, []);

    return (
        <>
            <div
                id="map"
                ref={mapRef}
                style={{ width: "100%", height: "100%" }}
            />
        </>
    );
}

export default MapPanel;
