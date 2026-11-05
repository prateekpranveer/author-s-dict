
import { useState } from 'react';
import {
  PlayCircle,
  Search,
  BookOpen,
  Sparkles,
  Headphones,
  Feather,
  ChevronRight,
  BookMarked,
} from 'lucide-react';
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
      const res = await fetch(
        `https://author-s-dict.onrender.com/search?word=${encodeURIComponent(word)}`
      );
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

  const uniqueAuthors = Array.from(
    new Set(results.map(r => r.author).filter(Boolean))
  );

  const filteredResults = selectedAuthor
    ? results.filter(r => r.author === selectedAuthor)
    : results;

  const visibleResults = filteredResults.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-[#f8f8f6] text-[#252525] font-sans selection:bg-amber-100 selection:text-amber-900">

      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
        <div className="absolute -top-48 -right-40 w-[500px] h-[500px] rounded-full bg-amber-100/30 blur-[100px]" />
        <div className="absolute top-[45%] -left-48 w-[400px] h-[400px] rounded-full bg-sky-100/30 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-8 sm:py-12">

        {/* Header */}
        <header className="text-center mb-12 sm:mb-16">

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#e9e5dc] bg-white/80 text-[#8b7355] text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] mb-6">
            <Sparkles size={13} />
            The Literary Word Explorer
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl tracking-[-0.055em] text-[#242424] leading-none">
            Author's
            <span className="text-[#b28b52] italic font-normal"> Dictionary</span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-[#85817b] max-w-xl mx-auto leading-relaxed">
            Discover the meaning of words through the beautiful
            language of literature.
          </p>

          <div className="flex items-center justify-center gap-3 mt-7 text-[10px] uppercase tracking-[0.2em] text-[#aaa49b]">
            <span className="w-8 h-px bg-[#d9d1c4]" />
            Words meet literature
            <span className="w-8 h-px bg-[#d9d1c4]" />
          </div>

        </header>

        {/* Search */}
        <section className="max-w-3xl mx-auto mb-12 sm:mb-16">

          <div className="search-shell bg-white p-2 rounded-2xl border border-[#eae7e1] shadow-[0_12px_40px_rgba(40,35,25,0.045)]">

            <div className="flex items-center gap-3">

              <div className="hidden sm:flex w-12 h-12 shrink-0 items-center justify-center rounded-xl bg-[#f8f5ef] text-[#b18b55]">
                <Search size={21} strokeWidth={1.7} />
              </div>

              <input
                className="w-full min-w-0 bg-transparent px-3 sm:px-1 py-4 text-base sm:text-lg text-[#333] placeholder:text-[#b6b1a9] outline-none"
                type="text"
                placeholder="Explore a word..."
                value={word}
                onChange={(e) => setWord(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                aria-label="Search for a word"
              />

              <button
                type="button"
                onClick={handleSearch}
                disabled={loading}
                className="search-button shrink-0 flex items-center justify-center gap-2 px-5 sm:px-7 py-4 rounded-xl bg-[#292925] hover:bg-[#a47c45] text-white text-sm font-medium transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="search-spinner" />
                ) : (
                  <>
                    <span>Explore</span>
                    <ChevronRight size={16} />
                  </>
                )}
              </button>

            </div>
          </div>

          <p className="text-center text-[11px] text-[#aaa49b] mt-4 tracking-wide">
            Enter at least 2 characters to begin your exploration
          </p>

        </section>

        {/* Error */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8 px-5 py-4 rounded-xl border border-red-100 bg-red-50 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {/* Main content */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 items-start">

          {/* Dictionary Panel */}
          <section className="lg:col-span-5">

            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-[#eee8dc] flex items-center justify-center text-[#a47c45]">
                <BookOpen size={18} strokeWidth={1.7} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#35332e]">
                  Word Definition
                </h2>
                <p className="text-[11px] text-[#a29c91]">
                  Meaning, pronunciation & origin
                </p>
              </div>
            </div>

            {loading && (
              <div className="panel-card min-h-48 flex flex-col items-center justify-center gap-3">
                <span className="search-spinner dark-spinner" />
                <p className="text-xs text-[#a29c91]">Finding the meaning...</p>
              </div>
            )}

            {!loading && !dictionary?.word && !error && (
              <div className="panel-card empty-panel min-h-[300px] flex flex-col items-center justify-center text-center px-6">
                <div className="empty-icon">
                  <BookMarked size={27} strokeWidth={1.3} />
                </div>
                <h3 className="font-serif text-2xl text-[#555047] mt-5">
                  A word awaits
                </h3>
                <p className="text-xs text-[#aaa49b] mt-2 max-w-[230px] leading-relaxed">
                  Search for a word to uncover its meaning, origins and literary context.
                </p>
              </div>
            )}

            {dictionary && dictionary.word && (
              <div className="panel-card dictionary-card p-5 sm:p-7">

                {/* Word heading */}
                <div className="pb-5 border-b border-[#eeeae3]">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#b18b55] font-semibold">
                    Dictionary Entry
                  </span>

                  <h2 className="font-serif text-4xl sm:text-5xl text-[#292823] tracking-tight mt-3 break-words">
                    {dictionary.word}
                  </h2>

                  {dictionary.phonetic && (
                    <p className="text-sm text-[#999188] mt-2 font-light tracking-wide">
                      {dictionary.phonetic}
                    </p>
                  )}
                </div>

                {/* Origin */}
                {dictionary.origin && (
                  <div className="py-5 border-b border-[#eeeae3]">
                    <div className="flex items-center gap-2 mb-2">
                      <Feather size={14} className="text-[#b18b55]" />
                      <span className="text-[10px] uppercase tracking-[0.18em] text-[#a18c70] font-semibold">
                        Etymology
                      </span>
                    </div>
                    <p className="text-sm text-[#777168] leading-relaxed italic">
                      {dictionary.origin}
                    </p>
                  </div>
                )}

                {/* Pronunciation */}
                {dictionary.phonetics?.length > 0 && (
                  <div className="py-5 border-b border-[#eeeae3]">
                    <div className="flex items-center gap-2 mb-3">
                      <Headphones size={14} className="text-[#b18b55]" />
                      <span className="text-[10px] uppercase tracking-[0.18em] text-[#a18c70] font-semibold">
                        Pronunciation
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {dictionary.phonetics.map((p, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#f8f6f2] border border-[#eeeae3]"
                        >
                          {p.text && (
                            <span className="text-sm text-[#625c52]">
                              {p.text}
                            </span>
                          )}

                          {p.audio && (
                            <button
                              type="button"
                              onClick={() => {
                                const audio = new Audio(p.audio);
                                audio.play();
                              }}
                              className="audio-button"
                              aria-label={`Play pronunciation ${p.text || ''}`}
                            >
                              <PlayCircle size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Meanings */}
                <div className="pt-5 space-y-6">
                  <div className="flex items-center gap-2">
                    <BookOpen size={14} className="text-[#b18b55]" />
                    <span className="text-[10px] uppercase tracking-[0.18em] text-[#a18c70] font-semibold">
                      Definitions
                    </span>
                  </div>

                  {dictionary.meanings?.map((m, i) => (
                    <div key={i}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-md bg-[#f2eee7] text-[#927449] text-[10px] font-semibold uppercase tracking-wider">
                          {m.partOfSpeech}
                        </span>
                        <span className="flex-1 h-px bg-[#eeeae3]" />
                      </div>

                      <ul className="space-y-3">
                        {m.definitions?.map((def, j) => (
                          <li key={j} className="flex gap-3">
                            <span className="text-[#c1a477] text-xs mt-1.5">
                              {String(j + 1).padStart(2, '0')}
                            </span>

                            <div className="min-w-0">
                              <p className="text-sm text-[#4e4a43] leading-relaxed">
                                {def.definition}
                              </p>

                              {def.example && (
                                <p className="mt-2 text-xs text-[#989087] leading-relaxed italic border-l-2 border-[#d9c6a5] pl-3">
                                  "{def.example}"
                                </p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

              </div>
            )}
          </section>

          {/* Literary Matches Panel */}
          <section className="lg:col-span-7">

            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#e9edf0] flex items-center justify-center text-[#708797]">
                  <Feather size={18} strokeWidth={1.7} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#35332e]">
                    Literary Discoveries
                  </h2>
                  <p className="text-[11px] text-[#a29c91]">
                    Words in the voices of authors
                  </p>
                </div>
              </div>

              {results.length > 0 && (
                <span className="text-[10px] font-semibold tracking-wide text-[#8c8171] bg-white border border-[#eae6df] rounded-full px-3 py-1.5">
                  {filteredResults.length} MATCHES
                </span>
              )}
            </div>

            {/* Author filters */}
            {uniqueAuthors.length > 0 && (
              <div className="panel-card px-5 py-4 mb-5">

                <p className="text-[10px] uppercase tracking-[0.18em] text-[#a49a8a] font-semibold mb-3">
                  Filter by author
                </p>

                <div className="flex flex-wrap gap-2">

                  <button
                    type="button"
                    onClick={() => setSelectedAuthor(null)}
                    className={`author-chip ${
                      !selectedAuthor ? 'author-chip-active' : ''
                    }`}
                  >
                    All Authors
                  </button>

                  {uniqueAuthors.map((author, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setSelectedAuthor(author)}
                      className={`author-chip ${
                        selectedAuthor === author ? 'author-chip-active' : ''
                      }`}
                    >
                      {author}
                    </button>
                  ))}

                </div>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="panel-card min-h-48 flex flex-col items-center justify-center gap-3">
                <span className="search-spinner dark-spinner" />
                <p className="text-xs text-[#a29c91]">
                  Exploring literary collections...
                </p>
              </div>
            )}

            {/* Empty state */}
            {!loading && results.length === 0 && !error && (
              <div className="panel-card empty-panel min-h-[300px] flex flex-col items-center justify-center text-center px-6">
                <div className="empty-icon">
                  <Feather size={27} strokeWidth={1.3} />
                </div>
                <h3 className="font-serif text-2xl text-[#555047] mt-5">
                  Literature speaks
                </h3>
                <p className="text-xs text-[#aaa49b] mt-2 max-w-[260px] leading-relaxed">
                  Search for a word and discover how celebrated authors have used it in their writing.
                </p>
              </div>
            )}

            {/* Results */}
            {!loading && visibleResults.length > 0 && (
              <div className="space-y-3">

                {visibleResults.map((item, idx) => {
                  const regex = new RegExp(`(${word})`, 'gi');
                  const parts = item.text.split(regex);

                  return (
                    <article
                      key={idx}
                      className="literary-card group"
                    >
                      <div className="flex gap-3 sm:gap-4">

                        <div className="quote-mark font-serif">
                          “
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="text-[13px] sm:text-sm text-[#514e48] leading-[1.9]">
                            {parts.map((part, i) =>
                              part.toLowerCase() === word.toLowerCase() ? (
                                <strong
                                  key={i}
                                  className="word-highlight"
                                >
                                  {part}
                                </strong>
                              ) : (
                                <span key={i}>{part}</span>
                              )
                            )}
                          </p>

                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-4 pt-3 border-t border-[#f0ede8]">

                            {item.author && (
                              <span className="text-[11px] font-semibold text-[#8d7049] tracking-wide">
                                {item.author}
                              </span>
                            )}

                            {item.author && item.book && (
                              <span className="text-[#c6bbaa]">·</span>
                            )}

                            {item.book && (
                              <span className="text-[11px] text-[#999187] italic">
                                {item.book}
                              </span>
                            )}

                          </div>

                        </div>
                      </div>
                    </article>
                  );
                })}

              </div>
            )}

            {/* No matches after filtering */}
            {!loading && filteredResults.length === 0 && word && results.length > 0 && (
              <div className="panel-card min-h-40 flex flex-col items-center justify-center text-center px-6">
                <p className="font-serif text-xl text-[#777168]">
                  No passages found
                </p>
                <p className="text-xs text-[#aaa49b] mt-2">
                  Try selecting another author.
                </p>
              </div>
            )}

            {/* Load more */}
            {filteredResults.length > visibleResults.length && (
              <div className="flex justify-center mt-8">
                <button
                  type="button"
                  onClick={() => setVisibleCount(visibleCount + 10)}
                  className="load-more-button"
                >
                  <span>Discover more passages</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

          </section>
        </main>

        {/* Footer */}
        <footer className="mt-20 pt-7 border-t border-[#eae6df] text-center">
          <div className="flex items-center justify-center gap-2 text-[#a99b86]">
            <Feather size={14} />
            <span className="font-serif italic text-sm">
              Every word has a story.
            </span>
          </div>
          <p className="text-[9px] uppercase tracking-[0.22em] text-[#bbb4aa] mt-3">
            Author's Dictionary
          </p>
        </footer>

      </div>
    </div>
  );
}

export default App;
