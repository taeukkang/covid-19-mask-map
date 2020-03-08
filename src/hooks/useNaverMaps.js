import { useCallback } from "react";

const useNaverMaps = () => {
    return useCallback((ref, options) => {
        options = {
            center: {
                lat: 36.377165,
                lng: 127.533382
            },
            zoom: 1,
            zoomControl: true
        };

        if (window.naver && ref.current) {
            return new window.naver.maps.Map(ref.current, options);
        }

    }, []);
};

export default useNaverMaps;
