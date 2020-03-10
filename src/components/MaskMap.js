import React, { useEffect, useState, useRef, Suspense } from "react";
import { Alert, Container, Card, Row, Col, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
    faPlusSquare,
    faChartArea,
    faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import useNaverMaps from "../hooks/useNaverMaps";
import useNaverMapsMarkers from "../hooks/useNaverMapsMarkers";
import useGeolocation from "react-hook-geolocation";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import { storesByGeoDemo } from "../demoData";
import AppNav from "./AppNav";
import { useMaskData } from "../context/MaskDataContext";
import MapPanel from "./MapPanel";
import MaskStoreTable from "./MaskStoreTable";
import RemainingStockBadge from "./RemainingStockBadge";
import MaskStoreTable2 from "./MaskStoreTable2";

function MaskMap() {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        i18n.changeLanguage("ko");
    }, []);

    const { mapObj, maskStores, setMaskStores } = useMaskData();

    const geoloc = useGeolocation();
    const [geolocState, setGeolocState] = useState(null);
    const { addMarker, resetMarker } = useNaverMapsMarkers();

    const [pinpoint, setPinpoint] = useState(null);

    const [dataError, setDataError] = useState(false);
    const [storesInStockCount, setStoresInStockCount] = useState(null);
    const [storesOutOfStockCount, setStoresOutOfStockCount] = useState(null);

    const setNewMaskStores = (data) => {
        const priority = ["plenty", "some", "few", "empty"];
        data.sort(
            (a, b) =>
                priority.indexOf(a.remain_stat) -
                priority.indexOf(b.remain_stat)
        );
        console.log(data);
        setMaskStores(data);
    };

    useEffect(() => {
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let debug = params.get("debug");
        if (debug === "1") {
            console.log(storesByGeoDemo);
            setNewMaskStores(storesByGeoDemo.stores);
        }
    }, []);

    useEffect(() => {
        if (!geoloc) {
            return;
        }

        // navigator.permissions is an experimental API that is
        // unsupported in iOS, so it needs a try-catch block
        try {
            navigator.permissions
                .query({ name: "geolocation" })
                .then((result) => {
                    setGeolocState(result.state);
                });
        } catch (error) {
            console.error(error);
            setGeolocState("unknown");
        }

        if (
            geoloc.accuracy != null ||
            geoloc.latitude != null ||
            geoloc.longitude != null
        ) {
            const coord = {
                lat: geoloc.latitude,
                lng: geoloc.longitude
            };
            setPinpoint(coord);
            //mapObj.setZoom(14);
            mapObj.setCenter(coord);
        }
    }, [geoloc]);

    const checkInStock = (remainStat) => {
        switch (remainStat) {
            case "plenty":
                return true;
            case "some":
                return true;
            case "few":
                return true;
            case "empty":
                return false;
            default:
                return false;
        }
    };

    useEffect(() => {
        if (!pinpoint) {
            return;
        }

        const fetchStoresByGeo = async (loc, range) => {
            const serverUrl = `https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?lat=${loc.lat}&lng=${loc.lng}&m=${range}`;

            let result;
            try {
                result = await axios(serverUrl);
            } catch (error) {
                console.error("An error occurred in fetchStoresByGeo:", error);
                setDataError(true);
                return;
            }

            // TODO: optimize logic and duplicate code
            // what this does is when there's too much places, it makes the range smaller
            // this might have to move to somewhere else
            if (result.data.count > 50) {
                const serverUrl = `https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?lat=${
                    loc.lat
                }&lng=${loc.lng}&m=${range / 2}`;

                try {
                    result = await axios(serverUrl);
                } catch (error) {
                    console.error(
                        "An error occurred in fetchStoresByGeo:",
                        error
                    );
                    return;
                }
            }

            setNewMaskStores(result.data);
        };

        fetchStoresByGeo(pinpoint, 10000);
    }, [pinpoint]);

    useEffect(() => {
        if (!maskStores || !mapObj) {
            return;
        }

        console.log(maskStores);
        maskStores.map((store) => {
            addMarker(mapObj, store);
        });
        maskStores.forEach((store) => {
            if (checkInStock(store.remain_stat)) {
                setStoresInStockCount((prev) => prev + 1);
            } else {
                setStoresOutOfStockCount((prev) => prev + 1);
            }
        });
    }, [maskStores]);

    useEffect(() => {
        if (!mapObj) {
            return;
        }
    }, [mapObj]);

    const [activeTabKey, setActiveTabKey] = useState("inStock");
    const onTabularLabelClick = (e, key) => {
        setActiveTabKey(key);
    };

    return (
        <>
            <header className="App-header">
                <AppNav />
            </header>
            <main>
                <Container>
                    <Row>
                        <Col sm={12}>
                            <Alert variant="warning">
                                <FontAwesomeIcon icon={faExclamationTriangle} />{" "}
                                {t("notice.apiIsInBeta")}
                            </Alert>
                            {geolocState && geolocState === "denied" && (
                                <Alert variant="danger">
                                    <FontAwesomeIcon
                                        icon={faExclamationTriangle}
                                    />{" "}
                                    {t("error.failedToAccessGeolocation")}
                                </Alert>
                            )}
                        </Col>
                    </Row>
                    <Row style={{ minHeight: "65vh" }}>
                        <Col md={6}>
                            <MapPanel />
                        </Col>
                        <Col md={6}>
                            <div className="border p-1 mb-1 d-flex flex-row justify-content-between">
                                <div>
                                    <RemainingStockBadge remainingStockStr="plenty" />{" "}
                                    100개 이상
                                </div>
                                <div>
                                    <RemainingStockBadge remainingStockStr="some" />{" "}
                                    30개-100개
                                </div>
                                <div>
                                    <RemainingStockBadge remainingStockStr="few" />{" "}
                                    2개-30개
                                </div>
                                <div>
                                    <RemainingStockBadge remainingStockStr="empty" />{" "}
                                    0개
                                </div>
                            </div>
                            {dataError && (
                                <Alert variant="danger">
                                    <FontAwesomeIcon
                                        icon={faExclamationTriangle}
                                    />{" "}
                                    {t("error.failedToLoadData")}
                                </Alert>
                            )}
                            {maskStores && (
                                <>
                                    <MaskStoreTable2
                                        style={{
                                            overflow: "auto",
                                            maxHeight: "100px"
                                        }}
                                    />
                                </>
                            )}
                            {!maskStores && !dataError && (
                                <Spinner animation="border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                            )}
                        </Col>
                    </Row>
                </Container>
            </main>
        </>
    );
}

export default MaskMap;
