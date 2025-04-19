import express from 'express';
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  next();
});

// Read database
async function readDB() {
  const data = await readFile(join(__dirname, 'db.json'), 'utf8');
  return JSON.parse(data);
}

// Write database
async function writeDB(data) {
  await writeFile(join(__dirname, 'db.json'), JSON.stringify(data, null, 2));
}

// GET all materials
app.get('/material_costs', async (req, res) => {
  try {
    const db = await readDB();
    res.json(db.material_costs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single material
app.get('/material_costs/:id', async (req, res) => {
  try {
    const db = await readDB();
    const material = db.material_costs.find(m => m.id === req.params.id);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new material
app.post('/material_costs', async (req, res) => {
  try {
    const db = await readDB();
    const newMaterial = req.body;
    db.material_costs.push(newMaterial);
    await writeDB(db);
    res.status(201).json(newMaterial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH update material
app.patch('/material_costs/:id', async (req, res) => {
  try {
    const db = await readDB();
    const index = db.material_costs.findIndex(m => m.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Material not found' });
    }
    db.material_costs[index] = { ...db.material_costs[index], ...req.body };
    await writeDB(db);
    res.json(db.material_costs[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET price history
app.get('/price_history', async (req, res) => {
  try {
    const db = await readDB();
    let history = db.price_history;
    
    if (req.query.material_id) {
      history = history.filter(h => h.material_id === req.query.material_id);
    }
    
    if (req.query.created_at_gte) {
      history = history.filter(h => new Date(h.created_at) >= new Date(req.query.created_at_gte));
    }
    
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new price history
app.post('/price_history', async (req, res) => {
  try {
    const db = await readDB();
    const newHistory = req.body;
    db.price_history.push(newHistory);
    await writeDB(db);
    res.status(201).json(newHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 