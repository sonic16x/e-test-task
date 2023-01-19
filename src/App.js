import {useMemo, useRef, useState} from 'react';

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
    const tableRef = useRef(null);
    const [grid, setGrid] = useState(getInitialGrid());
    const [selection, setSelection] = useState(null);

    const selectedSet = useMemo(() => {
        if (selection) {
            return getSelected(grid, selection);
        }

        return new Set();
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

    const onMove = (e) => {
        const {rowIndex, colIndex} = getCellFromTarget(e.target);

        if (selection && (rowIndex !== selection.endCell.row || colIndex !== selection.endCell.col)) {
            setSelection(({startCell}) => ({
                startCell,
                endCell: {
                    row: rowIndex,
                    col: colIndex,
                },
            }));
        }
    }

    const onUp = () => {
        tableRef.current.removeEventListener('mousemove', onMove);
        tableRef.current.removeEventListener('mousemove', onMove);
    }

    const onDown = (e) => {
        const {rowIndex, colIndex} = getCellFromTarget(e.target);
        setSelection({
            startCell: {
                row: rowIndex,
                col: colIndex,
            },
            endCell: {
                row: rowIndex,
                col: colIndex,
            },
        });

        tableRef.current.addEventListener('mousemove', onMove);
        tableRef.current.addEventListener('mouseup', onUp);
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
                ref={tableRef}
                onMouseDown={onDown}
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
