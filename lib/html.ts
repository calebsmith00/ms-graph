class Parser {
  doc: Document;
  table: any;
  headers: any;
  rows: any;

  private constructor(config: any) {
    this.doc = config.doc;
    this.table = undefined;
    this.rows = [];
  }

  private getElement(
    tagName: keyof Parser
  ): HTMLElement | HTMLCollectionOf<Element> | undefined {
    const elementObj = this[tagName];
    if (elementObj) {
      const shouldGetId = elementObj.id !== undefined || elementObj.id !== "";
      if (shouldGetId) {
        const getElement =
          this.doc.getElementById(elementObj.id) ||
          this.doc.querySelector(`[data-id='${elementObj.id}']`) ||
          undefined;

        return getElement;
      } else {
        const getElements = this.doc.getElementsByTagName(tagName) || undefined;
        return getElements;
      }
    }

    return undefined;
  }

  setTableId(id: string): Parser {
    this.table = {
      id,
    };

    return this;
  }

  setHeaderId(id: string): Parser {
    this.headers = {
      id,
    };

    return this;
  }

  getTable(): Parser {
    const table = this.getElement("table");
    if (table === undefined) return this;

    const isCollection = table instanceof HTMLCollection;
    const isElement = table instanceof HTMLElement;

    if (isElement) {
      this.table = {
        ...this.table,
        element: table,
      };
    }

    return this;
  }

  getHeaders(): Parser {
    if (!this.headers.id) return this;

    const headerRow = this.getElement("headers");
    if (headerRow === undefined) return this;

    if (headerRow instanceof HTMLElement) {
      this.headers = {
        ...this.headers,
        element: headerRow,
      };
    }

    this.getHeaderContents();
    return this;
  }

  getHeaderContents(): void | undefined {
    if (!this.headers.element) return undefined;

    const headerData = this.headers.element.querySelectorAll("td");
    const headerVals: any[] = [];
    headerData.forEach((headerEl: any, index: number) => {
      const getDataId = headerEl.getAttribute("data-id");
      if (getDataId === undefined || getDataId === null) {
        headerEl.setAttribute("data-id", `header-${index}`);
      }

      headerVals.push({
        headerId: headerEl.getAttribute("data-id"),
        content: headerEl.innerText.trim(),
      });
    });

    this.headers = {
      ...this.headers,
      contents: headerVals,
    };
  }

  getRows(): Parser {
    const rowElements = this.doc.querySelectorAll(`[data-id^="row"]`);
    if (rowElements.length === 0) return this;

    rowElements.forEach((row: any, index) => {
      if (row !== undefined) {
        const id = row.getAttribute("data-id");
        const rowContents = this.getRowContents(row);

        this.rows = [
          ...this.rows,
          {
            id: id || `row-${index}`,
            element: row,
            contents: rowContents,
          },
        ];
      }
    });

    return this;
  }

  getRowContents(row: any): string[] {
    const rowData = row.querySelectorAll("td");
    const rowVals: any[] = [];
    const rowId = row.getAttribute("data-id").substring("row-".length);

    rowData.forEach((currRow: any, index: number) => {
      let dataId = "";
      if (currRow.getAttribute("data-id"))
        dataId = currRow.getAttribute("data-id");
      else dataId = `${rowId}-cell-${index}`;
      if (currRow)
        rowVals.push({
          id: dataId,
          content: currRow.innerText.trim(),
        });
    });

    return rowVals;
  }

  addRow(content: string[]): Parser {
    let missingCells = 0;
    if (this.headers === undefined || this.headers.contents === undefined)
      return this;

    if (content.length !== this.headers.contents.length)
      missingCells = this.headers.contents.length - content.length;

    const populateMissingCells = [];
    for (let i = 0; i < missingCells; ++i) {
      populateMissingCells.push(`Undefined cell (index ${i})`);
    }

    const rowEl = document.createElement("tr");
    rowEl.setAttribute("data-id", `row-${this.rows.length}`);

    if (populateMissingCells.length !== 0)
      content.unshift(...populateMissingCells);

    content.forEach((text: any, index: number) => {
      const rowData = document.createElement("td");
      rowData.setAttribute("data-id", `${this.rows.length}-cell-${index}`);
      rowData.innerText = text;
      rowEl.appendChild(rowData);
    });

    const tBody = this.table.element.querySelector("tbody");
    if (tBody) this.table.element.querySelector("tbody").appendChild(rowEl);
    else this.table.element.appendChild(rowEl);

    this.rows = [];
    this.getRows();
    return this;
  }

  editCell(data: any): Parser {
    this.headers.contents.find((content: any) => {
      if (content.headerId === data.headerId) {
        content.content = data.content;
        return true;
      }
    });

    this.rows.forEach((row: any) => {
      row.contents.find((rowMetadata: any) => {
        if (rowMetadata.id === data.cellId) {
          rowMetadata.content = data.content;
          return true;
        }
      });
    });

    return this;
  }

  constructFullTable(): Parser {
    const table = document.createElement("table");
    const headers = document.createElement("tr");
    const rows: any[] = [];

    this.headers.contents.forEach((content: any) => {
      const newHeader = document.createElement("td");
      newHeader.setAttribute("data-id", content.headerId);
      newHeader.innerText = content.content;
      headers.appendChild(newHeader);
    });

    this.rows.map((row: any) => {
      const newRow = document.createElement("tr");
      newRow.setAttribute("data-id", row.id);

      row.contents.forEach((rowContent: any, index: number) => {
        const newRowTd = document.createElement("td");
        newRowTd.setAttribute("data-id", rowContent.id);
        newRowTd.innerText = rowContent.content;
        newRow.appendChild(newRowTd);
      });

      rows.push(newRow);
    });

    table.setAttribute("data-id", this.table.id);
    table.id = this.table.element.id;
    headers.setAttribute("data-id", this.headers.id);

    table.appendChild(headers);
    rows.forEach((row) => table.appendChild(row));

    this.table = {
      ...this.table,
      element: table,
    };
    return this;
  }

  static init(doc: Document): Parser {
    return new Parser({ doc });
  }
}

export default function parse(html: string): Parser | undefined {
  if (typeof window === "undefined") return;
  const htmlParser = new DOMParser();
  const htmlDoc: Document = htmlParser.parseFromString(html, "text/html");

  const data: Parser = Parser.init(htmlDoc)
    .setTableId("trainingTable")
    .getTable()
    .setHeaderId("headers")
    .getHeaders()
    .getRows();

  return data;
}
