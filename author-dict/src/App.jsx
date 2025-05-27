import { useState } from 'react';
import { PlayCircle } from 'lucide-react';
import './App.css';

function App() {
  const [word, setWord] = useState('');
  const [results, setResults] = useState([]);
  const [dictionary, setDictionary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);

  const handleSearch = async () => {
    if (!word.trim() || word.trim().length < 2) {
      setError('Please enter at least 2 characters.');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);
    setDictionary(null);
    setSelectedAuthor(null);
    setVisibleCount(10);

    try {
      const res = await fetch(`https://author-s-dict.onrender.com/search?word=${encodeURIComponent(word)}`);
      const data = await res.json();
      setResults(data.matches || []);
      setDictionary(data.dictionary || {});
    } catch (err) {
      console.error(err);
      setError('Failed to fetch results.');
    } finally {
      setLoading(false);
    }
  };

  const uniqueAuthors = Array.from(new Set(results.map(r => r.author).filter(Boolean)));
  const filteredResults = selectedAuthor
    ? results.filter(r => r.author === selectedAuthor)
    : results;
  const visibleResults = filteredResults.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-white text-gray-800 px-4 py-6 sm:p-10 font-sans">
      <div className="mx-auto max-w-7xl space-y-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-sky-700 mb-6 drop-shadow-sm">
          Author's Dictionary
        </h1>

        <div className="sm:px-12">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              className="w-full p-3 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              type="text"
              placeholder="Enter a word..."
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md shadow"
            >
              GO
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 mt-10">
            {/* Dictionary Panel */}
            <div className="lg:w-2/5 w-full">
              {loading && <p className="text-center text-sm text-sky-600 mt-6">Searching...</p>}
              {error && <p className="text-center text-sm text-red-600 mt-6">{error}</p>}

              {dictionary && dictionary.word && (
                <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4 text-sm leading-relaxed">
                  <h2 className="text-xl font-bold text-pink-700">
                    {dictionary.word}{' '}
                    <span className="text-gray-500 font-normal">{dictionary.phonetic}</span>
                  </h2>

                  {dictionary.origin && (
                    <p className="italic text-gray-600">Origin: {dictionary.origin}</p>
                  )}

                  {dictionary.phonetics?.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {dictionary.phonetics.map((p, i) => (
                        <div key={i} className="flex items-center gap-2">
                          {p.text && <span className="text-gray-700 font-medium">{p.text}</span>}
                          {p.audio && (
                            <button
                              onClick={() => {
                                const audio = new Audio(p.audio);
                                audio.play();
                              }}
                              className="flex items-center gap-1 px-2 py-1 text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-full shadow-sm transition"
                              aria-label={`Play pronunciation ${p.text || ''}`}
                            >
                              <PlayCircle size={18} />
                              <span className="text-xs font-medium">Play</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {dictionary.meanings?.map((m, i) => (
                    <div key={i} className="mt-2">
                      <h3 className="font-semibold text-sky-700 capitalize">{m.partOfSpeech}</h3>
                      <ul className="list-disc list-inside ml-4 text-gray-700">
                        {m.definitions?.map((def, j) => (
                          <li key={j} className="mb-1">
                            <span className="text-xs font-medium text-gray-900">{def.definition}</span>
                            {def.example && (
                              <span className="text-gray-500"> — “{def.example}”</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sentence Matches Panel */}
            <div className="lg:w-3/5 w-full space-y-3">
              {uniqueAuthors.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm text-gray-800 mb-2">
                    Author's Use “<span className='font-medium text-yellow-700'>{word}</span>”:
                  </h2>
                  <div className="flex flex-wrap gap-3 text-sm overflow-x-auto">
                    <span
                      onClick={() => setSelectedAuthor(null)}
                      className={`cursor-pointer border-b-2 pb-0.5 ${
                        !selectedAuthor
                          ? 'border-sky-600 text-sky-600 font-semibold'
                          : 'border-transparent text-gray-600 hover:text-red-600'
                      }`}
                    >
                      Show All
                    </span>
                    {uniqueAuthors.map((author, idx) => (
                      <span
                        key={idx}
                        onClick={() => setSelectedAuthor(author)}
                        className={`cursor-pointer border-b-2 pb-0.5 ${
                          selectedAuthor === author
                            ? 'border-sky-600 text-sky-600 font-semibold'
                            : 'border-transparent text-gray-600 hover:text-sky-600'
                        }`}
                      >
                        {author}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {visibleResults.map((item, idx) => {
                const regex = new RegExp(`(${word})`, 'gi');
                const parts = item.text.split(regex);

                return (
                  <div
                    key={idx}
                    className="px-4 py-3 bg-white border-l-4 border-sky-400 shadow-sm rounded-md text-sm"
                  >
                    <p className="mb-1">
                      {parts.map((part, i) =>
                        part.toLowerCase() === word.toLowerCase() ? (
                          <strong key={i} className="text-black font-semibold">{part}</strong>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )}
                    </p>
                    <div className="text-xs text-gray-600 italic">
                      {item.author && <>{item.author}</>}
                      {item.book && <> | {item.book}</>}
                    </div>
                  </div>
                );
              })}

              {filteredResults.length > visibleResults.length && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => setVisibleCount(visibleCount + 10)}
                    className="text-sky-600 text-sm font-medium underline hover:text-sky-800"
                  >
                    Load more...
                  </button>
                </div>
              )}

              {filteredResults.length === 0 && !loading && word && (
                <p className="text-center text-gray-400 text-sm">No sentence matches found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
