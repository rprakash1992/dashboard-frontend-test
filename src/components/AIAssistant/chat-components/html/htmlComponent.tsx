export const HTMLComponent = ({ htmlString }: any) => {
  return <div dangerouslySetInnerHTML={{ __html: htmlString }}></div>;
};
