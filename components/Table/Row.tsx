export default function TableRow(props: any) {
  const handleClick = () => {
    if (props.onClick === undefined) return;
    else props.onClick(props.metadata);
  };

  return (
    <tr className="bg-gray-900 border-b" onClick={handleClick}>
      {props.children}
    </tr>
  );
}
