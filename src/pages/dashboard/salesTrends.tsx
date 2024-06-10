import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { useAppSelector } from "../../redux";
import { format, parseISO, startOfWeek, startOfMonth } from "date-fns";
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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Menu,
  MenuItem as DropdownMenuItem,
  Typography,
} from "@mui/material";
import { ColorLens, GetApp } from "@mui/icons-material";
import { SketchPicker } from "react-color";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

const SalesTrends: React.FC = () => {
  const { orders = [] } = useAppSelector((state: any) => state.orders);
  const [timeframe, setTimeframe] = useState("monthly");
  const [colorCurrentPeriod, setColorCurrentPeriod] = useState(
    "rgba(75, 192, 192, 1)"
  );
  const [colorCumulative, setColorCumulative] = useState(
    "rgba(75, 75, 192, 1)"
  );
  const [openColorDialog, setOpenColorDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openExportMenu = Boolean(anchorEl);

  const handleColorDialogOpen = () => setOpenColorDialog(true);
  const handleColorDialogClose = () => setOpenColorDialog(false);

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setAnchorEl(null);
  };

  const currentPeriodSales = aggregateSales(orders, timeframe);

  const sortedLabels = Object.keys(currentPeriodSales).sort();

  const cumulativeSales = sortedLabels.reduce((acc, label) => {
    const lastValue = acc.length > 0 ? acc[acc.length - 1] : 0;
    acc.push(lastValue + currentPeriodSales[label]);
    return acc;
  }, [] as number[]);

  const data = {
    labels: sortedLabels,
    datasets: [
      {
        label: "Current Period Sales",
        data: sortedLabels.map((label) => currentPeriodSales[label]),
        borderColor: colorCurrentPeriod,
        backgroundColor: colorCurrentPeriod.replace(/[^,]+(?=\))/, "0.2"), // Adjusting opacity
        fill: true,
      },
      {
        label: "Cumulative Sales",
        data: cumulativeSales,
        borderColor: colorCumulative,
        backgroundColor: colorCumulative.replace(/[^,]+(?=\))/, "0.2"), // Adjusting opacity
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

  const exportCSV = () => {
    const csvRows = [];
    const headers = ["Date", "Current Period Sales", "Cumulative Sales"];
    csvRows.push(headers.join(","));

    sortedLabels.forEach((label, index) => {
      const row = [
        label,
        currentPeriodSales[label].toString(),
        cumulativeSales[index].toString(),
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sales_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Sales Trends", 20, 10);
    const tableData = sortedLabels.map((label, index) => [
      label,
      currentPeriodSales[label].toFixed(2),
      cumulativeSales[index].toFixed(2),
    ]);
    (doc as any).autoTable({
      head: [["Date", "Current Period Sales", "Cumulative Sales"]],
      body: tableData,
    });
    doc.save("sales_data.pdf");
  };

  return (
    <>
      <Box display="flex" alignItems="center" mb={2}>
        <FormControl margin="normal" sx={{ m: 1, minWidth: 150 }}>
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleColorDialogOpen}
          style={{ margin: "10px" }}
          startIcon={<ColorLens />}
        >
          Choose Colors
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleExportClick}
          style={{ margin: "10px" }}
          startIcon={<GetApp />}
        >
          Export Data
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={openExportMenu}
          onClose={handleExportClose}
        >
          <DropdownMenuItem onClick={exportCSV}>Export CSV</DropdownMenuItem>
          <DropdownMenuItem onClick={exportPDF}>Export PDF</DropdownMenuItem>
        </Menu>
      </Box>
      <Line data={data} options={options} />
      <Dialog open={openColorDialog} onClose={handleColorDialogClose}>
        <DialogTitle>Choose Colors</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h6">Current Period Sales</Typography>
              <SketchPicker
                color={colorCurrentPeriod}
                onChangeComplete={(color) =>
                  setColorCurrentPeriod(
                    `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`
                  )
                }
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6">Cumulative Sales</Typography>
              <SketchPicker
                color={colorCumulative}
                onChangeComplete={(color) =>
                  setColorCumulative(
                    `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`
                  )
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleColorDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SalesTrends;
