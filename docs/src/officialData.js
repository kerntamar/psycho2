export const OFFICIAL_ARTIFACT_BRANCH = 'campus-il-extraction-artifacts';
export const OFFICIAL_ARTIFACT_BASE_URL = `https://raw.githubusercontent.com/kerntamar/psycho2/${OFFICIAL_ARTIFACT_BRANCH}/data/official/`;
export const OFFICIAL_CATALOG_URL = `${OFFICIAL_ARTIFACT_BASE_URL}catalog.json`;
export const OFFICIAL_SOLUTION_INDEX_URL = `${OFFICIAL_ARTIFACT_BASE_URL}solution-index.json`;
export const OFFICIAL_EXPLANATIONS_PREVIEW_URL = `${OFFICIAL_ARTIFACT_BASE_URL}explanations-preview.json`;
export const OFFICIAL_FORMULA_CANDIDATES_URL = `${OFFICIAL_ARTIFACT_BASE_URL}formula-candidates.json`;
export const OFFICIAL_REVIEW_STATUS = 'auto_extracted_needs_review';

export const officialContentIndex = {
  artifactBranch: OFFICIAL_ARTIFACT_BRANCH,
  artifactBaseUrl: OFFICIAL_ARTIFACT_BASE_URL,
  catalogUrl: OFFICIAL_CATALOG_URL,
  explanationsPreviewUrl: OFFICIAL_EXPLANATIONS_PREVIEW_URL,
  formulaCandidatesUrl: OFFICIAL_FORMULA_CANDIDATES_URL,
  pdfCount: 109,
  extractedTextCount: 109,
  solutionPdfCount: 0,
  parsedExplanationCount: 0,
  formulaCandidateCount: 0,
  domainCounts: {
    'אנגלית': 8,
    'חשיבה כמותית': 33,
    'חשיבה מילולית': 23,
    'מטלת כתיבה': 3,
    'כללי': 42
  },
  records: [
    { id: 'campus-pdf-001', title: 'ספר קורס חלק א', domain: 'כללי', reviewStatus: OFFICIAL_REVIEW_STATUS },
    { id: 'campus-pdf-021', title: 'פתרונות סימולציה קמפוס 1', domain: 'כללי', reviewStatus: OFFICIAL_REVIEW_STATUS },
    { id: 'campus-pdf-090', title: 'פתרונות מלאים קיץ יולי 2019', domain: 'כללי', reviewStatus: OFFICIAL_REVIEW_STATUS },
    { id: 'campus-pdf-102', title: 'דפי סיכום חשיבה כמותית', domain: 'חשיבה כמותית', reviewStatus: OFFICIAL_REVIEW_STATUS }
  ]
};
