import { colors } from "@mui/material";
import React from "react";
import ReactApexChart from "react-apexcharts";

const ApexChart = ({ propData }) => {  
  // Safely extract values from propData
  const series = [
    propData?.completed ?? 0,
    propData?.pending ?? 0,
  ];

  const chartData = {
    series: propData,
    options: {
      chart: {
        type: "pie",
      },
      labels: ["Completed Orders", "Pending Orders"],
      legend: {
        position: "bottom",
        horizontalAlign: "center",
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
      colors:["#12b615","#f85712"]
    },
  };

  return (
    <div>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="pie"
        width={380}
      />
    </div>
  );
};

export default ApexChart;
