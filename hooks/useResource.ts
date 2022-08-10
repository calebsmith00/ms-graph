import { useEffect, useState } from "react";
import parse from "../lib/html";

type ResourceHook = {
  resource: any;
  newHeaders?: string[];
  cookie?: any;
  preParsed?: any;
};

export default function useResource({
  resource,
  newHeaders,
  cookie,
  preParsed,
}: ResourceHook) {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [metadata, setMetadata] = useState<any[]>([]);

  const parseToHeaders = () => {};

  const parseToRows = () => {
    const rows: string[][] = [];

    for (const data in resource) {
      const row: string[] = [];
      const displayName =
        resource[data]["displayName"] || resource[data]["title"];
      if (displayName) row.push(displayName);
      rows.push(row);
    }

    return rows;
  };

  const updateCellData = async (data: any) => {
    const checkForCellId = async (
      arr: any[],
      id: string,
      callback: Function
    ) => {
      arr.forEach((cell: any, cellIndex: number) => {
        if (cell.length === undefined) {
          if (cell[id] === data[id]) {
            cell.content = data.content;
          }
        } else
          cell.forEach((cellKey: any) => {
            if (cellKey[id] === data[id]) {
              cellKey.content = data.content;
            }
          });
      });

      return Promise.resolve(callback(arr));
    };

    const newHeaders = await checkForCellId(
      headers,
      "headerId",
      (data: any[]) => data || headers
    );

    setHeaders(newHeaders);

    checkForCellId(rows, "cellId", (data: any) => {
      if (!data) return;
      return setRows(data);
    });

    // if (data.headerId) {
    //   const newHeaders: any[] = [...headers];

    //   newHeaders.forEach((cell: any, cellIndex: number) => {
    //     // cell.forEach((cellKey: any) => {
    //     //   if (cellKey.headerId === data.cellId) {
    //     //     cellKey.content = data.content;
    //     //   }
    //     // });
    //   });
    // } else {
    //   const newRows: any[] = [...rows];
    //   newRows.forEach((cell: any, cellIndex: number) => {
    //     cell.forEach((cellKey: any) => {
    //       if (cellKey.cellId === data.cellId) {
    //         cellKey.content = data.content;
    //       }
    //     });
    //   });

    //   setRows(newRows);
    // }
  };

  useEffect(() => {
    if (resource === undefined) return;

    if (preParsed) {
      setHeaders(preParsed.headers.contents);
      setRows([]);

      preParsed.rows.forEach((row: any) => {
        const newRow: any[] = [];
        setMetadata([...metadata, row]);
        row.contents.map((content: any) => {
          newRow.push({
            rowId: row.id,
            cellId: content.id,
            content: content.text,
          });
        });

        setRows((prevRows: any[]) => {
          return [...prevRows, newRow];
        });
      });

      return;
    }

    setHeaders(newHeaders || ["A"]);
    setRows(() => {
      const newRows = parseToRows();
      return newRows;
    });
  }, [resource]);

  return { headers, rows, resource, updateCellData, metadata };
}
