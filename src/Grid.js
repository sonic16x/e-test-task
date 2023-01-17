import {GridCell} from "./GridCell";
import {isSelected} from "./utils";

export const Grid = ({grid, selectedSet}) => (
    grid.map((gridRow, rowIndex) => (
        <tr key={rowIndex}>
            {gridRow.map((gridCell, colIndex) => (
                <GridCell
                    parent={gridCell.parent}
                    colSpan={gridCell.colSpan}
                    rowSpan={gridCell.rowSpan}
                    isSelected={isSelected(selectedSet, gridCell.key)}
                    key={gridCell.key}
                    rowIndex={rowIndex}
                    colIndex={colIndex}
                />
            ))}
        </tr>
    ))
);
