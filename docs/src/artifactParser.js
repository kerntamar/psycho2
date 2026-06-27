const bidiControls = /[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g;

export function cleanArtifactText(text) {
  return String(text || '')
    .replace(bidiControls, '')
    .replace(/\f/g, '\n')
    .replace(/[\u00a0\t]+/g, ' ')
    .replace(/[ ]{2,}/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function answerHeaderRegex() {
  return /(?:תשובה\D{0,30}([1-4])\D{0,30}נכונה|התשובה\s+הנכונה\s+היא\D{0,30}([1-4]))/g;
}

export function splitArtifactSolutions(text, source) {
  const normalized = cleanArtifactText(text);
  return [...normalized.matchAll(answerHeaderRegex())].map((match, index, matches) => {
    const start = match.index;
    const end = index + 1 < matches.length ? matches[index + 1].index : normalized.length;
    const raw = normalized.slice(start, end).trim();
    return {
      id: `${source.id}-artifact-q-${String(index + 1).padStart(3, '0')}`,
      sourceId: source.id,
      sourceTitle: source.title,
      sourceUrl: source.url,
      questionNumber: index + 1,
      correctAnswer: Number(match[1] || match[2]),
      explanation: raw.slice(0, 900),
      reviewStatus: 'auto_extracted_needs_review'
    };
  });
}

export function isArtifactSolutionSource(source) {
  return /פתרונות|פתרון|solutions?|answer key/i.test(source.title || '');
}
