import { faker } from "@faker-js/faker";
import { Order, ShipmentStatus, getShipmentStatus } from "./programmatic";
import { subDays } from "date-fns";

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

// lets you focus on inputs and outputs, not test setup/structure
// not good for all kinds of tests but can be useful for some that have predictable inputs and outputs

const tests: { order: Partial<Order>; expected: ShipmentStatus }[] = [
  {
    order: { shipmentDate: faker.date.recent() },
    expected: ShipmentStatus.NotFound,
  },
  {
    order: makeOrder({ shipmentDate: undefined }),
    expected: ShipmentStatus.Pending,
  },
  {
    order: {
      shipmentDate: faker.date.recent(),
      deliveryDate: faker.date.recent(),
    },
    expected: ShipmentStatus.Delivered,
  },
  {
    order: {
      shipmentDate: faker.date.recent(),
      deliveryDate: faker.date.recent(),
      returnDate: faker.date.recent(),
    },
    expected: ShipmentStatus.Returned,
  },
  {
    order: {
      shipmentDate: subDays(new Date(), 9),
      lastUpdated: subDays(new Date(), 9),
    },
    expected: ShipmentStatus.Delayed,
  },
  {
    order: {
      shipmentDate: subDays(new Date(), 15),
      lastUpdated: subDays(new Date(), 8),
    },
    expected: ShipmentStatus.Lost,
  },
  {
    order: {
      shipmentDate: faker.date.recent(),
      lastUpdated: subDays(new Date(), 5),
    },
    expected: ShipmentStatus.InTransit,
  },
  {
    order: { cancelDate: faker.date.recent() },
    expected: ShipmentStatus.Canceled,
  },
];

describe("programmatic example 2", () => {
  tests.forEach(({ order, expected }) => {
    it(`should return ${expected} if the order`, () => {
      const result = getShipmentStatus(makeOrder(order));

      expect(result).toEqual(expected);
    });
  });
});
