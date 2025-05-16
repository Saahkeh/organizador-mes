import React, { useReducer } from 'react';
import { textos } from '../contexts/textos';
import {Button, TextareaAutosize, TextField} from '@mui/material';

const initialState = {
    dados: [],
    carregando: false,
    erro: false,
    filtro: "",
    resultado: []
};

function reducer(state, action) {
    switch (action.type) {
        case 'CARREGAR':
            return { ...state, carregando: true, erro: false };
        case 'SUCESSO':
            return { ...state, carregando: false, dados: action.payload, resultado: action.payload };
        case 'ERRO':
            return { ...state, carregando: false, erro: action.payload };
        case 'BUSCAR':
            const resultadoFiltrados = state.dados.filter(item =>
                item.nome.toLowerCase().includes(action.payload.toLowerCase())
            );
            return { ...state, filtro: action.payload, resultado: resultadoFiltrados };
        default:
            return state;
    }
}

export default function App() {
    const [state, dispatch] = useReducer(reducer, initialState);

    const buscarDados = () => {
        dispatch({ type: 'CARREGAR' });
        fetch('https://raw.githubusercontent.com/Saahkeh/compra-do-mes/main/compra.json')

            .then((res) => res.json())
            .then((dados) => dispatch({ type: "SUCESSO", payload: dados }))
            .catch(() => dispatch({ type: "ERRO", payload: true }));
    };

    return (
        <div className="app">
            <h1>{textos.titulo}</h1>
            <TextField 
            label={textos.placeholder}
            variant="outlined"
            fullWidthvalue={state.filtro}
            onChange={(e) => dispatch({type:'BUSCAR', playload: e.target.value})}
            />

            <Button variant="contained" onClick={buscarDados}>{textos.botaoBuscar}</Button>

            {state.carregando && <p>Carregando...</p>}
            {state.erro && <p className="error">{textos.erro}</p>}
            <ul>
                {state.resultado.map((item, index) => (
                    <li key={index}>
                        <strong>{item.nome}</strong> - {item.preco} - {item.quantidade} - {item.unidade}
                    </li>
                ))}
            </ul>
        </div>
    );
}

