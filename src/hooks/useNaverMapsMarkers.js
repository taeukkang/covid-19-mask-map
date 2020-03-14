import React, { useCallback, useState } from "react";
import ReactDOMServer from "react-dom/server";
import RemainingStockBadge from "../components/RemainingStockBadge";
import { useMaskData } from "../context/MaskDataContext";

const useNaverMapsMarkers = () => {
    const [markers, setMarkers] = useState([]);
    const [plentyMarkers, setPlentyMarkers] = useState([]);
    const [someMarkers, setSomeMarkers] = useState([]);
    const [fewMarkers, setFewMarkers] = useState([]);
    const [emptyMarkers, setEmptyMarkers] = useState([]);
    const [breakMarkers, setBreakMarkers] = useState([]);

    const { markerFilter } = useMaskData();

    const addMarker = (map, data) => {
        if (!window.naver && !window.naver.maps) {
            return;
        }

        const marker = new window.naver.maps.Marker({
            map: map,
            position: {
                lat: data.lat,
                lng: data.lng
            }
        });

        const infoWindowHTML = `
            <div style="font-size: 0.1rem; padding: 15px;">
                <h5 style="font-size: 13px">${data.name}</h5>
                <p>${data.addr}<br />
                남은 수량: ${ReactDOMServer.renderToString(
                    <RemainingStockBadge remainingStockStr={data.remain_stat} />
                )}</p>
            </div>`;

        const infoWindow = new window.naver.maps.InfoWindow({
            content: infoWindowHTML
        });

        // mouseover event unsupported in touch devices (mobile)
        window.naver.maps.Event.addListener(marker, "mouseover", function(e) {
            infoWindow.open(map, marker);
        });

        window.naver.maps.Event.addListener(marker, "click", function(e) {
            infoWindow.open(map, marker);
        });

        setMarkers((oldArray) => [...oldArray, marker]);
    };

    const addColorIndicatorMarkers = useCallback(
        (map, stores) => {
            if (!window.naver && !window.naver.maps) {
                return;
            }

            let _plentyMarkers = [];
            let _someMarkers = [];
            let _fewMarkers = [];
            let _emptyMarkers = [];
            let _breakMarkers = [];

            stores.forEach((store) => {
                let iconPath;
                if (
                    store.remain_stat === undefined ||
                    store.remain_stat === null ||
                    store.remain_stat === "empty" ||
                    store.remain_stat === "break"
                ) {
                    return;
                }

                switch (store.remain_stat) {
                    case "plenty":
                        iconPath = "green_circle.svg";
                        break;
                    case "some":
                        iconPath = "yellow_circle.svg";
                        break;
                    case "few":
                        iconPath = "red_circle.svg";
                        break;
                    case "empty":
                        iconPath = "gray_circle.svg";
                        break;
                    case "break":
                        iconPath = "gray_circle.svg";
                        break;
                    default:
                        iconPath = "gray_circle.svg";
                }

                const marker = new window.naver.maps.Marker({
                    map: map,
                    position: {
                        lat: store.lat,
                        lng: store.lng
                    },
                    icon: {
                        url: `./${iconPath}`,
                        scaledSize: new window.naver.maps.Size(20, 20)
                    }
                });

                const infoWindowHTML = `
            <div style="font-size: 0.85rem; padding: 5px; width: 200px !important;">
                <h5 style="font-size: 1rem">${store.name}</h5>
                <p className="mb-0 pb-0">${store.addr}<br />
                남은 수량: ${ReactDOMServer.renderToString(
                    <RemainingStockBadge
                        remainingStockStr={store.remain_stat}
                    />
                )} | <a href="https://map.naver.com/v5/search/${
                    store.name
                }" target="_blank" rel="noopener noreferrer"
                >길찾기</a> </p>
            </div>`;

                const infoWindow = new window.naver.maps.InfoWindow({
                    content: infoWindowHTML
                });

                // mouseover event unsupported in touch devices (mobile)
                window.naver.maps.Event.addListener(
                    marker,
                    "mouseover",
                    function(e) {
                        infoWindow.open(map, marker);
                    }
                );

                window.naver.maps.Event.addListener(marker, "click", function(
                    e
                ) {
                    infoWindow.open(map, marker);
                });

                switch (store.remain_stat) {
                    case "plenty":
                        _plentyMarkers.push(marker);
                        break;
                    case "some":
                        _someMarkers.push(marker);
                        break;
                    case "few":
                        _fewMarkers.push(marker);
                        break;
                    case "empty":
                        _emptyMarkers.push(marker);
                        break;
                    case "break":
                        _breakMarkers.push(marker);
                        break;
                    default:
                        _emptyMarkers.push(marker);
                }
            });
            resetMarker();
            setPlentyMarkers(_plentyMarkers);
            setSomeMarkers(_someMarkers);
            setFewMarkers(_fewMarkers);
            setEmptyMarkers(_fewMarkers);
            setBreakMarkers(_fewMarkers);
        },
        [markerFilter]
    );

    const resetMarker = useCallback(() => {
        markers.forEach((marker) => {
            marker.setMap(null);
        });
        plentyMarkers.forEach((marker) => {
            marker.setMap(null);
        });
        fewMarkers.forEach((marker) => {
            marker.setMap(null);
        });
        someMarkers.forEach((marker) => {
            marker.setMap(null);
        });
        emptyMarkers.forEach((marker) => {
            marker.setMap(null);
        });
        breakMarkers.forEach((marker) => {
            marker.setMap(null);
        });
        setMarkers([]);
    }, [markers, plentyMarkers, fewMarkers, someMarkers, emptyMarkers, breakMarkers]);

    return {
        addMarker,
        addColorIndicatorMarkers,
        resetMarker
    };
};

export default useNaverMapsMarkers;
