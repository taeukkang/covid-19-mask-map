import React from "react";
import { useMaskData } from "../context/MaskDataContext";
import LoadOptions from "./LoadOptions";
import MaskMap from "./MaskMap";

function MaskStatus() {
    const { centerCoord } = useMaskData();

    return <>{!centerCoord ? <LoadOptions /> : <MaskMap />}</>;
}

export default MaskStatus;
