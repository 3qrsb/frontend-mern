import React from "react";
import { Line } from "react-chartjs-2";
import { Box, useTheme, useMediaQuery } from "@mui/material";

interface SalesTrendsChartProps {
  data: any;
  options: any;
}

const SalesTrendsChart: React.FC<SalesTrendsChartProps> = ({
  data,
  options,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: 300, md: 500 },
        overflowX: isSmallScreen ? "auto" : "visible",
      }}
    >
      <Line data={data} options={options} />
    </Box>
  );
};

export default SalesTrendsChart;
