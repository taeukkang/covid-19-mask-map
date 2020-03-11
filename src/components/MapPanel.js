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
                style={{ minHeight: "45vh", height: "45vh", maxHeight: "65vh" }}
            />
        </>
    );
}

export default MapPanel;
