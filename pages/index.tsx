import type { NextPage, NextPageContext } from "next";
import { useEffect, useRef, useState } from "react";
import { ModifyData } from "../components/ModifyData";
import SelectNotebook from "../components/SelectNotebook";
import SendModification from "../components/SendModification";
import TableContainer from "../components/Table/Container";
import useOutsideClick from "../hooks/useOutsideClick";
import useResource from "../hooks/useResource";
import parse from "../lib/html";
import { Templates } from "../lib/templates/templates";

const Home: NextPage = (props: any) => {
  const ref = useRef<any>();
  const resource = useResource({
    resource: props.templates.page.selected,
    newHeaders: ["Display Name"],
    cookie: undefined,
    preParsed: parse(props.templates.content.raw),
  });

  const [modify, setModify] = useState<string>("");
  const [activeCell, setActiveCell] = useState<any>({});
  const [templates, setTemplates] = useState<any>(props.templates);

  const handleClick = (metadata: any) => {
    setActiveCell({
      cellId: metadata.cellId || metadata.headerId,
      textColor: "text-red-500",
    });
    setModify(metadata);
  };

  const onClickOutside = (event: Event): EventListenerOrEventListenerObject => {
    if (ref.current && !ref.current.contains(event.target)) {
      setActiveCell({
        cellId: null,
        textColor: "text-gray-200",
      });
      setModify("");
    }

    return ref.current;
  };

  const updateResource = async (text: string, resource: string) => {
    const collection = templates[resource].collection || [];
    const foundCollection = collection.find((collection: any) => {
      if (
        collection.title === text ||
        collection.displayName === text ||
        collection.id === text
      ) {
        return true;
      }
    });

    templates[resource].selected = foundCollection;

    switch (resource) {
      case "notebook":
    }
  };

  const requestNewResource = (resource: string) => {
    return props.templates[resource].collection;
  };

  return (
    <div className="container mx-auto w-1/2 text-xl text-gray-200">
      <SelectNotebook
        resource={props.templates.notebook.collection}
        updateResource={updateResource}
        requestNewResource={requestNewResource}
      />

      <TableContainer
        ref={ref}
        clickEventCallback={onClickOutside}
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
