import React from "react";
import Chart from "react-apexcharts";

const LineChart = () => {
  const chartOptions = {
    chart: {
      id: "gradient-line-chart",
      toolbar: { show: false }, // Hide toolbar
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    },
    stroke: {
      curve: "smooth", // Smooth lines
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal", // Gradient direction: horizontal, vertical, diagonal
        gradientToColors: ["#0ec409"], // End color
        // stops: [0, 100],
      },
    },
    markers: {
      size: 5, // Adds dots on data points
      colors:["#8af445"]
    },
    colors: ["#ffa600"], // Start color
  };

  const chartSeries = [
    {
      name: "Sales (INR)",
      data: [1040, 1200, 2450, 3350, 2000, 220], // Data points
    },
  ];

  return (
    <div>
      <h5>Total Sales</h5>
      <Chart options={chartOptions} series={chartSeries} type="line" height={300} />
    </div>
  );
};

export default LineChart;
