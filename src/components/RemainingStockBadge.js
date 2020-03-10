import React from "react";
import { Badge } from "react-bootstrap";

function RemainingStockBadge({ remainingStockStr }) {
    let variant;
    let text;

    switch (remainingStockStr) {
        case "plenty":
            variant = "success";
            text = "여유";
            break;
        case "some":
            variant = "warning";
            text = "일부";
            break;
        case "few":
            variant = "danger";
            text = "부족";
            break;
        case "empty":
            variant = "light";
            text = "없음";
            break;
        default:
            variant = "light";
    }
    return <Badge variant={variant}>{text}</Badge>;
}

export default RemainingStockBadge;
