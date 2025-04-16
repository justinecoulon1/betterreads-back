const BOOKS_QUERY = `
    SELECT DISTINCT ON (s.book_id) s.search_id                    AS search_id,
                                   word_similarity(s.text, :text) AS similarity
    FROM search s
    WHERE (s.text ILIKE :wildCardText OR word_similarity(s.text, :text) > 0.15)
      AND s.book_id IS NOT NULL
    group by s.book_id, s.search_id
    order by s.book_id, similarity desc
`;

const AUTHORS_QUERY = `
    SELECT s.search_id AS search_id, (word_similarity(s.text, :text) + 0.01) AS similarity
    FROM search s
    WHERE (s.text ILIKE :wildCardText OR word_similarity(s.text, :text) > 0.15)
      AND s.author_id IS NOT NULL
`;

export const SEARCH_QUERY = `(${BOOKS_QUERY}) UNION ALL (${AUTHORS_QUERY})`;
