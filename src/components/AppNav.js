import React from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faChartArea } from "@fortawesome/free-solid-svg-icons";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import MaskMapLogo from "../assets/MaskMapLogo.svg";
import styled from "styled-components";

const NavbarBrand = styled(Navbar.Brand)`
    font-family: "NanumSquareRound", sans-serif;
    font-size: 1.25rem;
    font-weight: 800;
    line-height: 1;
    color: #04253a;
    align-self: center;
`;

function AppNav() {
    const { t, i18n } = useTranslation();

    return (
        <Navbar bg="light" expand="lg" className="mb-3 navbar-mobile-thin">
            <NavbarBrand href="/" className="title">
                <img
                    src={MaskMapLogo}
                    width="24px"
                    alt="공적 마스크 지도 로고"
                    className="mr-2"
                />
                {t("appName")}
            </NavbarBrand>
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
                        <NavDropdown.Item
                            onClick={() => i18n.changeLanguage("zh")}>
                            中文
                        </NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href="https://livecorona.co.kr">
                        <FontAwesomeIcon icon={faChartArea} size="lg" />{" "}
                        {t("covid19Dashboard")}
                    </Nav.Link>
                    <Nav.Link href="https://github.com/LiveCoronaDetector/">
                        <FontAwesomeIcon icon={faGithub} size="lg" />{" "}
                        {t("github")}
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default AppNav;
