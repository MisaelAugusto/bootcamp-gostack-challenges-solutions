import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      await AsyncStorage.removeItem('products');

      const productsList = await AsyncStorage.getItem('products');

      if (productsList) {
        setProducts(JSON.parse(productsList));
      }
    }

    loadProducts();
  }, []);

  const increment = useCallback(
    async id => {
      const updatedProducts = products.map(product => {
        if (product.id === id) {
          return { ...product, quantity: product.quantity + 1 };
        }

        return product;
      });

      await AsyncStorage.setItem('products', JSON.stringify(updatedProducts));

      setProducts(updatedProducts);
    },
    [products]
  );

  const decrement = useCallback(
    async id => {
      const updatedProducts = products.map(product => {
        if (product.id === id && product.quantity > 1) {
          return { ...product, quantity: product.quantity - 1 };
        }

        return product;
      });

      await AsyncStorage.setItem('products', JSON.stringify(updatedProducts));

      setProducts(updatedProducts);
    },
    [products]
  );

  const addToCart = useCallback(
    async product => {
      const productIndex = products.findIndex(item => item.id === product.id);

      if (productIndex === -1) {
        const updatedProducts = [...products, { ...product, quantity: 1 }];

        setProducts(updatedProducts);

        await AsyncStorage.setItem('products', JSON.stringify(updatedProducts));
      } else {
        increment(product.id);
      }
    },
    [products, increment]
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
