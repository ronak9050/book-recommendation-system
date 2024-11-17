const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/recommend', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes`, {
      params: {
        q: query,
        key: process.env.GOOGLE_BOOKS_API_KEY,
        maxResults: 10,
      },
    });

    const books = response.data.items.map((book) => ({
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors || ['Unknown Author'],
      description: book.volumeInfo.description || 'No description available',
      thumbnail: book.volumeInfo.imageLinks?.thumbnail || 'No Image',
      link: book.volumeInfo.infoLink,
    }));

    res.json(books);
  } catch (error) {
    console.error('Error fetching data from Google Books API:', error.message);
    if (error.response) {
      console.error('Response Data:', error.response.data);
      console.error('Response Status:', error.response.status);
    }
    res.status(500).json({ error: 'Failed to fetch data from Google Books API' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
