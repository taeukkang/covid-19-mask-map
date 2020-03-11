import React, { useEffect, useState, useCallback } from "react";
import {
    Alert,
    Container,
    Card,
    Row,
    Col,
    Spinner,
    Button
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import useNaverMapsMarkers from "../hooks/useNaverMapsMarkers";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import { storesByGeoDemo } from "../demoData";
import { useMaskData } from "../context/MaskDataContext";
import MapPanel from "./MapPanel";
import RemainingStockBadge from "./RemainingStockBadge";
import MaskStoreTable2 from "./MaskStoreTable2";

function MaskMap() {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        i18n.changeLanguage("ko");
    }, []);

    const {
        mapObj,
        maskStores,
        setMaskStores,
        centerCoord,
        setCenterCoord
    } = useMaskData();
    const {
        addMarker,
        addColorIndicatorMarkers,
        resetMarker
    } = useNaverMapsMarkers();

    const [isLoading, setIsLoading] = useState(false);
    const [dataError, setDataError] = useState(false);

    const setNewMaskStores = useCallback(
        (data) => {
            const priority = ["plenty", "some", "few", "empty", null];
            data.sort(
                (a, b) =>
                    priority.indexOf(a.remain_stat) -
                    priority.indexOf(b.remain_stat)
            );
            setMaskStores(data);
        },
        [setMaskStores]
    );

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
        const fetchStoresByGeo = async (loc, range) => {
            const serverUrl = `https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?lat=${loc.lat}&lng=${loc.lng}&m=${range}`;

            let result;
            try {
                setIsLoading(true);
                result = await axios(serverUrl);
                setIsLoading(false);
            } catch (error) {
                console.error("An error occurred in fetchStoresByGeo:", error);
                setDataError(true);
                setIsLoading(false);
                throw Error("Failed");
            }
            return result.data.stores;
        };

        const fn = async () => {
            //resetMarker();
            console.log("Fetching store data...");
            let data;
            try {
                data = await fetchStoresByGeo(centerCoord, 500);
                console.log(`New store data fetched`);
                console.log(data);
                setNewMaskStores(data);
            } catch {
                console.error("Failed to fetch data");
            }
        };

        fn();
    }, [centerCoord, setNewMaskStores]);

    useEffect(() => {
        if (mapObj) {
            mapObj.setCenter(centerCoord);
            mapObj.setZoom(14);
        }
    }, [mapObj, centerCoord]);

    useEffect(() => {
        if (!mapObj) {
            return;
        }

        addColorIndicatorMarkers(mapObj, maskStores);
    }, [maskStores]);

    const onClickMapRelocate = () => {
        const newCenter = mapObj.getCenter();
        setCenterCoord({
            lat: newCenter.y,
            lng: newCenter.x
        });
    };

    return (
        <>
            <main>
                <Container id="mainContainer">
                    <Row>
                        <Col sm={12}>
                            <Alert variant="warning">
                                <FontAwesomeIcon icon={faExclamationTriangle} />{" "}
                                {t("notice.apiIsInBeta")}
                            </Alert>
                        </Col>
                    </Row>
                    <Row>
                        <Col
                            md={6}>
                            <MapPanel/>
                            <Button
                                variant="outline-primary"
                                className="mt-1 mb-1"
                                block
                                onClick={onClickMapRelocate}>
                                🟢 주변 판매처 탐색하기
                            </Button>
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

                            {isLoading ? (
                                <Spinner animation="border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                            ) : maskStores && maskStores.length ? (
                                <>
                                    <MaskStoreTable2
                                        style={{
                                            overflow: "auto",
                                            maxHeight: "100px"
                                        }}
                                    />
                                </>
                            ) : (
                                <Alert variant="danger">
                                    주변에 마스크 판매처가 없습니다. 지도를 이동한 후 지도 아래의 재검색 버튼을 이용해 주세요.
                                </Alert>
                            )}
                        </Col>
                    </Row>
                </Container>
            </main>
        </>
    );
}

export default MaskMap;
