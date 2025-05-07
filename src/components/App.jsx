import React, { useReducer } from 'react';
import {textos} from '../contexts/textos';

const initialState = {
    itens: [],
    carregando: false,
    erro: false
};

function reducer(state, action) {
    switch (action.tpe) {
        case 'CARREGAR':
            return { ...state, carregando: true, erro: false, itens: [] };
        case 'SUCESSO':
            return { ...state, carregando: false, erro: false, itens: action.payload };
        case 'ERRO':
            return { ...state, carregando: false, erro: true};
        default:
            return state;
    }
}

function App() {
    const [state, dispatch] = useReducer(reducer, initialState);

    const buscarItens = () => {
        dispatch({ type: 'CARREGAR' });
        fetch('https://raw.githubusercontent.com/Saahkeh/compra-do-mes/main/compra.jsons')
            .then((res) => res.json())
            .then((data) => {dispatch({ type: 'SUCESSO', payload: data.itens })})
            .catch((error) => {dispatch({ type: 'ERRO' })});
    };
    return (
        <div className= "app-container">
            <h1>{textos.titulo}</h1>
            <button onClick={buscarItens}>{textos.botao}</button>
            {state.carregando && <p>{textos.carregando}</p>}
            {state.erro && <p className="error">{textos.erro}</p>}
            <ul>
                {state.itens.map((item,index) => (
                        <li key={index}>{item}</li>
                ))}
            </ul>
        </div>    
    );
}

export default App;