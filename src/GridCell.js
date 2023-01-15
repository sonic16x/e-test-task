import {memo} from "react";

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
