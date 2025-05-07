import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { addToCart, CartState, Product } from './store/cartSlice';
import CartItem from './CartItem';
import { mockApi } from './mockApi';

// Типы для стейта
export interface RootState {
  cart: CartState;
}

const Container = styled.div`
  padding: 20px;
  display: flex;
  gap: 20px;
`;

const ProductList = styled.div`
  flex: 1;
  border: 1px solid #ccc;
  padding: 10px;
`;

const ProductItem = styled.div`
  padding: 10px;
  margin: 5px 0;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: move;
`;

const Cart = styled.div`
  flex: 1;
  border: 1px solid #ccc;
  padding: 10px;
  min-height: 200px; /* Для визуального удобства при Drop */
`;

const Button = styled.button`
  padding: 5px 10px;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  &:hover {
    background: #0056b3;
  }
`;

const Input = styled.input`
  width: 60px;
  padding: 5px;
`;

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  // Загрузка товаров и восстановление корзины из localStorage
  useEffect(() => {
    mockApi.fetchProducts().then((data) => {
      setProducts(data);
      const initialQuantities = data.reduce((acc, product) => {
        acc[product.id] = 1;
        return acc;
      }, {} as { [key: number]: number });
      setQuantities(initialQuantities);
    });

    // Восстановление корзины из localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      dispatch({ type: 'cart/setState', payload: JSON.parse(savedCart) });
    }
  }, [dispatch]);

  // Сохранение корзины в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify({ items: cartItems }));
  }, [cartItems]);

  // Обработчик изменения количества
  const handleQuantityChange = useCallback((productId: number, value: number) => {
    if (value > 200) {
      alert('200 is the maximum limit for quantity.');
      setQuantities((prev) => ({
        ...prev,
        [productId]: 1, // Сбрасываем к исходному значению (1)
      }));
    } else {
      setQuantities((prev) => ({
        ...prev,
        [productId]: Math.max(1, value),
      }));
    }
  }, []);

  // Обработчик добавления в корзину
  const handleAddToCart = useCallback((product: Product, quantity: number) => {
    if (quantity > 0) {
      dispatch(addToCart({ ...product, quantity }));
      setQuantities((prev) => ({
        ...prev,
        [product.id]: 1,
      }));
    } else {
      alert('Quantity must be greater than 0');
    }
  }, [dispatch]);

  // Список продуктов
  const productElements = useMemo(() => {
    return products.map((product) => (
      <ProductItem
        key={product.id}
        draggable={true}
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', JSON.stringify({ ...product, quantity: quantities[product.id] || 1 }));
        }}
      >
        {product.name} - ${product.price}
        <Input
          type="number"
          value={quantities[product.id] || 1}
          min={1}
          max={200}
          onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 1)}
        />
        <Button onClick={() => handleAddToCart(product, quantities[product.id] || 1)}>
          Add to Cart
        </Button>
      </ProductItem>
    ));
  }, [products, quantities, handleQuantityChange, handleAddToCart]);

  // Список элементов корзины
  const cartElements = useMemo(() => {
    return cartItems.length === 0 ? (
      <p>Cart is empty</p>
    ) : (
      cartItems.map((item) => <CartItem key={item.id} item={item} />)
    );
  }, [cartItems]);

  return (
    <Container>
      <ProductList>
        <h2>Products</h2>
        {productElements}
      </ProductList>
      <Cart
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const productData = JSON.parse(e.dataTransfer.getData('text'));
          handleAddToCart(productData, productData.quantity || 1);
        }}
      >
        <h2>Cart</h2>
        {cartElements}
      </Cart>
    </Container>
  );
};

export default App;
