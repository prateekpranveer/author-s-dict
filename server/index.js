import express from 'express';
import sqlite3 from 'sqlite3';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const db = new sqlite3.Database('./sentences.db', (err) => {
  if (err) return console.error(err.message);
  console.log('✅ Connected to SQLite database.');
});

// Updated table with author and book columns
db.run(`
  CREATE TABLE IF NOT EXISTS sentences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    author TEXT NOT NULL,
    book TEXT NOT NULL
  )
`);

// 🔍 Search + dictionary endpoint
app.get('/search', async (req, res) => {
  const { word } = req.query;

  if (!word) {
    return res.status(400).send('Missing word query parameter');
  }

  const searchTerm = `%${word}%`;

  db.all(
    'SELECT text, author, book FROM sentences WHERE text LIKE ?',
    [searchTerm],
    async (err, rows) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send('Database error');
      }

      try {
        const dictResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const dictData = await dictResponse.json();

        let dictionaryInfo = {};

        if (Array.isArray(dictData) && dictData[0]) {
          const entry = dictData[0];

          dictionaryInfo = {
            word: entry.word || word,
            phonetic: entry.phonetic || '',
            phonetics: entry.phonetics || [],
            origin: entry.origin || '',
            meanings:
              entry.meanings?.map(m => ({
                partOfSpeech: m.partOfSpeech,
                definitions: m.definitions?.map(d => ({
                  definition: d.definition,
                  example: d.example || '',
                  synonyms: d.synonyms || [],
                  antonyms: d.antonyms || [],
                })),
              })) || [],
          };
        } else {
          dictionaryInfo = { error: 'Word not found in dictionary' };
        }

        res.json({
          matches: rows, // array of { text, author, book }
          dictionary: dictionaryInfo,
        });
      } catch (fetchErr) {
        console.error('Error fetching dictionary data:', fetchErr);
        res.json({
          matches: rows,
          dictionary: { error: 'Failed to fetch dictionary info' },
        });
      }
    }
  );
});

// POST endpoint to receive chunks of sentences
app.post('/data', (req, res) => {
  const data = req.body;
  if (!Array.isArray(data)) return res.status(400).send('Expected an array.');

  // Prepare statement for inserting text, author, and book
  const stmt = db.prepare('INSERT INTO sentences (text, author, book) VALUES (?, ?, ?)');

  db.serialize(() => {
    data.forEach(item => {
      if (
        typeof item === 'object' &&
        typeof item.sentence === 'string' &&
        typeof item.author === 'string' &&
        typeof item.book === 'string'
      ) {
        stmt.run(item.sentence, item.author, item.book);
      }
    });

    stmt.finalize(err => {
      if (err) return res.status(500).send('Error inserting data.');
      res.send(`Stored ${data.length} sentences.`);
    });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
