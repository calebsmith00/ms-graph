const defaultClick = () => {};
import TableCell from "./Cell";
import TableHeaders from "./Headers";
import TableRow from "./Row";
import TableRows from "./Rows";

interface TableContainerProps {
  headers: string[];
  rows: any[][];
  activeCell: any;
  cellClick?: Function;
  rowClick?: Function;
}

export default function TableContainer(props: TableContainerProps) {
  if (props.headers === undefined || props.rows === undefined) return null;
  if (props.headers.length === 0 || props.rows.length === 0) return null;
  const { cellClick = undefined, rowClick = undefined } = props;

  const getRowData = (row: any[]) =>
    row.map((data, index) => (
      <TableCell
        key={data.cellId}
        onClick={cellClick}
        data={data}
        activeCell={props.activeCell}
      />
    ));

  const getRows = (rows: any[][]) =>
    rows.map((row, index) => (
      <TableRow key={index} onClick={rowClick} metadata={row}>
        {getRowData(row)}
      </TableRow>
    ));

  return (
    <table className="w-3/4 mx-auto text-left my-5 text-gray-300 rounded-xl">
      <TableHeaders
        headers={props.headers}
        onClick={cellClick || rowClick || defaultClick}
        activeCell={props.activeCell}
      />
      <TableRows>{getRows(props.rows)}</TableRows>
    </table>
  );
}
