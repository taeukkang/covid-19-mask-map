import React from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
    faPlusSquare,
    faChartArea,
} from "@fortawesome/free-solid-svg-icons";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

function AppNav() {
    const { t, i18n } = useTranslation();

    return (
        <Navbar bg="light" className="mb-3 navbar-mobile-thin">
            <Navbar.Brand href="/">
                <FontAwesomeIcon
                    icon={faPlusSquare}
                    size="lg"
                    className="mr-2"
                />
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
                        <FontAwesomeIcon icon={faChartArea} size="lg" />
                    </Nav.Link>
                    <Nav.Link href="https://github.com/LiveCoronaDetector/">
                        <FontAwesomeIcon icon={faGithub} size="lg" />
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default AppNav;
