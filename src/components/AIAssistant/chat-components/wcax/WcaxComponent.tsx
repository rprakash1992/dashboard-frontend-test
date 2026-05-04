export const WcaxComponent = ({ file }: any) => {
  return (
    <iframe
      title="Wcax Viewer"
      src={`/WCAXVIEWER.html?file=${file}`}
      // src="/WCAXVIEWER.html?file=/beam.wcax"
      style={{ width: "1000px", height: "500px", border: "none" }}
    ></iframe>
  );
};
