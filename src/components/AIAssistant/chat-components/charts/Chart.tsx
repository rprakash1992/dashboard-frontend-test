import { BarChart } from "./barChart/Container";
import { BubbleChart } from "./bubbleChart/Container";
import { LineChart } from "./lineChart/Container";
import { PieChart } from "./pieChart/Container";

export const Chart = ({ chartType, chartData }: any) => {
  if (chartType === "bar") {
    return <BarChart chartData={chartData} />;
  }

  if (chartType === "pie") {
    return <PieChart chartData={chartData} />;
  }

  if (chartType === "line") {
    return <LineChart chartData={chartData} />;
  }

  if (chartType === "bubble") {
    return <BubbleChart chartData={chartData} />;
  }
  // Add more chart types as needed
  return <div>Unsupported chart type</div>;
};
