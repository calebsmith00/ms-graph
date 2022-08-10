import TableRow from "./Row";

export default function TableHeaders({
  headers,
  onClick,
}: {
  headers: any[];
  onClick: Function;
}) {
  if (headers.length === 0 || headers === undefined) return null;
  else
    return (
      <thead>
        <TableRow key={headers.length}>
          {headers.map((header: any) => (
            <th
              scope="col"
              className="py-3 px-6"
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
