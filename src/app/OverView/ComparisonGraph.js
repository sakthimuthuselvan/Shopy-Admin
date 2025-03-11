import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const ApexChart = ({propData}) => {
  const [chartData] = useState({
    series: propData,
    options: {
      chart: {
        type: "pie",
      },
      labels: ["Completed Orders", "Pending Orders"],
      legend: {
        position: "bottom", // Moves labels to the bottom
        horizontalAlign: "center", // Centers the labels
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
            },
          },
        },
      ],
    },
  });

  return (
    <div>
      <ReactApexChart options={chartData.options} series={chartData.series} type="pie" width={380} />
    </div>
  );
};

export default ApexChart;
