import TableRow from "./Row";

export default function TableHeaders({
  headers,
  onClick,
  activeCell,
}: {
  headers: any[];
  activeCell: any;
  onClick: Function;
}) {
  const getActiveTextColor = (id: string) => {
    if (activeCell.cellId === id) return activeCell.textColor;
    return "text-gray-200";
  };

  if (headers.length === 0 || headers === undefined) return null;
  else
    return (
      <thead>
        <TableRow key={headers.length}>
          {headers.map((header: any) => (
            <th
              scope="col"
              className={`py-3 px-6 ${getActiveTextColor(header.headerId)}`}
              key={header.headerId}
              onClick={() => onClick(header)}
            >
              {header.content}
            </th>
          ))}
        </TableRow>
      </thead>
    );
}
