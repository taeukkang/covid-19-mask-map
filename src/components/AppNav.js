import React from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faChartArea } from "@fortawesome/free-solid-svg-icons";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import MaskMapLogo from "../assets/MaskMapLogo.svg";

function AppNav() {
    const { t, i18n } = useTranslation();

    return (
        <Navbar bg="light" expand="lg" className="mb-3 navbar-mobile-thin">
            <Navbar.Brand href="/">
                <img src={MaskMapLogo} width="24px" alt="공적 마스크 지도 로고" className="mr-2"/>
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
                        <FontAwesomeIcon icon={faChartArea} size="lg" /> {t("covid19Dashboard")}
                    </Nav.Link>
                    <Nav.Link href="https://github.com/LiveCoronaDetector/">
                        <FontAwesomeIcon icon={faGithub} size="lg" /> {t("github")}
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default AppNav;
