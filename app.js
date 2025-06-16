import express from "express";
import fs from 'fs';

const app = express();
app.use(express.json());

let words = [];
try {
    const jsonData = fs.readFileSync('dictionary.json', 'utf-8');
    words = JSON.parse(jsonData);
    
    if (!Array.isArray(words)) {
        throw new Error('Dictionary data must be an array');
    }
    
    words = words.map(word => word.toLowerCase());
    
    console.log(`Loaded ${words.length} words from dictionary`);
} catch (error) {
    console.error('Error loading dictionary:', error.message);
    process.exit(1);
}

const searchWord = (word) => {
    return words.some((e) => e === word);
};

const searchByPrefix = (prefix) => {
    return words.filter((e) => e.startsWith(prefix));
}

const searchByInfix = (infix) => {
    return words.filter((e) => e.includes(infix));
}

const searchBySuffix = (suffix) => {
    return words.filter((e) => e.endsWith(suffix));
}

const getRandomWord = (length) => {
    const searchGroup = length > 0 ? words.filter((e) => e.length === length) : words;
    return searchGroup[Math.floor((Math.random() * searchGroup.length))]
}

const advancedSearch = (pre, inf, suf, min, max) => {
    return words.filter((e) =>
        e.startsWith(pre) &&
        e.includes(inf) &&
        e.endsWith(suf) &&
        e.length >= min &&
        e.length <= max
    );
}

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to the Dictionary API",
        endpoints: {
            word: "/word/:value",
            prefix: "/prefix/:value?lim=:number", 
            infix: "/infix/:value?lim=:number",
            suffix: "/suffix/:value?lim=:number",
            random: "/random?len=:number",
            advanced: "/advanced?pre=:prefix&inf=:infix&suf=:suffix&min=:number&max=:number&lim=:number"
        },
        totalWords: words.length
    });
});

app.get('/word/:value', (req, res) => {
    const value = req.params.value.toString().toLowerCase();
    const found = searchWord(value);
    
    if (found) {
        res.status(200).json({ 
            word: value, 
            found: true 
        });
    }
    else {
        res.status(404).json({ 
            word: value, 
            found: false,
            message: "Word not found in dictionary"
        });
    }
});

app.get('/prefix/:value', (req, res) => {
    const value = req.params.value.toString().toLowerCase();
    const { lim = 0 } = req.query;
    const limit = Number(lim);
    const response = searchByPrefix(value, limit);

    if (response.length > 0) {
        res.status(200).json({
            prefix: value,
            found: response.length,
            shown: limit > 0 && limit < response.length ? limit : response.length,
            words: limit > 0 ? response.slice(0, limit) : response
        });
    }
    else {
        res.status(404).json({
            prefix: value,
            count: 0,
            words: [],
            message: "No words found with this prefix"
        });
    }
});

app.get('/infix/:value', (req, res) => {
    const value = req.params.value.toString().toLowerCase();
    const { lim = 0 } = req.query;
    const limit = Number(lim);
    const response = searchByInfix(value, limit);
    
    if (response.length > 0) {
        res.status(200).json({
            infix: value,
            found: response.length,
            shown: limit > 0 && limit < response.length ? limit : response.length,
            words: limit > 0 ? response.slice(0, limit) : response
        });
    }
    else {
        res.status(404).json({
            infix: value,
            count: 0,
            words: [],
            message: "No words found containing this infix"
        });
    }
});

app.get('/suffix/:value', (req, res) => {
    const value = req.params.value.toString().toLowerCase();
    const { lim = 0 } = req.query;
    const limit = Number(lim);
    const response = searchBySuffix(value, limit);
    
    if (response.length > 0) {
        res.status(200).json({
            suffix: value,
            found: response.length,
            shown: limit > 0 && limit < response.length ? limit : response.length,
            words: limit > 0 ? response.slice(0, limit) : response
        });
    }
    else {
        res.status(404).json({
            suffix: value,
            count: 0,
            words: [],
            message: "No words found with this suffix"
        });
    }
});

app.get('/random', (req, res) => {
    const { len = 0 } = req.query;
    const wordLength = Number(len);

    if (Number.isInteger(wordLength) && wordLength >= 0) {
        const word = getRandomWord(wordLength);
        if (word) {
            res.status(200).json({
                word: word,
                length: word.length,
                requestedLength: wordLength > 0 ? wordLength : null
            });
        } else {
            res.status(404).json({ 
                error: `No words found with length ${wordLength}`,
                requestedLength: wordLength
            });
        }
    } else {
        res.status(400).json({
            error: "Invalid Parameter: 'len' must be a non-negative integer."
        });
    }
});

app.get('/advanced', (req, res) => {
    const { pre = "", inf = "", suf = "", min = 1, max = 99, lim = 0 } = req.query;
    const minLength = Number(min);
    const maxLength = Number(max);
    const limit = Number(lim);

    if (isNaN(minLength) || isNaN(maxLength)) {
        return res.status(400).json({
            error: "Parameters 'min' and 'max' must be valid numbers"
        });
    }
    
    if (minLength < 1 || maxLength < 1) {
        return res.status(400).json({
            error: "Parameters 'min' and 'max' must be positive integers"
        });
    }
    
    if (minLength > maxLength) {
        return res.status(400).json({
            error: "Parameter 'min' cannot be greater than 'max'"
        });
    }
    
    const response = advancedSearch(
        pre.toLowerCase(), 
        inf.toLowerCase(), 
        suf.toLowerCase(), 
        minLength, 
        maxLength,
    );
    
    res.status(response.length > 0 ? 200 : 404).json({
        filters: {
            prefix: pre || null,
            infix: inf || null,
            suffix: suf || null,
            minLength: minLength,
            maxLength: maxLength
        },
        found: response.length,
        shown: limit > 0 && limit < response.length ? limit : response.length,
        message: response.length === 0 ? "No words found with these parameters" : null,
        words: limit > 0 ? response.slice(0, limit) : response
    });
});

export default app;