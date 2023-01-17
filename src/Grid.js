import {memo} from "react";

import {isSelected} from "./utils";

export const GridCell = memo(({parent, colSpan, rowSpan, rowIndex, colIndex, isSelected}) => {
    if (parent) {
        return;
    }

    return (
        <td
            data-selected={isSelected}
            data-row-index={rowIndex}
            data-col-index={colIndex}
            colSpan={colSpan}
            rowSpan={rowSpan}
        >
            row: {rowIndex} col: {colIndex}
        </td>
    );
});

const GridRow = memo(
    ({gridRow, selectedSet, rowIndex}) => (
        gridRow.map((gridCell, colIndex) => (
            <GridCell
                parent={gridCell.parent}
                colSpan={gridCell.colSpan}
                rowSpan={gridCell.rowSpan}
                isSelected={isSelected(selectedSet, gridCell.key)}
                key={gridCell.key}
                rowIndex={rowIndex}
                colIndex={colIndex}
            />
        ))
    )
);

export const Grid = memo(
    ({grid, selectedSet}) => (
        grid.map((gridRow, rowIndex) => (
            <tr key={rowIndex}>
                <GridRow
                    gridRow={gridRow}
                    selectedSet={selectedSet}
                    rowIndex={rowIndex}
                />
            </tr>
        ))
    )
);
