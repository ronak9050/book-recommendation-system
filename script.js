const searchBtn = document.getElementById('search-btn');
const queryInput = document.getElementById('query');
const resultsDiv = document.getElementById('results');

searchBtn.addEventListener('click', async () => {
  const query = queryInput.value.trim();

  if (!query) {
    alert('Please enter a search query.');
    return;
  }

  resultsDiv.innerHTML = '<p>Loading...</p>';

  try {
    const response = await fetch(`http://localhost:3000/recommend?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const books = await response.json();

    if (books.length === 0) {
      resultsDiv.innerHTML = '<p>No results found.</p>';
      return;
    }

    resultsDiv.innerHTML = books
      .map(
        (book) => `
          <div class="book">
            <img src="${book.thumbnail}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.authors.join(', ')}</p>
            <p>${book.description}</p>
            <a href="${book.link}" target="_blank">Read more</a>
          </div>
        `
      )
      .join('');
  } catch (error) {
    resultsDiv.innerHTML = '<p>Error fetching results. Please try again.</p>';
    console.error('Fetch error:', error.message);
  }
});
