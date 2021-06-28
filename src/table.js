import React from "react";
import './table.css';
import numeral from "numeral"

function Table({tableData}) {
    return (
        <div className="table">
            {
                tableData.map(({country,cases}) =>(
                    <tr>
                        <td>{country}</td>
                        <td><strong>{numeral(cases).format("0,0")}</strong></td>
                    </tr>
                ))
            }
        </div>
    );
}

export default Table;