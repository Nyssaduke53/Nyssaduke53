// Utility functions for survey data
/* eslint-disable no-unused-vars */
export async function loadTemplate() {
  const res = await fetch('/src/data/template-survey.json');
  return res.json();
}

export function mergeUploads(template, uploads) {
  /* TODO – combine uploaded ratings into template */
}

export function compareSurveys(a, b) {
  /* TODO – return { compatibility: 0‑100, similarity: 0‑100, mismatches: [...] } */
}

export function exportSurvey(data) {
  /* return Blob / JSON string for download */
}
