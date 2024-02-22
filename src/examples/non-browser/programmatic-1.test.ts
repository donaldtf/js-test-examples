import { faker } from "@faker-js/faker";
import { Order, ShipmentStatus, getShipmentStatus } from "./programmatic";
import { subDays } from "date-fns";

// Works, but verbose and repetitive

const makeOrder = (overrides?: Partial<Order>): Order => {
  return {
    orderNumber: faker.string.uuid(),
    orderDate: faker.date.recent(),
    shipmentDate: undefined,
    deliveryDate: undefined,
    lastUpdated: undefined,
    cancelDate: undefined,
    returnDate: undefined,
    items: [],
    ...overrides,
  };
};

describe("programmatic example 1", () => {
  it("should return NotFound if the order is not found", () => {
    const order = makeOrder({ shipmentDate: faker.date.recent() });
    const result = getShipmentStatus(order);

    expect(result).toEqual(ShipmentStatus.NotFound);
  });

  it("should return Pending if the order is not shipped", () => {
    const order = makeOrder({ shipmentDate: undefined });
    const result = getShipmentStatus(order);

    expect(result).toEqual(ShipmentStatus.Pending);
  });

  it("should return Delivered if the order is delivered", () => {
    const order = makeOrder({
      shipmentDate: faker.date.recent(),
      deliveryDate: faker.date.recent(),
    });
    const result = getShipmentStatus(order);

    expect(result).toEqual(ShipmentStatus.Delivered);
  });

  it("should return Returned if the order is returned", () => {
    const order = makeOrder({
      shipmentDate: faker.date.recent(),
      deliveryDate: faker.date.recent(),
      returnDate: faker.date.recent(),
    });
    const result = getShipmentStatus(order);

    expect(result).toEqual(ShipmentStatus.Returned);
  });

  it("should return Delayed if the order is delayed", () => {
    const order = makeOrder({
      shipmentDate: subDays(new Date(), 9),
      lastUpdated: subDays(new Date(), 9),
    });

    const result = getShipmentStatus(order);

    expect(result).toEqual(ShipmentStatus.Delayed);
  });

  it("should return Lost if the order is lost", () => {
    const order = makeOrder({
      shipmentDate: subDays(new Date(), 15),
      lastUpdated: subDays(new Date(), 8),
    });
    const result = getShipmentStatus(order);

    expect(result).toEqual(ShipmentStatus.Lost);
  });

  it("should return InTransit if the order is in transit", () => {
    const order = makeOrder({
      shipmentDate: faker.date.recent(),
      lastUpdated: subDays(new Date(), 5),
    });
    const result = getShipmentStatus(order);

    expect(result).toEqual(ShipmentStatus.InTransit);
  });

  it("should return Canceled if the order is canceled", () => {
    const order = makeOrder({ cancelDate: faker.date.recent() });
    const result = getShipmentStatus(order);

    expect(result).toEqual(ShipmentStatus.Canceled);
  });
});
