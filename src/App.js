import {useEffect, useState} from 'react';

import './styles.css';

import {getGrid, getSelected, getMergedGrid, getSeparatedGrid, getCellFromTarget} from './utils';
import {GridCell} from './GridCell';

export const App = () => {
    const searchParams = new URLSearchParams(document.location.search);
    const width = searchParams.get('width');
    const height = searchParams.get('height');

    const [grid, setGrid] = useState([]);
    const [selection, setSelection] = useState(null); // null || {startCell: [rowIndex, colIndex], endCell[rowIndex, colIndex]}
    const [isMoving, setMoving] = useState(false);
    const [selectedSet, setSelectedSet] = useState(new Set());

    useEffect(() => {
        setGrid(getGrid(width, height));
    }, [width, height]);

    useEffect(() => {
        if (selection) {
            setSelectedSet(getSelected(grid, selection));
        }
    }, [selection, grid]);

    const isSelected = (cellKey) => {
        return selectedSet.has(cellKey);
    }

    const onMergeClick = () => {
        if (selection) {
            const result = getMergedGrid(grid, selectedSet);
            setGrid(result.grid);
            setSelection(result.selection);
        }
    }

    const onSeparateClick = () => {
        if (selection) {
            const result = getSeparatedGrid(grid, selectedSet);
            setGrid(result.grid);
            setSelection(result.selection);
        }
    }

    const onDown = (e) => {
        const {rowIndex, colIndex} = getCellFromTarget(e.target);
        setSelection({
            startCell: [rowIndex, colIndex],
            endCell: [rowIndex, colIndex],
        });
        setMoving(true);
    }

    const onUp = () => {
        setMoving(false);
    }

    const onMove = (e) => {
        if (isMoving) {
            const {rowIndex, colIndex} = getCellFromTarget(e.target);

            if (rowIndex !== selection.endCell[0] || colIndex !== selection.endCell[1]) {
                setSelection(({startCell}) => ({
                    startCell,
                    endCell: [rowIndex, colIndex],
                }));
            }
        }
    }

    return (
        <div>
            <div className='controls'>
                <button
                    data-merge-button
                    onClick={onMergeClick}
                    disabled={!selection}
                >
                    Merge
                </button>
                <button
                    data-separate-button
                    onClick={onSeparateClick}
                    disabled={!selection}
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
                                    key={gridCell.key}
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
