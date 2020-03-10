import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useMaskData } from "../context/MaskDataContext";
import { useTable } from "react-table";
import { Table } from "react-bootstrap";
import RemainingStockBadge from "./RemainingStockBadge";

function MaskStoreTable() {
    const { t } = useTranslation();
    const { maskStores } = useMaskData();

    const columns = useMemo(() => [
        {
            Header: "Mask",
            columns: [
                {
                    Header: t("storeData.name"),
                    accessor: "name"
                },
                {
                    Header: t("storeData.stockCount"),
                    accessor: "remain_stat",
                    Cell: ({ cell: { value } }) => (
                        <RemainingStockBadge remainingStockStr={value} />
                    )
                },
                {
                    Header: t("storeData.address"),
                    accessor: "addr"
                }
            ]
        }
    ]);

    return (
        <>
            <TableUI columns={columns} data={maskStores} />
        </>
    );
}

function TableUI({ columns, data }) {
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({
        columns,
        data
    });

    // Render the UI for your table
    return (
        <Table {...getTableProps()}>
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps()}>
                                {column.render("Header")}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => {
                                return (
                                    <td {...cell.getCellProps()}>
                                        {cell.render("Cell")}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
}

export default MaskStoreTable;
