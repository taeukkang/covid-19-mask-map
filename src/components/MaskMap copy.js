import React, { useEffect, useState, useRef, Suspense } from "react";
import { Alert, Container, Card, Row, Col, Spinner, Button } from "react-bootstrap";
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
import useInterval from "@use-it/interval";

function MaskMap() {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        i18n.changeLanguage("ko");
    }, []);

    const { mapObj, maskStores, setMaskStores } = useMaskData();

    const geoloc = null; //useGeolocation();
    const [geolocState, setGeolocState] = useState(null);
    const { addMarker, resetMarker } = useNaverMapsMarkers();

    const [pinpoint, setPinpoint] = useState(null);
    const [prevPinpoint, setPrevPinpoint] = useState(null);
    const [circle, setCircle] = useState(null);
    const [mapCheckCenterDelay, setMapCheckCenterDelay] = useState(1000);

    const [dataError, setDataError] = useState(false);
    const [storesInStockCount, setStoresInStockCount] = useState(null);
    const [storesOutOfStockCount, setStoresOutOfStockCount] = useState(null);

    const setNewMaskStores = (data) => {
        const priority = ["plenty", "some", "few", "empty", null];
        data.sort(
            (a, b) =>
                priority.indexOf(a.remain_stat) -
                priority.indexOf(b.remain_stat)
        );
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
            //resetMarker();
            mapObj.setZoom(12);
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
            console.warn("NEW REQUEST");
            return result.data.stores;
        };

        const fn = async () => {
            //resetMarker();
            setNewMaskStores(await fetchStoresByGeo(pinpoint, 500));
        };

        fn();
    }, [pinpoint]);

    useEffect(() => {
        if (!maskStores || !mapObj) {
            return;
        }
        //resetMarker();
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
    }, [mapObj, pinpoint, prevPinpoint, mapCheckCenterDelay]);

    useInterval(() => {
        const newCenter = mapObj.getCenter();
        let centerYCoord = newCenter.y;
        let centerXCoord = newCenter.x;
        console.log("hi");
        if (circle) {
            circle.setPosition({
                lat: centerYCoord,
                lng: centerXCoord
            });
        } else {
            setCircle(
                new window.naver.maps.Marker({
                    position: {
                        lat: centerYCoord,
                        lng: centerXCoord
                    },
                    map: mapObj,
                    icon: {
                        url: "./small_target.png",
                        size: new window.naver.maps.Size(22, 22),
                        origin: new window.naver.maps.Point(0, 0),
                        anchor: new window.naver.maps.Point(15, 0)
                    }
                })
            );
        }
    }, 1009);

    const captureCenterAndSearch = () => {
        const newCenter = mapObj.getCenter();
        let centerYCoord = newCenter.y;
        let centerXCoord = newCenter.x;
        setPinpoint({
            lat: centerYCoord,
            lng: centerXCoord
        })
    }

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
                    <Row>
                        <Col
                            md={6}
                            style={{
                                minHeight: "65vh",
                                height: "65vh",
                                maxHeight: "65vh"
                            }}>
                            <MapPanel />
                            <Button variant="outline-primary" size="fluid" onClick={captureCenterAndSearch}>🟢 주변 판매처 탐색하기</Button>
                        </Col>
                        <Col md={6}>
                            <div className="border border-info bg-info text-white p-1">
                                지도를 더블클릭하거나 길게 터치(2초)해서 주변
                                마스크 판매점을 확인하세요.
                            </div>
                            {dataError && (
                                <Alert variant="danger" className="mt-1">
                                    <FontAwesomeIcon
                                        icon={faExclamationTriangle}
                                    />{" "}
                                    {t("error.failedToLoadData")}
                                </Alert>
                            )}
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
