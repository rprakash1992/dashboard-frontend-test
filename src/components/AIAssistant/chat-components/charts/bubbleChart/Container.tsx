import { Chart } from "./Chart";

const trace1 = {
  x: [1, 2, 3, 4],
  y: [10, 11, 12, 13],
  mode: "markers",
  marker: {
    size: [40, 60, 80, 100],
  },
};

const defaultData = [trace1];

const defaultLayout = {
  title: {
    text: "Marker Size",
  },
  showlegend: false,
  height: 600,
  width: 600,
};

// const layout2 = {
//   // width: 320,
//   // height: 240,
//   title: { text: "A Line Plot" },
// };

export const BubbleChart = ({ chartData }: any) => {
  let data = defaultData;
  let layout = defaultLayout;

  if (chartData) {
  }

  return <Chart data={data} layout={layout} />;
};
