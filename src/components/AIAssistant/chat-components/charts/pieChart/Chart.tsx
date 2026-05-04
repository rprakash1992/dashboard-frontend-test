import Plot from "react-plotly.js";

export const Chart = ({ data, layout }: any) => {
  return <Plot data={data} layout={layout} />;
};
