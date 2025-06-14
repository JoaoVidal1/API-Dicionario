import e from "express";
import express from "express";
import fs from 'fs';

const app = express();
app.use(express.json());

const jsonData = fs.readFileSync('palavras.json', 'utf-8');
const palavras = JSON.parse(jsonData);

const testarPalavra = (palavra) => {
    return palavras.some((e) => e === palavra);
};

const testarPrefixo = (prefixo) => {
    return palavras.filter((e) => e.startsWith(prefixo));
}

const testarInfixo = (sufixo) => {
    return palavras.filter((e) => e.includes(sufixo));
}

const testarSufixo = (sufixo) => {
    return palavras.filter((e) => e.endsWith(sufixo));
}

const palavraAleatoria = (tamanho) => {
    const subconjunto = tamanho ? palavras.filter((e) => e.length === tamanho) : palavras;
    return subconjunto[Math.floor((Math.random() * subconjunto.length))]
}

app.get("/", (req, res) => {
    res.status(200).send("Bem vindo a API dicionário");
});

app.get('/palavra/:valor', (req, res) => {
    const valor = req.params.valor.toString().toLowerCase();
    const resultado = testarPalavra(valor)
    if (resultado) {
        res.status(200).json([valor]);
    } else {
        res.status(404).json([]);
    }
});

app.get('/prefixo/:valor', (req, res) => {
    const valor = req.params.valor.toString().toLowerCase();
    const resultado = testarPrefixo(valor);
    if (resultado != []) {
        res.status(200).json(resultado);
    }
    else {
        res.status(404).json(resultado);
    }
});

app.get('/infixo/:valor', (req, res) => {
    const valor = req.params.valor.toString().toLowerCase();
    const resultado = testarInfixo(valor);
    if (resultado != []) {
        res.status(200).json(resultado);
    }
    else {
        res.status(404).json(resultado);
    }
});

app.get('/sufixo/:valor', (req, res) => {
    const valor = req.params.valor.toString().toLowerCase();
    const resultado = testarSufixo(valor);
    if (resultado != []) {
        res.status(200).json(resultado);
    }
    else {
        res.status(404).json(resultado);
    }
});

app.get('/aleatorio/', (req, res) => {
    res.status(200).json(palavraAleatoria(false));
});

app.get('/aleatorio/:tamanho', (req, res) => {
    const tamanho = Number(req.params.tamanho);
    if (Number.isInteger(tamanho)) {
        res.status(200).json(palavraAleatoria(tamanho));
    } else {
        res.status(400).json({
            error: "Parâmetro inválido: 'tamanho' deve ser um número inteiro."
        });
    }
});

const pesquisaAvancada = (pfx, ifx, sfx, min, max) => {
    return palavras.filter((e) =>
        e.startsWith(pfx) &&
        e.includes(ifx) &&
        e.endsWith(sfx) &&
        e.length >= min &&
        e.length <= max
    );
}

app.get('/avancado', (req, res) => {
    const { pfx = "", ifx = "", sfx = "", min = "0", max = "99" } = req.query;
    const minNum = Number(min);
    const maxNum = Number(max);

    if (isNaN(minNum) || isNaN(maxNum)) {
        return res.status(400).json({ error: "Parâmetros 'min' ou 'max' inválidos." });
    }
    
    res.status(200).json(pesquisaAvancada(pfx, ifx, sfx, minNum, maxNum));
});

export default app;