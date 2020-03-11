import React, { useState, useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import useGeolocation from "react-hook-geolocation";
import { useMaskData } from "../context/MaskDataContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faStoreAlt,
    faSearch,
    faLocationArrow
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Form } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";

function LoadOptions() {
    const geoloc = useGeolocation();
    const [geolocState, setGeolocState] = useState(null);
    const [geolocWhenAvailable, setGeolocWhenAvailable] = useState(false);
    const { centerCoord, setCenterCoord } = useMaskData();

    const [address, setAddress] = useState("");

    const fetchGeocode = async (address) => {
        let data;
        try {
            data = await axios.get(`http://49.50.163.193:3000/?address=${address}`);
            return data;
        } catch (error) {
            console.error(error);
            console.log("Failed to retrieve geocoding for: " + address);
        }
    };

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
                    lng: geoloc.longitude
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
            lng: geocodes.data.addresses[0].x
        };

        setCenterCoord(coord);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <div className="text-center mb-5">
                            <h1>
                                <FontAwesomeIcon icon={faStoreAlt} /> 마스크
                                판매처 조회
                            </h1>
                        </div>
                    </Col>
                </Row>
                <Row className="justify-content-center mb-3 text-center">
                    <Col sm={12} md={6} lg={5}>
                        <Form onSubmit={handleFormSubmit}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>
                                    판매처를 찾을 주소를 입력해 주세요.
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                                <Form.Text className="text-muted">
                                    예) 역삼동
                                </Form.Text>
                            </Form.Group>
                            <div className="d-flex flex-column">
                                <Button
                                    variant="primary"
                                    className="mb-2"
                                    onClick={onClickAddress}>
                                    <FontAwesomeIcon icon={faSearch} /> 주소로
                                    조회
                                </Button>
                                <Button
                                    variant="outline-primary"
                                    onClick={onClickGeoloc}>
                                    <FontAwesomeIcon icon={faLocationArrow} />{" "}
                                    GPS로 위치 기반 조회
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
