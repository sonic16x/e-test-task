import {useEffect, useState} from 'react';

import './styles.css';

import {
    getInitialGrid,
    getSelected,
    getMergedGrid,
    getSeparatedGrid,
    getCellFromTarget,
} from './utils';

import {Grid} from "./Grid";

export const App = () => {
    const [grid, setGrid] = useState(getInitialGrid());
    const [selection, setSelection] = useState(null); // null || {startCell: [rowIndex, colIndex], endCell[rowIndex, colIndex]}
    const [isMoving, setMoving] = useState(false);
    const [selectedSet, setSelectedSet] = useState(new Set());

    useEffect(() => {
        if (selection) {
            setSelectedSet(getSelected(grid, selection));
        }
    }, [selection, grid]);

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
                    <Grid
                        grid={grid}
                        selectedSet={selectedSet}
                    />
                </tbody>
            </table>
        </div>
    );
}
