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
  const [modified, setModified] = useState<boolean>(false);
  const [parserObj, setParserObj] = useState<any>(preParsed);

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

  const updateCellData = (data: any) => {
    const checkForCellId = (arr: any[], id: string, callback: Function) => {
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

      return callback(arr);
    };

    const newHeaders = checkForCellId(
      headers,
      "headerId",
      (data: any[]) => data || headers
    );

    const newRows = checkForCellId(rows, "cellId", (data: any) => data || rows);

    updateModified(true);
    setParserObj(parserObj.editCell(data));
    setHeaders([...newHeaders]);
    setRows([...newRows]);
  };

  const updateModified = (isModified: boolean) => {
    setModified(isModified);
  };

  const sendModifiedTable = async (parsed: any) => {
    if (parserObj === undefined) return;
    parserObj.constructFullTable();

    const fetchOptions: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contentUrl: resource.contentUrl,
        targetId: parserObj.table.element.id,
        html: parserObj.table.element.outerHTML,
      }),
    };

    const reqUpdate = await fetch(
      "http://localhost:3000/api/send-modified-table",
      fetchOptions
    );

    const update = await reqUpdate.json();

    if (update.html) {
      const newParsed = parse(update.html);
      setParserObj(newParsed);
    }
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
            content: content.content,
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

  return {
    headers,
    rows,
    resource,
    updateCellData,
    metadata,
    modified,
    updateModified,
    sendModifiedTable,
  };
}
