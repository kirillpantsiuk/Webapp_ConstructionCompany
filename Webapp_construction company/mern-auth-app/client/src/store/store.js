// src/store/store.js
import { createStore, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk'; // Исправленный импорт
import rootReducer from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

export default store;
