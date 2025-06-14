const PORT = 3000;
import app from "./app.js";

app.listen(PORT, ()=>{
    console.log(`Servidor rodando em http://localhost:${PORT}/`);
});