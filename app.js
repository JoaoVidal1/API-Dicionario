import express from "express";
import fs from 'fs';

const app = express();
app.use(express.json());

const jsonData = fs.readFileSync('dictionary.json', 'utf-8');
const words = JSON.parse(jsonData);

const testWord = (word) => {
    return words.some((e) => e === word);
};

const testPrefix = (prefix) => {
    return words.filter((e) => e.startsWith(prefix));
}

const testInfix = (infix) => {
    return words.filter((e) => e.includes(infix));
}

const testSuffix = (sufix) => {
    return words.filter((e) => e.endsWith(sufix));
}

const randomWord = (length) => {
    const searchGroup = length ? words.filter((e) => e.length === length) : words;
    return searchGroup[Math.floor((Math.random() * searchGroup.length))]
}

app.get("/", (req, res) => {
    res.status(200).send("Welcome to the dictionary API");
});

app.get('/word/:value', (req, res) => {
    const value = req.params.value.toString().toLowerCase();
    const response = testWord(value)
    if (response) {
        res.status(200).json([value]);
    } else {
        res.status(404).json([]);
    }
});

app.get('/prefix/:value', (req, res) => {
    const value = req.params.value.toString().toLowerCase();
    const response = testPrefix(value);
    if (response.length > 0) {
        res.status(200).json(response);
    }
    else {
        res.status(404).json(response);
    }
});

app.get('/infix/:value', (req, res) => {
    const value = req.params.value.toString().toLowerCase();
    const response = testInfix(value);
    if (response.length > 0) {
        res.status(200).json(response);
    }
    else {
        res.status(404).json(response);
    }
});

app.get('/suffix/:value', (req, res) => {
    const value = req.params.value.toString().toLowerCase();
    const response = testSuffix(value);
    if (response.length > 0) {
        res.status(200).json(response);
    }
    else {
        res.status(404).json(response);
    }
});

app.get('/aleatorio/', (req, res) => {
    res.status(200).json(randomWord(false));
});

app.get('/aleatorio/:length', (req, res) => {
    const length = Number(req.params.length);
    if (Number.isInteger(length) && length > 0) {
        const word = randomWord(length);
        if (word) {
            res.status(200).json(word);
        } else {
            res.status(404).json({ error: `No words found with length ${length}` });
        }
    } else {
        res.status(400).json({
            error: "Invalid Parameter: 'length' must be a positive integer."
        });
    }
});

const advancedSearch = (pfx, ifx, sfx, min, max) => {
    return words.filter((e) =>
        e.startsWith(pfx) &&
        e.includes(ifx) &&
        e.endsWith(sfx) &&
        e.length >= min &&
        e.length <= max
    );
}

app.get('/advanced', (req, res) => {
    const { pfx = "", ifx = "", sfx = "", min = "0", max = "99" } = req.query;
    const minNum = Number(min);
    const maxNum = Number(max);

    if (isNaN(minNum) || isNaN(maxNum) || minNum > maxNum) {
        return res.status(400).json({ error: "Parameters 'min' or 'max' are invalid." });
    }
    
    res.status(200).json(advancedSearch(pfx.toLowerCase(), ifx.toLowerCase(), sfx.toLowerCase(), minNum, maxNum));
});

export default app;
