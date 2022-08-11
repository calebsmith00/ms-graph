interface SendModProps {
  isModified: boolean;
  updateModified: Function;
  sendModifiedTable: Function;
}

export default function SendModification(props: SendModProps) {
  const handleClick = () => {
    props.updateModified(false);
    props.sendModifiedTable();
  };

  return props.isModified ? (
    <div className="w-3/4 flex flex-col items-center mx-auto">
      <div className="pb-5">Send Modification</div>
      <div>
        <button
          className="rounded-xl bg-violet-500/75 px-3 py-1"
          onClick={handleClick}
        >
          Send to OneNote
        </button>
      </div>
    </div>
  ) : null;
}
