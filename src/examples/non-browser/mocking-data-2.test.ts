import { faker } from "@faker-js/faker";
import { addItemToCart, Customer, Item } from "./mocking-data";

const item: Item = {
  id: faker.string.uuid(),
  name: faker.commerce.product(),
  department: faker.commerce.department(),
  price: faker.number.int({ min: 1, max: 1000 }),
};

const customer: Customer = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  address: faker.location.streetAddress(),
  cart: {
    items: [],
    total: 0,
    tax: 0,
  },
};

describe("mocking data example 1", () => {
  it("should add an item to cart", () => {
    const result = addItemToCart(item, customer);

    expect(result.cart.items).toEqual([item]);
    expect(result.cart.total).toEqual(item.price);
  });

  it("should update the total if items already exist in the cart - fails", () => {
    const newItem: Item = {
      id: faker.string.uuid(),
      name: faker.commerce.product(),
      department: faker.commerce.department(),
      price: faker.number.int({ min: 1, max: 1000 }),
    };

    const result = addItemToCart(newItem, customer);

    expect(result.cart.items).toEqual([item, newItem]);
    expect(result.cart.total).toEqual(item.price + newItem.price);
  });

  it("should update the total if items already exist in the cart - passes", () => {
    const newItem: Item = {
      id: faker.string.uuid(),
      name: faker.commerce.product(),
      department: faker.commerce.department(),
      price: faker.number.int({ min: 1, max: 1000 }),
    };

    const result = addItemToCart(newItem, {
      ...customer,
      cart: { items: [item], total: item.price, tax: 0 },
    });

    expect(result.cart.items).toEqual([item, newItem]);
    expect(result.cart.total).toEqual(item.price + newItem.price);
  });
});
