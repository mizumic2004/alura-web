import React, { useState } from 'react';
import './Table.css';

const Table = ({ columns, data }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 7;

    const totalPages = Math.ceil(data.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentRows = data.slice(startIndex, startIndex + rowsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <div>
            <div className="custom_table_container">
                <table className="custom_table">
                    <thead>
                        <tr>
                            {columns.map((col, index) => (
                                <th key={index}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((row, index) => (
                            <tr key={index}>
                                {columns.map((col, i) => (
                                    <td key={i}>
                                        {row[col.toLowerCase().replace(/ /g, "_")]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="table_pagination">
                <button onClick={handlePrev} disabled={currentPage === 1}>
                    &laquo; Prev
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button onClick={handleNext} disabled={currentPage === totalPages}>
                    Next &raquo;
                </button>
            </div>
        </div>
    );
};

export default Table;
