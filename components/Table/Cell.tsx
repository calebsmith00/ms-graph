export default function TableCell(props: any) {
  return (
    <td
      className="py-3 px-6"
      onClick={() => {
        if (props.data.cellId) props.onClick(props.data);
      }}
    >
      {props.children}
    </td>
  );
}
