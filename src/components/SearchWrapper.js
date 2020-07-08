import React from "react";
import { useMaskData } from "../context/MaskDataContext";
import Search from "./Search";
import SearchResult from "./SearchResult";

function SearchWrapper() {
    const { centerCoord } = useMaskData();

    return <>{!centerCoord ? <Search /> : <SearchResult />}</>;
}

export default SearchWrapper;
