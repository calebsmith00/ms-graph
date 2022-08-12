import type { NextPage, NextPageContext } from "next";
import { useEffect, useRef, useState } from "react";
import { ModifyData } from "../components/ModifyData";
import SendModification from "../components/SendModification";
import TableContainer from "../components/Table/Container";
import useResource from "../hooks/useResource";
import parse from "../lib/html";
import { Templates } from "../lib/templates/templates";

const Home: NextPage = (props: any) => {
  const ref = useRef<any>(null);
  const resource = useResource({
    resource: props.templates.page.selected,
    newHeaders: ["Display Name"],
    cookie: undefined,
    preParsed: parse(props.templates.content.raw),
  });
  const [modify, setModify] = useState<string>("");
  const [activeCell, setActiveCell] = useState<any>({});

  useEffect(() => {
    document.addEventListener("click", onClickOutside, true);

    return () => {
      document.removeEventListener("click", onClickOutside, true);
    };
  }, []);

  const handleClick = (metadata: any) => {
    setActiveCell({
      cellId: metadata.cellId || metadata.headerId,
      textColor: "text-red-500",
    });
    setModify(metadata);
  };

  const onClickOutside = (event: any) => {
    if (!ref.current) return;
    if (!ref.current.contains(event.target)) {
      setActiveCell({
        cellId: null,
        textColor: "text-gray-200",
      });
      setModify("");
    }
  };

  return (
    <div className="container mx-auto w-1/2 text-xl text-gray-200" ref={ref}>
      <TableContainer
        headers={resource.headers}
        rows={resource.rows}
        cellClick={handleClick}
        activeCell={activeCell}
      />

      <SendModification
        isModified={resource.modified}
        updateModified={resource.updateModified}
        sendModifiedTable={resource.sendModifiedTable}
        onClickOutside={onClickOutside}
      />
      <ModifyData cellData={modify} updateCellData={resource.updateCellData} />
    </div>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const templates = await Templates.init()
    .setUserId("0ec189a6-d8ce-4bbb-ae3c-fdffde71d6a7")
    .getTemplates();

  const props = {
    templates,
  };

  props.templates.content["parsed"] = null;
  return { props };
}

export default Home;
