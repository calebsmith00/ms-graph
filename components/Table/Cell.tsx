import { useEffect, useState } from "react";

export default function TableCell(props: any) {
  const [data, setData] = useState<any>(props.data);

  useEffect(() => {
    if (!props.data || props.data.content === undefined) return;

    setData(props.data);
  }, [props.data]);

  return data ? (
    <td
      className="py-3 px-6"
      onClick={() => {
        if (data.cellId) props.onClick(data);
      }}
    >
      {data.content}
    </td>
  ) : null;
}
