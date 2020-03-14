import React, { useEffect } from "react";
import { useMaskData } from "../context/MaskDataContext";
import AppNav from "./AppNav";
import SearchLocation from "./SearchLocation";
import MaskMap from "./MaskMap";
import { Switch, Route, Redirect } from "react-router-dom";

function Routes() {
    const { centerCoord } = useMaskData();

    useEffect(() => {
        console.log(centerCoord);
    }, [centerCoord]);

    return (
        // TODO: needs a better fallback\
        <>
            <Switch>
                <Route path="/" exact>
                    <Redirect to="/search" />
                </Route>
                <Route path="/search">
                    <SearchLocation />
                </Route>
                <Route path="/results/:lat/:lng">
                    <MaskMap />
                </Route>
            </Switch>
        </>
    );
}

export default Routes;
