import { differenceInCalendarDays } from "date-fns";

export enum ShipmentStatus {
  NotFound = "Not Found",
  Pending = "Pending",
  Delayed = "Delayed",
  InTransit = "In Transit",
  Delivered = "Delivered",
  Lost = "Lost",
  Returned = "Returned",
  Canceled = "Canceled",
}

export type Order = {
  orderNumber: string;
  orderDate: Date;
  shipmentDate?: Date;
  deliveryDate?: Date;
  lastUpdated?: Date;
  cancelDate?: Date;
  returnDate?: Date;
  items: string[];
};

export const getShipmentStatus = (order: Order): ShipmentStatus => {
  if (order.cancelDate) {
    return ShipmentStatus.Canceled;
  }

  if (!order.shipmentDate) {
    return ShipmentStatus.Pending;
  }

  if (order.returnDate) {
    return ShipmentStatus.Returned;
  }

  if (order.deliveryDate) {
    return ShipmentStatus.Delivered;
  }

  if (order.lastUpdated && order.shipmentDate) {
    const oneWeekSinceUpdated =
      Math.abs(differenceInCalendarDays(order.lastUpdated, new Date())) > 7;
    const twoWeeksSinceShipped =
      Math.abs(differenceInCalendarDays(order.shipmentDate, new Date())) > 14;

    if (oneWeekSinceUpdated && twoWeeksSinceShipped) {
      return ShipmentStatus.Lost;
    } else if (oneWeekSinceUpdated) {
      return ShipmentStatus.Delayed;
    } else {
      return ShipmentStatus.InTransit;
    }
  }

  return ShipmentStatus.NotFound;
};
