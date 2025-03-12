import React from "react";
import { Bar } from "react-chartjs-2";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { ChartOptions } from "chart.js";

interface TopSellingChartProps {
  topSellingProducts: Array<{
    _id: string;
    name: string;
    totalSales: number;
  }>;
}

const TopSellingChart: React.FC<TopSellingChartProps> = ({
  topSellingProducts,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const data = {
    labels: topSellingProducts.map((product) => product.name),
    datasets: [
      {
        label: "Total Sales",
        data: topSellingProducts.map((product) => product.totalSales),
        backgroundColor: "rgba(25, 118, 210, 0.6)",
        borderColor: "rgba(25, 118, 210, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Top Selling Products" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: 300, md: "auto" },
        overflowX: isSmallScreen ? "auto" : "visible",
      }}
    >
      <Bar data={data} options={options} />
    </Box>
  );
};

export default TopSellingChart;
