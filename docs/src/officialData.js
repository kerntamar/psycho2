export const OFFICIAL_ARTIFACT_BRANCH = 'campus-il-extraction-artifacts';
export const OFFICIAL_CATALOG_URL = `https://raw.githubusercontent.com/kerntamar/psycho2/${OFFICIAL_ARTIFACT_BRANCH}/data/official/catalog.json`;

export const officialContentIndex = {
  artifactBranch: OFFICIAL_ARTIFACT_BRANCH,
  catalogUrl: OFFICIAL_CATALOG_URL,
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
    { id: 'campus-pdf-001', title: 'ספר קורס חלק א', domain: 'כללי', reviewStatus: 'auto_extracted_needs_review' },
    { id: 'campus-pdf-021', title: 'פתרונות סימולציה קמפוס 1', domain: 'כללי', reviewStatus: 'auto_extracted_needs_review' },
    { id: 'campus-pdf-090', title: 'פתרונות מלאים קיץ יולי 2019', domain: 'כללי', reviewStatus: 'auto_extracted_needs_review' },
    { id: 'campus-pdf-102', title: 'דפי סיכום חשיבה כמותית', domain: 'חשיבה כמותית', reviewStatus: 'auto_extracted_needs_review' }
  ]
};
