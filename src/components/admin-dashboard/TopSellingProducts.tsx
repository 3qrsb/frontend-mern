import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux";
import { getTopSellingProducts } from "../../redux/products/slice-list";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Box,
} from "@mui/material";
import { TrendingUp as TrendingUpIcon } from "@mui/icons-material";
import { formatCurrency } from "../../utils/helper";

const TopSellingProducts = () => {
  const dispatch = useAppDispatch();
  const { topSellingProducts = [], loading } = useAppSelector(
    (state) => state.productList
  );

  useEffect(() => {
    dispatch(getTopSellingProducts());
  }, [dispatch]);

  return (
    <Card className="shadow border-0 mt-3" sx={{ borderRadius: "15px" }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <TrendingUpIcon style={{ color: "#1976d2", marginRight: "10px" }} />
          <Typography variant="h5" color="primary">
            Top Selling Products
          </Typography>
        </Box>
        {loading ? (
          <Typography variant="body2" color="textSecondary">
            Loading...
          </Typography>
        ) : (
          <List>
            {topSellingProducts.map((product) => (
              <React.Fragment key={product._id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar style={{ marginRight: "10px" }}>
                    <Avatar
                      alt={product.name}
                      src={product.image}
                      variant="circular"
                      style={{ width: 60, height: 60 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={product.name}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="textPrimary"
                        >
                          {`${product.totalSales} sales`}
                        </Typography>
                        <br />
                        <Typography
                          component="span"
                          variant="body2"
                          color="textSecondary"
                        >
                          {`Price: ${formatCurrency(product.price)}`}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default TopSellingProducts;
