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
  Divider,
} from "@mui/material";

const TopSellingProducts = () => {
  const dispatch = useAppDispatch();
  const { topSellingProducts = [], loading } = useAppSelector(
    (state) => state.productList
  );

  useEffect(() => {
    dispatch(getTopSellingProducts());
  }, [dispatch]);

  return (
    <Card>
      <CardContent>
        {loading ? (
          <Typography variant="body2" color="textSecondary">
            Loading...
          </Typography>
        ) : (
          <List>
            {topSellingProducts.map((product) => (
              <React.Fragment key={product._id}>
                <ListItem>
                  <ListItemText
                    primary={product.name}
                    secondary={`${product.totalSales} sales`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default TopSellingProducts;
