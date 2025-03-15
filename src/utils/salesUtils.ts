import { format, startOfWeek, startOfMonth } from "date-fns";
import { Order } from "../types/order";

export type Timeframe = "daily" | "weekly" | "monthly";

export interface SalesData {
  [key: string]: number;
}

export interface AggregatedData {
  [key: string]: { total: number; count: number };
}

export const aggregateSales = (
  orders: Order[],
  timeframe: Timeframe
): SalesData =>
  orders.reduce((acc: SalesData, order: Order) => {
    const date = order.createdAt;
    let key = "";
    if (timeframe === "daily") {
      key = format(date, "yyyy-MM-dd");
    } else if (timeframe === "weekly") {
      key = format(startOfWeek(date), "yyyy-MM-dd");
    } else {
      key = format(startOfMonth(date), "yyyy-MM");
    }
    acc[key] = (acc[key] || 0) + order.totalPrice;
    return acc;
  }, {});

export const aggregateOrders = (
  orders: Order[],
  timeframe: Timeframe
): AggregatedData =>
  orders.reduce((acc: AggregatedData, order: Order) => {
    const date = order.createdAt;
    let key = "";
    if (timeframe === "daily") {
      key = format(date, "yyyy-MM-dd");
    } else if (timeframe === "weekly") {
      key = format(startOfWeek(date), "yyyy-MM-dd");
    } else {
      key = format(startOfMonth(date), "yyyy-MM");
    }
    if (!acc[key]) {
      acc[key] = { total: 0, count: 0 };
    }
    acc[key].total += order.totalPrice;
    acc[key].count += 1;
    return acc;
  }, {});
