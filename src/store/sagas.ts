import { call, put, takeEvery } from 'redux-saga/effects';
import { addToCart } from './cartSlice';

// Обработчик добавления товара в корзину
function* handleAddToCart(action: any) {
	const { payload } = action;
	if (payload.quantity <= 0) {
		console.error('Quantity must be greater than 0');
		return;
	}
	yield console.log('Adding item to cart:', payload);
	// put(addToCart(payload)) не используется, так как редьюсер уже обрабатывает действие
	// call не используется, так как нет асинхронных вызовов на данном этапе
}

// Корневая сага
export default function* rootSaga() {
	yield takeEvery('cart/addToCart', handleAddToCart);
}
