import React, { useState, useMemo, useCallback } from "react";
import { useAppSelector } from "../../../redux";
import Grid from "@mui/material/Grid2";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Menu,
  MenuItem as DropdownMenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { GetApp } from "@mui/icons-material";
import useExportData from "../../../hooks/useExportData";
import CustomLegend from "./CustomLegend";
import useChartOptions from "../../../hooks/useChartOptions";
import {
  aggregateSales,
  aggregateOrders,
  Timeframe,
} from "../../../utils/salesUtils";
import { Ordertypes } from "../../../types/order";
import useStoredColor from "../../../hooks/useStoredColor";
import SalesTrendsChart from "./SalesTrendsChart";

const SalesTrends: React.FC = () => {
  const { orders = [] } = useAppSelector((state: any) => state.orders) as {
    orders: Ordertypes[];
  };
  const [timeframe, setTimeframe] = useState<Timeframe>("daily");

  const [colorCurrentPeriod, setColorCurrentPeriod] = useStoredColor(
    "colorCurrentPeriod",
    "#4bc0c0"
  );
  const [colorCumulative, setColorCumulative] = useStoredColor(
    "colorCumulative",
    "#4b4bc0"
  );
  const [colorAOV, setColorAOV] = useStoredColor("colorAOV", "#FFCE56");
  const [colorSalesGrowth, setColorSalesGrowth] = useStoredColor(
    "colorSalesGrowth",
    "#FF6384"
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [datasetVisibility, setDatasetVisibility] = useState([
    true,
    true,
    true,
    true,
  ]);

  const currentPeriodSales = useMemo(
    () => aggregateSales(orders, timeframe),
    [orders, timeframe]
  );
  const aggregatedOrders = useMemo(
    () => aggregateOrders(orders, timeframe),
    [orders, timeframe]
  );
  const sortedLabels = useMemo(
    () => Object.keys(currentPeriodSales).sort(),
    [currentPeriodSales]
  );

  const cumulativeSales = useMemo(() => {
    return sortedLabels.reduce((acc: number[], label) => {
      const lastValue = acc.length > 0 ? acc[acc.length - 1] : 0;
      acc.push(lastValue + currentPeriodSales[label]);
      return acc;
    }, []);
  }, [sortedLabels, currentPeriodSales]);

  const aovData = useMemo(() => {
    return sortedLabels.map((label) => {
      const entry = aggregatedOrders[label];
      return entry && entry.count ? entry.total / entry.count : 0;
    });
  }, [sortedLabels, aggregatedOrders]);

  const salesGrowthData = useMemo(() => {
    return sortedLabels.map((label, i) => {
      if (i === 0) return 0;
      const prev = currentPeriodSales[sortedLabels[i - 1]] || 0;
      const curr = currentPeriodSales[label];
      return prev === 0 ? 0 : ((curr - prev) / prev) * 100;
    });
  }, [sortedLabels, currentPeriodSales]);

  const data = useMemo(
    () => ({
      labels: sortedLabels,
      datasets: [
        {
          label: "Current Period Sales",
          data: sortedLabels.map((label) => currentPeriodSales[label]),
          borderColor: colorCurrentPeriod,
          backgroundColor: `${colorCurrentPeriod}20`,
          fill: true,
          hidden: !datasetVisibility[0],
          yAxisID: "y",
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
        {
          label: "Cumulative Sales",
          data: cumulativeSales,
          borderColor: colorCumulative,
          backgroundColor: `${colorCumulative}20`,
          fill: true,
          hidden: !datasetVisibility[1],
          yAxisID: "y",
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
        {
          label: "Average Order Value",
          data: aovData,
          borderColor: colorAOV,
          backgroundColor: `${colorAOV}20`,
          fill: false,
          hidden: !datasetVisibility[2],
          yAxisID: "y",
          borderDash: [5, 5],
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
        {
          label: "Sales Growth (%)",
          data: salesGrowthData,
          borderColor: colorSalesGrowth,
          backgroundColor: `${colorSalesGrowth}20`,
          fill: false,
          hidden: !datasetVisibility[3],
          yAxisID: "y1",
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
      ],
    }),
    [
      sortedLabels,
      currentPeriodSales,
      cumulativeSales,
      aovData,
      salesGrowthData,
      colorCurrentPeriod,
      colorCumulative,
      colorAOV,
      colorSalesGrowth,
      datasetVisibility,
    ]
  );

  const options = useChartOptions(timeframe);

  const handleTimeframeChange = useCallback(
    (event: SelectChangeEvent<"daily" | "weekly" | "monthly">) => {
      setTimeframe(event.target.value as "daily" | "weekly" | "monthly");
    },
    []
  );

  const handleExportClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    },
    []
  );
  const handleExportClose = useCallback(() => setAnchorEl(null), []);

  const { exportCSV, exportPDF } = useExportData({
    sortedLabels,
    currentPeriodSales,
    cumulativeSales,
  });

  const handleToggleVisibility = useCallback((datasetIndex: number) => {
    setDatasetVisibility((prev) => {
      const updated = [...prev];
      updated[datasetIndex] = !updated[datasetIndex];
      return updated;
    });
  }, []);

  const handleChangeColor = useCallback(
    (datasetIndex: number, color: string) => {
      switch (datasetIndex) {
        case 0:
          setColorCurrentPeriod(color);
          break;
        case 1:
          setColorCumulative(color);
          break;
        case 2:
          setColorAOV(color);
          break;
        case 3:
          setColorSalesGrowth(color);
          break;
        default:
          break;
      }
    },
    [
      setColorCurrentPeriod,
      setColorCumulative,
      setColorAOV,
      setColorSalesGrowth,
    ]
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{ mb: 2 }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid size={{ xs: 4, sm: 4, md: 2 }}>
          <FormControl fullWidth variant="outlined">
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
        </Grid>
        <Grid size={{ xs: 4, sm: 4, md: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleExportClick}
            startIcon={<GetApp />}
            fullWidth
          >
            Export Data
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleExportClose}
          >
            <DropdownMenuItem
              onClick={() => {
                exportCSV();
                handleExportClose();
              }}
            >
              Export CSV
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                exportPDF();
                handleExportClose();
              }}
            >
              Export PDF
            </DropdownMenuItem>
          </Menu>
        </Grid>
      </Grid>
      <CustomLegend
        datasets={[
          { label: "Current Period Sales", color: colorCurrentPeriod },
          { label: "Cumulative Sales", color: colorCumulative },
          { label: "Average Order Value", color: colorAOV },
          { label: "Sales Growth (%)", color: colorSalesGrowth },
        ]}
        visibility={datasetVisibility}
        onToggleVisibility={handleToggleVisibility}
        onChangeColor={handleChangeColor}
      />
      <SalesTrendsChart data={data} options={options} />
    </Box>
  );
};

export default SalesTrends;
