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

function MaskMap() {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        i18n.changeLanguage("ko");
    }, []);

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

        navigator.permissions.query({ name: "geolocation" }).then((result) => {
            setGeolocState(result.state);
        });

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
            mapObj.setZoom(14);
            mapObj.setCenter(coord);
        }
    }, [geoloc]);

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

    const mapRef = useRef();
    const loadMap = useNaverMaps();
    const [mapObj, setMapObj] = useState(null);

    useEffect(() => {
        if (mapRef && mapRef.current) {
            setMapObj(loadMap(mapRef));
        }
    }, [mapRef, loadMap]);

    useEffect(() => {
        if (!dataPoints || !mapObj) {
            return;
        }
        console.log(dataPoints);
        dataPoints.stores.map((store) => {
            addMarker(mapObj, store);
        });
        dataPoints.stores.forEach((store) => {
            if (store.sold_out) {
                setStoresOutOfStockCount((prev) => prev + 1);
            } else {
                setStoresInStockCount((prev) => prev + 1);
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
                <Navbar bg="light" className="mb-3 navbar-mobile-thin">
                    <Navbar.Brand href="/">
                        <FontAwesomeIcon
                            icon={faPlusSquare}
                            size="lg"
                            className="mr-2"
                        />
                        {t("appName")}
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <NavDropdown title="🌐 Language">
                                <NavDropdown.Item
                                    onClick={() => i18n.changeLanguage("ko")}>
                                    한국어
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                    onClick={() => i18n.changeLanguage("en")}>
                                    English
                                </NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link href="https://livecorona.co.kr">
                                <FontAwesomeIcon icon={faChartArea} size="lg" />
                            </Nav.Link>
                            <Nav.Link href="https://github.com/LiveCoronaDetector/">
                                <FontAwesomeIcon icon={faGithub} size="lg" />
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </header>
            <main>
                <Container>
                    <Row>
                        <Col sm={12}>
                            {geolocState && geolocState === "denied" && (
                                <Alert variant="danger">
                                    <FontAwesomeIcon
                                        icon={faExclamationTriangle}
                                    />{" "}
                                    위치 권한을 허용하지 않아 지도를 자동으로
                                    불러오지 못했습니다.
                                </Alert>
                            )}
                        </Col>
                    </Row>
                    <Row style={{ minHeight: "65vh" }}>
                        <Col md={6}>
                            <div
                                id="map"
                                ref={mapRef}
                                style={{ width: "100%", height: "100%" }}
                            />
                        </Col>
                        <Col md={6}>
                            {dataError && (
                                <Alert variant="danger">
                                    <FontAwesomeIcon
                                        icon={faExclamationTriangle}
                                    />{" "}
                                    {t("errors.failedToLoadData")}
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
                                                store.sold_out &&
                                                activeTabKey === "inStock"
                                            ) {
                                                return null;
                                            } else if (
                                                !store.sold_out &&
                                                activeTabKey === "outOfStock"
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
