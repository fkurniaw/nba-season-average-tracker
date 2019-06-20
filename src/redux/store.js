import { createStore, applyMiddleware, compose } from 'redux';
import reducer from './rootReducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = composeEnhancers(applyMiddleware());

export default function configureStore() {
    let store = createStore(reducer, enhancer);
    return store;
}
