import React, { useState, useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import useGeolocation from "react-hook-geolocation";
import { useMaskData } from "../context/MaskDataContext";

function LoadOptions() {
    const geoloc = useGeolocation();
    const [geolocState, setGeolocState] = useState(null);
    const [geolocWhenAvailable, setGeolocWhenAvailable] = useState(false);
    const { centerCoord, setCenterCoord } = useMaskData();

/*     useEffect(() => {
        console.log(centerCoord);
    }, [centerCoord]); */

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
                setCenterCoord(coord)
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

    const onClickAddress = () => {
        alert("서비스 준비중입니다. 위치 옵션을 이용해 주세요.")
    };

    return (
        <>
            <div className="d-flex flex-column p-3">
                <div className="text-center">
                    <h1>공적 마스크 판매처 지도</h1>
                    <p>
                        본 지도는 위치 주변의 마스크 판매점 위치 및 재고 상황을
                        알려줍니다.
                    </p>
                </div>
                <div className="d-flex justify-content-center">
                    <Button onClick={onClickGeoloc} className="mr-3">
                        내 위치 주변 검색하기
                    </Button>
                    <Button disabled onClick={onClickAddress}>주소로 검색하기</Button>
                </div>
                {geolocState && geolocState === "denied" && (
                    {/* <Alert variant="danger">
                        <FontAwesomeIcon icon={faExclamationTriangle} />{" "}
                        {t("error.failedToAccessGeolocation")}
                    </Alert> */}
                )}
            </div>
        </>
    );
}

export default LoadOptions;
