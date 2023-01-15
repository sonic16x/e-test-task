export function getGrid(width, height) {
    const grid = [];

    for (let row = 0; row < height; row++) {
        grid.push([]);
        for (let col = 0; col < width; col++) {
            grid[row].push({
                parent: null,
                colSpan: 1,
                rowSpan: 1,
                key: getCellKey(row, col),
            });
        }
    }

    return grid;
}

export function getSelected(grid, selection, selected = new Set(), processedRoots = new Set()) {
    const [startCell, endCell] = selection;

    const rowStart = startCell[0] < endCell[0] ? startCell[0] : endCell[0];
    const rowEnd = startCell[0] < endCell[0] ? endCell[0] : startCell[0];

    const colStart = startCell[1] < endCell[1] ? startCell[1] : endCell[1];
    const colEnd = startCell[1] < endCell[1] ? endCell[1] : startCell[1];

    for (let row = rowStart; row <= rowEnd; row++) {
        for (let col = colStart; col <= colEnd; col++) {
            const cell = grid[row][col];

            if (!selected.has(cell.key)) {
                selected.add(cell.key);
            }

            if (cell.root && !processedRoots.has(cell.key)) {
                processedRoots.add(cell.key);
                getSelected(
                    grid,
                    [
                        [rowStart, colStart],
                        [Math.max(...[row + cell.rowSpan - 1, rowEnd]), Math.max(...[col + cell.colSpan - 1, colEnd])],
                    ],
                    selected,
                    processedRoots,
                );
            }
            if (cell.parent) {
                const parentRow = cell.parent[0];
                const parentCol = cell.parent[1];
                const parentCell = grid[parentRow][parentCol];

                if (!processedRoots.has(parentCell.key)) {
                    processedRoots.add(parentCell.key);
                    getSelected(
                        grid,
                        [
                            [Math.min(...[rowStart, parentRow]), Math.min(...[colStart, parentCol])],
                            [Math.max(...[parentRow + parentCell.rowSpan - 1, rowEnd]), Math.max(...[parentCol + parentCell.colSpan - 1, colEnd])],
                        ],
                        selected,
                        processedRoots,
                    );
                }
            }
        }
    }

    return selected;
}

export function getCellKey(rowIndex, colIndex) {
    return `${rowIndex}-${colIndex}`;
}

export function getMergedGrid(grid, selectedSet) {
    let minRow = grid.length - 1;
    let minCol = grid[0].length - 1;

    let maxRow = 0;
    let maxCol = 0;

    grid.forEach((gridRow, rowIndex) => gridRow.forEach((gridCell, colIndex) => {
        if (selectedSet.has(getCellKey(rowIndex, colIndex))) {
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

    const mergedGrid = grid.map((gridRow, rowIndex) => gridRow.map((gridCell, colIndex) => {
        if (selectedSet.has(getCellKey(rowIndex, colIndex))) {
            const current = rowIndex === minRow && colIndex === minCol;

            return {
                root: current,
                parent: current ? null : [minRow, minCol],
                colSpan: current ? (maxCol - minCol + 1) : 1,
                rowSpan: current ? (maxRow - minRow + 1) : 1,
                key: getCellKey(rowIndex, colIndex),
            }
        }

        return gridCell;
    }));

    return {
        grid: mergedGrid,
        selection: [
            [
                minRow,
                minCol,
            ],
            [
                maxRow,
                maxCol,
            ],
        ],
    };
}

export function getSeparatedGrid(grid, selectedSet) {
    let minRow = grid.length - 1;
    let minCol = grid[0].length - 1;

    let maxRow = 0;
    let maxCol = 0;

    const separatedGrid = grid.map((gridRow, rowIndex) => gridRow.map((gridCell, colIndex) => {
        if (selectedSet.has(getCellKey(rowIndex, colIndex))) {
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
        selection: [
            [
                minRow,
                minCol,
            ],
            [
                maxRow,
                maxCol,
            ],
        ],
    };
}

export function getCellFromTarget(target) {
    const rowIndex = parseInt(target.getAttribute('data-row-index'));
    const colIndex = parseInt(target.getAttribute('data-col-index'));

    return {
        rowIndex,
        colIndex,
    };
}
