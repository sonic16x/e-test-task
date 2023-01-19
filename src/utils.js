// get string key for cell by row and col indexes
export function getCellKey(rowIndex, colIndex) {
    return `${rowIndex}-${colIndex}`;
}

// check cell is selected by key
export function isSelected(selectedSet, cellKey) {
    return selectedSet.has(cellKey);
}

// get initial grid by size from query
export function getInitialGrid() {
    const searchParams = new URLSearchParams(document.location.search);
    const width = Number(searchParams.get('width'));
    const height = Number(searchParams.get('height'));

    const grid = [];

    for (let row = 0; row < height; row++) {
        grid.push([]);
        for (let col = 0; col < width; col++) {
            grid[row].push({
                root: false, // mean that this cell root for another cells (main cell after merge)
                parent: null, // mean that this cell has parent (after merge)
                colSpan: 1,
                rowSpan: 1,
                key: getCellKey(row, col), // string key of cell for using as key for component and index for Set
                row,
                col,
            });
        }
    }

    return grid;
}

// get selected cells Set
export function getSelected(grid, selection, selected = new Set(), processedRoots = new Set()) {
    const {startCell, endCell} = selection;

    // calculate real start and end cells
    const rowStart = Math.min(startCell.row, endCell.row);
    const rowEnd = Math.max(startCell.row, endCell.row);

    const colStart = Math.min(startCell.col, endCell.col);
    const colEnd = Math.max(endCell.col, startCell.col);

    for (let row = rowStart; row <= rowEnd; row++) {
        for (let col = colStart; col <= colEnd; col++) {
            const cell = grid[row][col];

            // add this cell to selected Set
            if (!selected.has(cell.key)) {
                selected.add(cell.key);
            }

            // if this cell root or has parent process new area recursively from start to end area
            if (cell.root || cell.parent) {
                // get data for parent cell
                const parentRow = cell.root ? row : cell.parent.row;
                const parentCol = cell.root ? col : cell.parent.col;
                const parentCell = cell.root ? cell : grid[parentRow][parentCol];
                const parentKey = parentCell.key;

                // check if this parent processed
                if (!processedRoots.has(parentKey)) {
                    processedRoots.add(parentKey); // set that this parent already processed

                    // calculate start and end cells for new area
                    const startCell = {
                        row: Math.min(rowStart, parentRow),
                        col: Math.min(colStart, parentCol)
                    };
                    const endCell = {
                        row: Math.max(parentRow + parentCell.rowSpan - 1, rowEnd),
                        col: Math.max(parentCol + parentCell.colSpan - 1, colEnd),
                    };

                    // get new selected cells for this area recursively
                    getSelected(
                        grid,
                        {startCell, endCell},
                        selected,
                        processedRoots,
                    );
                }
            }
        }
    }

    return selected;
}

// get merged cells using selection and get new selection after merge
export function getMergedGrid(grid, selectedSet) {
    let minRow = grid.length - 1;
    let minCol = grid[0].length - 1;

    let maxRow = 0;
    let maxCol = 0;

    // calculate start and end cells from selected cells
    grid.forEach((gridRow, rowIndex) => gridRow.forEach((gridCell, colIndex) => {
        if (isSelected(selectedSet, getCellKey(rowIndex, colIndex))) {
            if (rowIndex < minRow) {
                minRow = rowIndex;
            }
            if (colIndex < minCol) {
                minCol = colIndex;
            }
            if (rowIndex > maxRow) {
                maxRow = rowIndex;
            }
            if (colIndex > maxCol) {
                maxCol = colIndex;
            }
        }
    }));

    // change grid and set for all selected cells root as start cell
    const mergedGrid = grid.map((gridRow, rowIndex) => gridRow.map((gridCell, colIndex) => {
        if (isSelected(selectedSet, getCellKey(rowIndex, colIndex))) {
            const current = rowIndex === minRow && colIndex === minCol;

            return {
                root: current,
                parent: current ? null : {row: minRow, col: minCol},
                colSpan: current ? (maxCol - minCol + 1) : 1,
                rowSpan: current ? (maxRow - minRow + 1) : 1,
                key: getCellKey(rowIndex, colIndex),
            }
        }

        return gridCell;
    }));

    return {
        grid: mergedGrid,
        selection: {
            startCell: {
                row: minRow,
                col: minCol,
            },
            endCell: {
                row: maxRow,
                col: maxCol,
            },
        },
    };
}

// get separated grid using selection and get new selection after separate
export function getSeparatedGrid(grid, selectedSet) {
    let minRow = grid.length - 1;
    let minCol = grid[0].length - 1;

    let maxRow = 0;
    let maxCol = 0;

    // for all selected cells calculate start and end cells for new selection and remove parent cell and spans (set as 1)
    const separatedGrid = grid.map((gridRow, rowIndex) => gridRow.map((gridCell, colIndex) => {
        if (isSelected(selectedSet, getCellKey(rowIndex, colIndex))) {
            if (rowIndex < minRow) {
                minRow = rowIndex;
            }
            if (colIndex < minCol) {
                minCol = colIndex;
            }
            if (rowIndex > maxRow) {
                maxRow = rowIndex;
            }
            if (colIndex > maxCol) {
                maxCol = colIndex;
            }

            return {
                parent: null,
                colSpan: 1,
                rowSpan: 1,
                key: getCellKey(rowIndex, colIndex),
            }
        }

        return gridCell;
    }));

    return {
        grid: separatedGrid,
        selection: {
            startCell: {
                row: minRow,
                col: minCol,
            },
            endCell: {
                row: maxRow,
                col: maxCol,
            },
        },
    };
}

// helper for get data of cell from event target
export function getCellFromTarget(target) {
    const rowIndex = Number(target.dataset.rowIndex);
    const colIndex = Number(target.dataset.colIndex);

    return {
        rowIndex,
        colIndex,
    };
}
