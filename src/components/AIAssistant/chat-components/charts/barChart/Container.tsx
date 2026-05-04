import { Chart } from "./Chart";

// const data = {
//   type: "bar",
//   data: {
//     labels: [
//       "United States",
//       "China",
//       "Japan",
//       "Germany",
//       "India",
//       "United Kingdom",
//       "France",
//       "Brazil",
//       "Italy",
//       "Canada",
//     ],
//     datasets: [
//       {
//         label: "GDP in Trillions of USD",
//         data: [23.32, 17.73, 4.94, 4.22, 3.16, 3.13, 2.94, 2.06, 2.01, 1.99],
//         backgroundColor: "rgba(75, 192, 192, 0.2)",
//         borderColor: "rgba(75, 192, 192, 1)",
//         borderWidth: 1,
//       },
//     ],
//   },
//   options: {
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   },
// };

const defaultData = [
  {
    x: [1, 2, 3],
    y: [2, 6, 3],
    type: "scatter",
    mode: "lines+markers",
    marker: { color: "red" },
  },
  { type: "bar", x: [1, 2, 3], y: [2, 6, 3] },
];

const defaultLayout = {
  // width: 320,
  // height: 240,
  title: { text: "A Bar Plot" },
};

export const BarChart = ({ chartData }: any) => {
  let data = defaultData;
  let layout = defaultLayout;

  if (chartData) {
    const x = chartData?.labels || [];
    const y = chartData?.datasets[0]?.data || [];
    const type = "bar";

    data = [{ x: x, y: y, type: type }];
    layout = {
      title: { text: chartData?.datasets[0]?.label || "Bar Chart" },
    };
  }

  return <Chart data={data} layout={layout} />;
};
