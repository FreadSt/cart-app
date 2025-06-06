import { takeEvery } from 'redux-saga/effects';

// Обработчик добавления товара в корзину
function* handleAddToCart(action: any) {
	const { payload } = action;
	if (payload.quantity <= 0) {
		console.error('Quantity must be greater than 0');
		return;
	}
	yield console.log('Adding item to cart:', payload);
}

// Корневая сага
export default function* rootSaga() {
	yield takeEvery('cart/addToCart', handleAddToCart);
}
