const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

/**
 * Preprocesses text by:
 * 1. Lowercasing
 * 2. Removing special characters
 * 3. Tokenizing
 * 4. Removing stop words
 * 5. Stemming
 */
const preprocessText = (text) => {
    if (!text) return "";

    // Lowercase and remove special chars
    const cleaned = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');

    // Tokenize
    let tokens = tokenizer.tokenize(cleaned);

    // Remove stop words (basic list, natural has its own but we'll use a standard one for clarity)
    const stopWords = new Set(natural.stopwords);
    tokens = tokens.filter(token => !stopWords.has(token) && token.length > 2);

    // Stemming
    return tokens.map(token => natural.PorterStemmer.stem(token)).join(" ");
};

/**
 * Calculates Cosine Similarity between two texts
 */
const calculateCosineSimilarity = (text1, text2) => {
    if (!text1 || !text2) return 0;

    const prep1 = preprocessText(text1);
    const prep2 = preprocessText(text2);

    if (!prep1 || !prep2) return 0;

    const tfidf = new natural.TfIdf();
    tfidf.addDocument(prep1);
    tfidf.addDocument(prep2);

    const doc1Terms = {};
    const doc2Terms = {};

    tfidf.listTerms(0).forEach(item => { doc1Terms[item.term] = item.tfidf; });
    tfidf.listTerms(1).forEach(item => { doc2Terms[item.term] = item.tfidf; });

    // Calculate Dot Product
    let dotProduct = 0;
    const allTerms = new Set([...Object.keys(doc1Terms), ...Object.keys(doc2Terms)]);

    let mag1 = 0;
    let mag2 = 0;

    allTerms.forEach(term => {
        const val1 = doc1Terms[term] || 0;
        const val2 = doc2Terms[term] || 0;
        dotProduct += val1 * val2;
        mag1 += val1 * val1;
        mag2 += val2 * val2;
    });

    mag1 = Math.sqrt(mag1);
    mag2 = Math.sqrt(mag2);

    if (mag1 === 0 || mag2 === 0) return 0;

    return dotProduct / (mag1 * mag2);
};

module.exports = {
    preprocessText,
    calculateCosineSimilarity
};
