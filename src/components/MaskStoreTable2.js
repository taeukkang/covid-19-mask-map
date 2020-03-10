import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useMaskData } from "../context/MaskDataContext";
import { useTable, useBlockLayout } from "react-table";
import { Table } from "react-bootstrap";
import RemainingStockBadge from "./RemainingStockBadge";

function MaskStoreTable2() {
    const { t } = useTranslation();
    const { maskStores } = useMaskData();

    return (
        <>
            <Table responsive>
                <thead>
                    <tr>
                        <th>{t("storeData.name")}</th>
                        <th>{t("storeData.stockCount")}</th>
                        <th>{t("storeData.address")}</th>
                    </tr>
                </thead>
                <tbody>
                    {maskStores.map((store) => {
                        return (
                            <tr>
                                <td>{store.name}</td>
                                <td>{<RemainingStockBadge remainingStockStr={store.remain_stat} />}</td>
                                <td>{store.addr}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </>
    );
}

export default MaskStoreTable2;
