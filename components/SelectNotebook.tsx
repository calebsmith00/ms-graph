import { ChangeEvent, MouseEvent, useEffect, useState } from "react";

interface SelectNotebookProps {
  resource: any[];
  updateResource: Function;
  requestNewResource: Function;
}

export default function SelectNotebook({
  resource,
  updateResource,
  requestNewResource,
}: SelectNotebookProps) {
  const [collection, setCollection] = useState<any[]>(resource);
  const [option, setOption] = useState<string>(
    resource[0].title || resource[0].displayName
  );
  const [resourceType, setResourceType] = useState<string>("notebook");

  useEffect(() => {
    if (resource.length !== 0) return setCollection(resource);
  }, [resource]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const name = event.target.name;
    const value = event.target.value;

    setOption(value);
    updateResource(value, name);
  };

  const updateResourceType = (event: any) => {
    if (event.target.value) {
      setCollection(requestNewResource(event.target.value));
      setResourceType(event.target.value);
    }
  };

  const resourceButtonClass = "bg-gray-800 px-4 py-2 rounded-xl";
  return (
    <div className="flex flex-col items-center">
      <div className="py-5 font-semibold text-2xl">
        If you want new information, please select your resource type
      </div>

      <div className="flex justify-around w-1/2 py-5">
        <button
          className={resourceButtonClass}
          value="notebook"
          onClick={updateResourceType}
        >
          Notebook
        </button>
        <button
          className={resourceButtonClass}
          value="section"
          onClick={updateResourceType}
        >
          Section
        </button>
        <button
          className={resourceButtonClass}
          value="page"
          onClick={updateResourceType}
        >
          Page
        </button>
      </div>

      <select
        className="bg-gray-900 w-3/4"
        onChange={(e: any) => handleChange(e)}
        name={resourceType}
        value={option}
      >
        {collection.map((data) => {
          return (
            <option key={data.id} value={data.id}>
              {data.title || data.displayName}
            </option>
          );
        })}
      </select>
    </div>
  );
}
