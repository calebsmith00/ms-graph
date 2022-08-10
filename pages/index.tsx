import type { NextPage, NextPageContext } from "next";
import { useState } from "react";
import { ModifyData } from "../components/ModifyData";
import TableContainer from "../components/Table/Container";
import useResource from "../hooks/useResource";
import parse from "../lib/html";
import { Templates } from "../lib/templates/templates";

const Home: NextPage = (props: any) => {
  const resource = useResource({
    resource: props.templates.page.selected,
    newHeaders: ["Display Name"],
    cookie: undefined,
    preParsed: parse(props.templates.content.raw),
  });
  const [modify, setModify] = useState<string>("");

  const handleClick = (metadata: any) => {
    console.log(metadata);
    setModify(metadata);
  };

  return (
    <div className="container mx-auto w-1/2 text-xl text-gray-200">
      <TableContainer
        headers={resource.headers}
        rows={resource.rows}
        cellClick={handleClick}
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
