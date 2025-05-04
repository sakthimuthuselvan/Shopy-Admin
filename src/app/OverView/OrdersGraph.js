import React from "react";
import Chart from "react-apexcharts";

// 2. Apply the type to the function component
const LineChart = ({ graphDates, graphSeries }) => {
  const chartOptions = {
    chart: {
      id: "gradient-line-chart",
      toolbar: { show: false },
    },
    xaxis: {
      categories: graphDates ?? [],
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        gradientToColors: ["#0ec409"],
      },
    },
    markers: {
      size: 5,
      colors: ["#8af445"],
    },
    colors: ["#ffa600"],
  };

  return (
    <div>
      <h5>Total Sales</h5>
      {graphSeries.length > 0 && (
        <Chart
          options={chartOptions}
          series={graphSeries}
          type="line"
          height={300}
        />
      )}
    </div>
  );
};

export default LineChart;
