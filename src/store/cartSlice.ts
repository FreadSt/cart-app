import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Модель товара
export interface Product {
	id: number;
	name: string;
	price: number;
}

// Модель товара в корзине
export interface CartItem extends Product {
	quantity: number;
}

// Начальное состояние корзины
export interface CartState {
	items: CartItem[];
}

const initialState: CartState = {
	items: [],
};

// Лимит товаров в корзине
const CART_LIMIT = 200;

// Создание слайса для корзины
const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		addToCart(state, action: PayloadAction<CartItem>) {
			// Подсчёт текущего общего количества товаров
			const currentTotal = state.items.reduce((total, item) => total + item.quantity, 0);

			// Проверка, не превышает ли добавление лимит
			if (currentTotal + action.payload.quantity > CART_LIMIT) {
				console.error(`Cannot add more items. Cart limit of ${CART_LIMIT} items reached.`);
				return;
			}

			const item = state.items.find((i) => i.id === action.payload.id);
			if (item) {
				if (action.payload.quantity > 0) {
					item.quantity += action.payload.quantity;
				}
			} else if (action.payload.quantity > 0) {
				state.items.push(action.payload);
			}
		},
		removeFromCart(state, action: PayloadAction<number>) {
			state.items = state.items.filter((item) => item.id !== action.payload);
		},
		updateQuantity(state, action: PayloadAction<{ id: number; quantity: number }>) {
			const item = state.items.find((i) => i.id === action.payload.id);
			if (item) {
				const currentTotalWithoutItem = state.items
					.filter((i) => i.id !== item.id)
					.reduce((total, i) => total + i.quantity, 0);

				// Проверка, не превышает ли изменение количества лимит
				if (currentTotalWithoutItem + action.payload.quantity > CART_LIMIT) {
					console.error(`Cannot update quantity. Cart limit of ${CART_LIMIT} items would be exceeded.`);
					return;
				}

				if (action.payload.quantity > 0) {
					item.quantity = action.payload.quantity;
				} else {
					state.items = state.items.filter((i) => i.id !== action.payload.id);
				}
			}
		},
		setState(state, action: PayloadAction<CartState>) {
			state.items = action.payload.items;
		},
	},
});

export const { addToCart, removeFromCart, updateQuantity, setState } = cartSlice.actions;
export default cartSlice.reducer;
