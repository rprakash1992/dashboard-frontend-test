import { Chart } from "./Chart";

const trace1 = {
  x: [1, 2, 3, 4],
  y: [10, 15, 13, 17],
  type: "scatter",
};

const trace2 = {
  x: [1, 2, 3, 4],
  y: [16, 5, 11, 9],
  type: "scatter",
};

const defaultData = [trace1, trace2];

const defaultLayout = {
  // width: 320,
  // height: 240,
  title: { text: "A Line Plot" },
};

export const LineChart = ({ chartData }: any) => {
  let data = defaultData;
  let layout = defaultLayout;

  if (chartData) {
    const x = chartData?.labels || [];
    const y = chartData?.datasets[0]?.data || [];
    const type = "line";

    data = [{ x: x, y: y, type: type }];
    layout = {
      title: { text: chartData?.datasets[0]?.label || "Line Chart" },
    };
  }

  return <Chart data={data} layout={layout} />;
};
