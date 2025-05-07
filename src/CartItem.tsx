import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity, CartItem as CartItemType } from './store/cartSlice';
import { RootState } from './App';

// Стили для элемента корзины
const CartItemContainer = styled.div`
  padding: 10px;
  margin: 5px 0;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: move;
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

// Компонент для элемента корзины
interface CartItemProps {
	item: CartItemType;
	draggable?: boolean;
	onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, draggable, onDragStart }) => {
	const dispatch = useDispatch();
	const cartItems = useSelector((state: RootState) => state.cart.items);
	const [cartQuantity, setCartQuantity] = useState(item.quantity);

	// Подсчёт текущего общего количества без текущего товара
	const currentTotalWithoutItem = cartItems
		.filter((i) => i.id !== item.id)
		.reduce((total, i) => total + i.quantity, 0);

	// Максимально допустимое количество для текущего товара
	const maxAvailableForItem = Math.max(1, 200 - currentTotalWithoutItem);

	// Обработчик изменения количества
	const handleUpdateQuantity = useCallback(
		(newQuantity: number) => {
			const adjustedQuantity = Math.min(Math.max(1, newQuantity), maxAvailableForItem);
			setCartQuantity(adjustedQuantity);
			dispatch(updateQuantity({ id: item.id, quantity: adjustedQuantity }));
		},
		[dispatch, item.id, maxAvailableForItem]
	);

	return (
		<CartItemContainer
			draggable={draggable}
			onDragStart={onDragStart}
		>
			{item.name} - ${item.price} x
			<Input

				type="number"
				value={cartQuantity}
				min={1}
				max={201}
				onChange={(e) => {
					const newValue = parseInt(e.target.value) || 1;
					handleUpdateQuantity(newValue);
				}}
			/>
			<Button onClick={() => dispatch(removeFromCart(item.id))}>Remove</Button>
		</CartItemContainer>
	);
};

export default CartItem;
