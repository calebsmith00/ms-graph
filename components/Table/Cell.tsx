import { useEffect, useState } from "react";

export default function TableCell(props: any) {
  const [data, setData] = useState<any>(props.data);
  const [activeLink, setActiveLink] = useState<any>(props.activeCell);

  useEffect(() => {
    if (!props.data || props.data.content === undefined) return;

    setActiveLink(props.activeCell);
    setData(props.data);
  }, [props.data, props.activeCell]);

  const getActiveElement = () => {
    if (activeLink.cellId === data.cellId) {
      return activeLink.textColor;
    }

    return "text-gray-200";
  };

  return data ? (
    <td
      className={`py-3 px-6 ${getActiveElement()}`}
      onClick={() => {
        if (data.cellId) {
          props.onClick(data);
        }
      }}
    >
      {data.content}
    </td>
  ) : null;
}
