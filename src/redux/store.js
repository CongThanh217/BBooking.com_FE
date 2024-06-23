import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reduces';

const store = configureStore({
    reducer: rootReducer,
});

export default store;