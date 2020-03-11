import React, { useEffect } from "react";
import { useMaskData } from "../context/MaskDataContext";
import LoadOptions from "./LoadOptions";
import MaskMap from "./MaskMap";

function MaskStatus() {
    const { centerCoord, setCenterCoord } = useMaskData();

    /* useEffect(() => {
        console.log(centerCoord);
        setCenterCoord({
            lat: 37.503939,
            lng: 127.052462
        });
    }, []); */
    return <>{!centerCoord ? <LoadOptions /> : <MaskMap />}</>;
}

export default MaskStatus;
