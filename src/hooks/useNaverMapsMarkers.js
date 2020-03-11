import React, { useCallback, useState } from "react";
import ReactDOMServer from "react-dom/server";
import RemainingStockBadge from "../components/RemainingStockBadge";

const useNaverMapsMarkers = () => {
    const [markers, setMarkers] = useState([]);

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
            <div style="font-size: 1rem; padding: 15px;">
                <h5>${data.name}</h5>
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

    const addColorIndicatorMarkers = (map, stores) => {
        if (!window.naver && !window.naver.maps) {
            return;
        }

        let _markers = [];

        stores.forEach((store) => {
            let iconPath;
            switch (store.remain_stat) {
                case "plenty":
                    iconPath = "green_circle.png";
                    break;
                case "some":
                    iconPath = "yellow_circle.png";
                    break;
                case "few":
                    iconPath = "red_circle.png";
                    break;
                case "empty":
                    iconPath = "gray_circle.png";
                    break;
                default:
                    iconPath = "gray_circle.png";
            }

            const marker = new window.naver.maps.Marker({
                map: map,
                position: {
                    lat: store.lat,
                    lng: store.lng
                },
                icon: {
                    url: `./${iconPath}`,
                    size: new window.naver.maps.Size(10, 10)
                }
            });

            const infoWindowHTML = `
                <div style="font-size: 1rem; padding: 15px;">
                    <h5>${store.name}</h5>
                    <p>${store.addr}<br />
                    남은 수량: ${ReactDOMServer.renderToString(
                        <RemainingStockBadge
                            remainingStockStr={store.remain_stat}
                        />
                    )}</p>
                </div>`;

            const infoWindow = new window.naver.maps.InfoWindow({
                content: infoWindowHTML
            });

            // mouseover event unsupported in touch devices (mobile)
            window.naver.maps.Event.addListener(marker, "mouseover", function(
                e
            ) {
                infoWindow.open(map, marker);
            });

            window.naver.maps.Event.addListener(marker, "click", function(e) {
                infoWindow.open(map, marker);
            });

            _markers.push(marker);
        });

        setMarkers(_markers);
    };

    const resetMarker = useCallback(() => {
        markers.forEach((marker) => {
            marker.setMap(null);
        });
        setMarkers([]);
    }, [markers]);

    return {
        addMarker,
        addColorIndicatorMarkers,
        resetMarker
    };
};

export default useNaverMapsMarkers;
