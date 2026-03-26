import { User, Product } from '../types';

const USERS_KEY = 'agrichain_users';
const PRODUCTS_KEY = 'agrichain_products';
const LOGGED_IN_USER_KEY = 'agrichain_logged_in_user';

export const storage = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveUser: (user: User) => {
    const users = storage.getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },
  getProducts: (): Product[] => {
    const data = localStorage.getItem(PRODUCTS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveProducts: (products: Product[]) => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },
  getLoggedInUser: (): User | null => {
    const data = localStorage.getItem(LOGGED_IN_USER_KEY);
    return data ? JSON.parse(data) : null;
  },
  setLoggedInUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOGGED_IN_USER_KEY);
    }
  },
};
