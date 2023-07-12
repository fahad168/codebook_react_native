import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStore, applyMiddleware } from 'redux';

import { persistStore, persistReducer } from 'redux-persist';
import rootReducer from './reducers/reducer';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['loginReducer'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, {}, applyMiddleware());

let persistor = persistStore(store);

export { store, persistor };
