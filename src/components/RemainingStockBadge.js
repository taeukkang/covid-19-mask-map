import React from "react";
import { Badge } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function RemainingStockBadge({ remainingStockStr }) {
    const { t } = useTranslation();
    let variant;
    let text;

    switch (remainingStockStr) {
        case "plenty":
            variant = "success";
            text = t("badge.plenty");
            break;
        case "some":
            variant = "warning";
            text = t("badge.some");
            break;
        case "few":
            variant = "danger";
            text = t("badge.few");
            break;
        case "empty":
            variant = "light";
            text = t("badge.empty");
            break;
        case "break":
            variant = "secondary";
            text = t("badge.break");
            break;
        default:
            variant = "light";
            text = "?";
    }
    return <Badge variant={variant}>{text}</Badge>;
}

export default RemainingStockBadge;
