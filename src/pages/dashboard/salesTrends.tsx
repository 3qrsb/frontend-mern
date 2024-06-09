import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { useAppSelector } from "../../redux";
import {
  format,
  parseISO,
  startOfWeek,
  startOfMonth,
  subMonths,
  getMonth,
  getYear,
} from "date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  Typography,
} from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const aggregateSales = (orders: any[], timeframe: string) => {
  const salesData: { [key: string]: number } = {};

  orders.forEach((order) => {
    let key = "";

    switch (timeframe) {
      case "weekly":
        key = format(startOfWeek(parseISO(order.createdAt)), "yyyy-MM-dd");
        break;
      case "daily":
        key = format(parseISO(order.createdAt), "yyyy-MM-dd");
        break;
      case "monthly":
      default:
        key = format(startOfMonth(parseISO(order.createdAt)), "yyyy-MM");
        break;
    }

    if (!salesData[key]) {
      salesData[key] = 0;
    }
    salesData[key] += order.totalPrice;
  });

  return salesData;
};

const calculateComparativeData = (orders: any[], timeframe: string) => {
  const currentPeriodSales = aggregateSales(orders, timeframe);

  const previousPeriodOrders = orders.filter((order) => {
    const orderDate = parseISO(order.createdAt);
    const previousPeriodStartDate =
      timeframe === "monthly"
        ? subMonths(new Date(), 1)
        : subMonths(new Date(), 1);
    return orderDate >= previousPeriodStartDate;
  });

  const previousPeriodSales = aggregateSales(previousPeriodOrders, timeframe);

  const salesDifference: { [key: string]: number } = {};
  Object.keys(currentPeriodSales).forEach((key) => {
    salesDifference[key] =
      currentPeriodSales[key] - (previousPeriodSales[key] || 0);
  });

  return { currentPeriodSales, salesDifference };
};

const SalesTrends: React.FC = () => {
  const { orders } = useAppSelector((state: any) => state.orders);
  const [timeframe, setTimeframe] = useState("monthly");

  const { currentPeriodSales, salesDifference } = calculateComparativeData(
    orders,
    timeframe
  );

  const sortedLabels = Object.keys(currentPeriodSales).sort();

  const data = {
    labels: sortedLabels,
    datasets: [
      {
        label: "Current Period Sales",
        data: sortedLabels.map((label) => currentPeriodSales[label]),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
      {
        label: "Sales Difference",
        data: sortedLabels.map((label) => salesDifference[label]),
        borderColor: "rgba(192, 75, 75, 1)",
        backgroundColor: "rgba(192, 75, 75, 0.2)",
        fill: true,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Sales Trends",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: timeframe.charAt(0).toUpperCase() + timeframe.slice(1),
        },
      },
      y: {
        title: {
          display: true,
          text: "Sales",
        },
      },
    },
  };

  const handleTimeframeChange = (event: SelectChangeEvent) => {
    setTimeframe(event.target.value);
  };

  return (
    <>
      <FormControl fullWidth margin="normal" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="timeframe-select-label">Timeframe</InputLabel>
        <Select
          labelId="timeframe-select-label"
          value={timeframe}
          onChange={handleTimeframeChange}
          label="Timeframe"
        >
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
        </Select>
      </FormControl>
      <Line data={data} options={options} />
      <Box mt={2}>
        <Typography variant="h6">Comparative Analysis</Typography>
        <Typography variant="body1">
          Showing the difference in sales between the current and previous
          periods.
        </Typography>
      </Box>
    </>
  );
};

export default SalesTrends;
