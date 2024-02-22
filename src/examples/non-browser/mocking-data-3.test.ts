import { faker } from "@faker-js/faker";
import { addItemToCart, Cart, Customer, Item } from "./mocking-data";

// Flexible but with sensible defaults

const makeItem = (overrides?: Partial<Item>): Item => {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.product(),
    department: faker.commerce.department(),
    price: faker.number.int({ min: 1, max: 1000 }),
    ...overrides,
  };
};

const makeCart = (overrides?: Partial<Cart>): Cart => {
  return {
    items: [],
    total: 0,
    tax: 0,
    ...overrides,
  };
};

const makeCustomer = (overrides?: Partial<Customer>): Customer => {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
    cart: makeCart(),
    ...overrides,
  };
};

describe("mocking data example 3", () => {
  it("should add an item to cart", () => {
    const item = makeItem();
    const customer = makeCustomer();

    const result = addItemToCart(item, customer);

    expect(result.cart.items).toEqual([item]);
    expect(result.cart.total).toEqual(item.price);
  });

  it("should update the total if items already exist in the cart", () => {
    const oldItem = makeItem();
    const newItem = makeItem();

    const customer = makeCustomer({
      cart: makeCart({
        items: [oldItem],
        total: oldItem.price,
      }),
    });

    const result = addItemToCart(newItem, customer);

    expect(result.cart.items).toEqual([oldItem, newItem]);
    expect(result.cart.total).toEqual(oldItem.price + newItem.price);
  });
});
