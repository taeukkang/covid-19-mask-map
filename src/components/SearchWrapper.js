import React, { useState } from "react";
import { useMaskData } from "../context/MaskDataContext";
import Search from "./Search";
import SearchResult from "./SearchResult";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function SearchWrapper() {
    const { centerCoord } = useMaskData();
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(true);

    const handleClose = () => setShowModal(false);

    return (
        <>
            {!centerCoord ? <Search /> : <SearchResult />}
            
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t("serviceShutdown")}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>
                        {t("notice.publicMaskShutdown")}
                    </p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" href="https://livecorona.co.kr">
                        {t("covid19Dashboard")}
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        {t("close")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default SearchWrapper;
