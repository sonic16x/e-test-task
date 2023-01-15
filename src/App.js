import {useEffect, useState} from "react";

import './styles.css';

import {getGrid, getSelected, getMergedGrid, getSeparatedGrid, getCellFromTarget} from './utils';
import {GridCell} from "./GridCell";

export const App = () => {
    const searchParams = new URLSearchParams(document.location.search);
    const width = searchParams.get('width');
    const height = searchParams.get('height');

    const [grid, setGrid] = useState([]);
    const [selection, setSelection] = useState([]);
    const [isMoving, setMoving] = useState(false);
    const [selectedSet, setSelectedSet] = useState(new Set());

    useEffect(() => {
        setGrid(getGrid(width, height));
    }, [width, height]);

    useEffect(() => {
        if (selection.length === 2) {
            setSelectedSet(getSelected(grid, selection));
        }
    }, [selection, grid]);

    const isSelected = (cellKey) => {
        return selectedSet.has(cellKey);
    }

    const onMergeClick = () => {
        if (selection.length > 1) {
            const result = getMergedGrid(grid, selectedSet);
            setGrid(result.grid);
            setSelection(result.selection);
        }
    }

    const onSeparateClick = () => {
        if (selection.length > 1) {
            const result = getSeparatedGrid(grid, selectedSet);
            setGrid(result.grid);
            setSelection(result.selection);
        }
    }

    const onDown = (e) => {
        const {rowIndex, colIndex} = getCellFromTarget(e.target);
        setSelection([[rowIndex, colIndex]]);
        setMoving(true);
    }

    const onUp = (e) => {
        setMoving(false);
        const {rowIndex, colIndex} = getCellFromTarget(e.target);

        if (selection.length < 2 || rowIndex !== selection[1][0] || colIndex !== selection[1][1]) {
            setSelection((current) => [current[0], [rowIndex, colIndex]]);
        }
    }

    const onMove = (e) => {
        if (isMoving && selection.length) {
            const {rowIndex, colIndex} = getCellFromTarget(e.target);

            if (selection.length < 2 || rowIndex !== selection[1][0] || colIndex !== selection[1][1]) {
                setSelection((current) => [current[0], [rowIndex, colIndex]]);
            }
        }
    }

    return (
        <div>
            <div className='controls'>
                <button
                    data-merge-button
                    onClick={onMergeClick}
                    disabled={selection.length < 2}
                >
                    Merge
                </button>
                <button
                    data-separate-button
                    onClick={onSeparateClick}
                    disabled={selection.length < 2}
                >
                    Separate
                </button>
            </div>
            <table
                onMouseDown={onDown}
                onMouseUp={onUp}
                onMouseMove={onMove}
            >
                <tbody>
                {grid.map((gridRow, rowIndex) => (
                    <tr key={rowIndex}>
                        {gridRow.map((gridCell, colIndex) => (
                            <GridCell
                                parent={gridCell.parent}
                                colSpan={gridCell.colSpan}
                                rowSpan={gridCell.rowSpan}
                                isSelected={isSelected(gridCell.key)}
                                key={colIndex}
                                rowIndex={rowIndex}
                                colIndex={colIndex}
                            />
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
