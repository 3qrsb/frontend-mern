import { useMemo } from "react";
import { ChartOptions } from "chart.js";
import { useTheme, useMediaQuery } from "@mui/material";
import { Timeframe } from "../utils/salesUtils";

const useChartOptions = (timeframe: Timeframe): ChartOptions<"line"> => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const commonTickOptions = {
    font: { size: isSmallScreen ? 10 : 12 },
    padding: isSmallScreen ? 4 : 6,
  };

  return useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Sales Trends",
          font: { size: isSmallScreen ? 14 : 18 },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: timeframe.charAt(0).toUpperCase() + timeframe.slice(1),
            font: { size: isSmallScreen ? 10 : 12 },
          },
          ticks: { ...commonTickOptions },
        },
        y: {
          title: { display: true, text: "Sales ($)" },
          ticks: { ...commonTickOptions },
        },
        y1: {
          type: "linear",
          position: "right",
          grid: { drawOnChartArea: false },
          title: { display: true, text: "Growth (%)" },
          ticks: {
            ...commonTickOptions,
            callback: (value: any) => value + "%",
          },
        },
      },
    }),
    [timeframe, isSmallScreen]
  );
};

export default useChartOptions;
