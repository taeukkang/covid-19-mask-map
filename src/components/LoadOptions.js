import { faLocationArrow, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import useGeolocation from "react-hook-geolocation";
import { useTranslation } from "react-i18next";
import MaskMapIntro from "../assets/MaskMapIntro.svg";
import { useMaskData } from "../context/MaskDataContext";
import "../css/maskmap-custom.css";

function LoadOptions() {
    const geoloc = useGeolocation();
    const [geolocState, setGeolocState] = useState(null);
    const [geolocWhenAvailable, setGeolocWhenAvailable] = useState(false);
    const { setCenterCoord } = useMaskData();

    const { t } = useTranslation();

    const [address, setAddress] = useState("");

    const fetchGeocode = async (address) => {
        let data;
        try {
            data = await axios.get(
                `${
                    process.env.NODE_ENV === "development"
                        ? "http://localhost:4000"
                        : "https://api.livecorona.co.kr"
                }/?address=${address}`
            );
            return data;
        } catch (error) {
            console.error(error);
            console.log("Failed to retrieve geocoding for: " + address);
        }
    };

    useEffect(() => {
        setAddress(localStorage.getItem("lastSearchedAddress"));
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

        if (geolocWhenAvailable) {
            if (
                geoloc.accuracy != null ||
                geoloc.latitude != null ||
                geoloc.longitude != null
            ) {
                const coord = {
                    lat: geoloc.latitude,
                    lng: geoloc.longitude,
                };
                setCenterCoord(coord);
                console.log(coord);
            }
        }
    }, [geoloc, geolocWhenAvailable, setCenterCoord]);

    const onClickGeoloc = () => {
        if (geolocState !== "granted") {
            alert("위치 권한을 브라우저 설정에서 허용해야 사용할 수 있습니다");
        }

        setGeolocWhenAvailable(true);
    };

    const onClickAddress = async () => {
        if (address.length < 1) {
            alert("주소를 입력해 주세요.");
            return;
        }

        localStorage.setItem("lastSearchedAddress", address);

        let geocodes;
        try {
            geocodes = await fetchGeocode(address);
        } catch (error) {
            console.error(error);
            alert("주소를 찾을 수 없습니다. 다시 시도해 주십시오.");
            return;
        }

        console.log(geocodes.data);

        if (!geocodes.data.meta.totalCount) {
            alert("주소를 찾을 수 없습니다. 다시 시도해 주십시오.");
            return;
        }

        let coord = {
            lat: geocodes.data.addresses[0].y,
            lng: geocodes.data.addresses[0].x,
        };

        setCenterCoord(coord);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onClickAddress();
    };

    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <div className="text-center mb-5">
                            <img
                                src={MaskMapIntro}
                                alt="공적 마스크 판매처"
                                width="100vw"
                                className="mb-3"
                            />
                            <h1 className="title" style={{ paddingTop: 10 }}>
                                {t("searchMaskStores")}
                            </h1>
                        </div>
                    </Col>
                </Row>
                <Row className="justify-content-center mb-3 text-center">
                    <Col sm={12} md={6} lg={5}>
                        <Form onSubmit={handleFormSubmit}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>
                                    {t("addressInputLabel")}
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                                <Form.Text className="text-muted">
                                    {t("addressInputExample")}
                                </Form.Text>
                            </Form.Group>
                            <div className="d-flex flex-column">
                                <Button
                                    variant="primary"
                                    className="mb-2"
                                    onClick={onClickAddress}>
                                    <FontAwesomeIcon icon={faSearch} />{" "}
                                    {t("searchByAddress")}
                                </Button>
                                <Button
                                    variant="outline-primary"
                                    onClick={onClickGeoloc}>
                                    <FontAwesomeIcon icon={faLocationArrow} />{" "}
                                    {t("searchByGeoloc")}
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default LoadOptions;
