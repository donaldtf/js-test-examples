export type Item = {
  id: string;
  department: string;
  name: string;
  price: number;
};

export type Cart = {
  items: Item[];
  total: number;
  tax: number;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  address: string;
  cart: Cart;
};

export const addItemToCart = (item: Item, customer: Customer): Customer => {
  return {
    ...customer,
    cart: {
      ...customer.cart,
      items: [...customer.cart.items, item],
      total: customer.cart.total + item.price,
    },
  };
};
