import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

interface DashboardMetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  percentageChange: number;
  changeLabel?: string;
}

const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({
  title,
  value,
  icon,
  percentageChange,
  changeLabel = "Since last month",
}) => {
  const isPositive = percentageChange >= 0;
  return (
    <Card sx={{ boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
          </Box>
          <Box>{icon}</Box>
        </Box>
        <Box mt={2} display="flex" alignItems="center">
          <Typography
            variant="caption"
            color={isPositive ? "success.main" : "error.main"}
            sx={{ mr: 1 }}
          >
            {isPositive ? `+${percentageChange}%` : `${percentageChange}%`}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {changeLabel}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardMetricCard;
