import React, { useEffect, useState, useRef, Suspense } from "react";
import {
    Accordion,
    Alert,
    Button,
    Container,
    Card,
    Row,
    Col,
    Spinner,
    Navbar,
    Nav,
    NavDropdown
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
    faPlusSquare,
    faChartArea,
    faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import axios from "axios";
import useNaverMaps from "./hooks/useNaverMaps";
import useNaverMapsMarkers from "./hooks/useNaverMapsMarkers";
import useGeolocation from "react-hook-geolocation";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import { storesByGeoDemo } from "./demoData";
import AppNav from "./components/AppNav";
import { useMaskData } from "./context/MaskDataContext";
import MapPanel from "./components/MapPanel";

function MaskMap() {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        i18n.changeLanguage("ko");
    }, []);

    const { mapObj } = useMaskData();

    const geoloc = useGeolocation();
    const [geolocState, setGeolocState] = useState(null);
    const { addMarker, resetMarker } = useNaverMapsMarkers();

    const [pinpoint, setPinpoint] = useState(null);

    const [dataPoints, setDataPoints] = useState(null);
    const [dataError, setDataError] = useState(false);
    const [storesInStockCount, setStoresInStockCount] = useState(null);
    const [storesOutOfStockCount, setStoresOutOfStockCount] = useState(null);

    useEffect(() => {
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let debug = params.get("debug");
        if (debug === "1") {
            console.log(storesByGeoDemo);
            setDataPoints(storesByGeoDemo);
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

            setDataPoints(result.data);
        };

        fetchStoresByGeo(pinpoint, 10000);
    }, [pinpoint]);

    useEffect(() => {
        if (!dataPoints || !mapObj) {
            return;
        }

        console.log(dataPoints);
        dataPoints.stores.map((store) => {
            addMarker(mapObj, store);
        });
        dataPoints.stores.forEach((store) => {
            if (checkInStock(store.remain_stat)) {
                setStoresInStockCount((prev) => prev + 1);
            } else {
                setStoresOutOfStockCount((prev) => prev + 1);
            }
        });
    }, [dataPoints]);

    useEffect(() => {
        if (!mapObj) {
            return;
        }
        window.naver.maps.Event.addListener(mapObj, "click", function(e) {
            resetMarker();
            setPinpoint({
                lat: e.coord.y,
                lng: e.coord.x
            });
        });
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
                            {dataError && (
                                <Alert variant="danger">
                                    <FontAwesomeIcon
                                        icon={faExclamationTriangle}
                                    />{" "}
                                    {t("error.failedToLoadData")}
                                </Alert>
                            )}
                            {dataPoints && (
                                <>
                                    <div className="d-flex flex-row justify-content-around text-center mb-4">
                                        <div
                                            className={`border p-2 pr-5 pl-5 ${
                                                activeTabKey === "inStock"
                                                    ? "bg-success text-white"
                                                    : ""
                                            }`}
                                            onClick={(e) =>
                                                onTabularLabelClick(
                                                    e,
                                                    "inStock"
                                                )
                                            }>
                                            <p className="h1">
                                                {storesInStockCount}
                                            </p>
                                            <p>{t("locationsInStock")}</p>
                                        </div>
                                        <div
                                            className={`border p-2 pr-5 pl-5 ${
                                                activeTabKey === "outOfStock"
                                                    ? "bg-danger text-white"
                                                    : ""
                                            }`}
                                            onClick={(e) =>
                                                onTabularLabelClick(
                                                    e,
                                                    "outOfStock"
                                                )
                                            }>
                                            <p className="h1">
                                                {storesOutOfStockCount}
                                            </p>
                                            <p>{t("locationsOutOfStock")}</p>
                                        </div>
                                    </div>
                                    <Accordion defaultActiveKey="0">
                                        {dataPoints.stores.map((store, idx) => {
                                            if (
                                                checkInStock(
                                                    store.remain_stat
                                                ) &&
                                                activeTabKey === "outOfStock"
                                            ) {
                                                return null;
                                            } else if (
                                                !checkInStock(
                                                    store.remain_stat
                                                ) &&
                                                activeTabKey === "inStock"
                                            ) {
                                                return null;
                                            }
                                            return (
                                                <Card>
                                                    <Card.Header>
                                                        <Accordion.Toggle
                                                            as={Button}
                                                            variant="link"
                                                            eventKey={idx}
                                                            className="p-0">
                                                            {store.name}
                                                        </Accordion.Toggle>
                                                    </Card.Header>
                                                    <Accordion.Collapse
                                                        eventKey={idx}>
                                                        <Card.Body>
                                                            <p className="m-0">
                                                                <span className="font-weight-bold">
                                                                    {t(
                                                                        "storeData.name"
                                                                    )}
                                                                    :{" "}
                                                                </span>
                                                                {store.name}
                                                            </p>
                                                            <p className="m-0">
                                                                <span className="font-weight-bold">
                                                                    {t(
                                                                        "storeData.address"
                                                                    )}
                                                                    :{" "}
                                                                </span>
                                                                {store.addr}
                                                            </p>
                                                            <p className="m-0">
                                                                <span className="font-weight-bold">
                                                                    {t(
                                                                        "storeData.remainingCount"
                                                                    )}
                                                                    :{" "}
                                                                </span>
                                                                {
                                                                    store.remain_cnt
                                                                }
                                                                /
                                                                {
                                                                    store.stock_cnt
                                                                }
                                                            </p>
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>
                                            );
                                        })}
                                    </Accordion>
                                </>
                            )}
                            {!dataPoints && !dataError && (
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
