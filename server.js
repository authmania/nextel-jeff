import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import express from "express";
import path    from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// Auto-mount every file in /api as a route
const apiFiles = [
    "mevon-reserve",
    "mevon-webhook",
    "aspfiy-reserve",
    "aspfiy-webhook",
    "kora-webhook"
];

for (const name of apiFiles) {
    try {
        const { default: handler } = await import(`./api/${name}.js`);
        app.all(`/api/${name}`, handler);
        console.log(`  ✓ /api/${name}`);
    } catch (e) {
        console.warn(`  ✗ /api/${name} — ${e.message}`);
    }
}

// Serve HTML pages at clean URLs
const pages = ["register", "payment", "admin", "privacy-policy"];
for (const page of pages) {
    app.get(`/${page}`, (req, res) => {
        res.sendFile(path.join(__dirname, `${page}.html`));
    });
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`\nLocal dev server running at http://localhost:${PORT}\n`);
});
