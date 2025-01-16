// src/store/reducers/index.js
import { combineReducers } from 'redux';
import authReducer from './auth';

const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;
