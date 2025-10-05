export function overallSummaryPrompt(
  cvResult: string,
  projectReportResult: string,
  jobTitle: string,
  context: string,
): string {
  return `
        You are acting as Human Resource Specialist and AI evaluator for a ${jobTitle} hiring process. Currently, you have the CV Evaluation Result and Project Report Evaluation Result of a candidate.
        You will provide an overall summary of the candidate's fitment for the ${jobTitle} position based on the combined insights from both evaluations.

        Use the following context as your evaluation guide:
        ---
        ${context}
        ---

        Now evaluate this CV Evaluation Result:
        ---
        ${cvResult}
        ---

        Now evaluate this Project Report Evaluation Result:
        ---
        ${projectReportResult}
        ---

        Your task:
        1. Evaluate the both candidate’s Project Report and CV Evaluation Result based strictly on the provided ${jobTitle} Job Description.
        2. Focus on ${jobTitle} relevance and Overall Summary based on given data and context.
        3. Provide reasoning behind overall summary of this job fitment.
        4. Include any additional comments or insights for the hiring team.
        5. Return ONLY a RAW valid JSON object (no markdown, no code fences):

        JSON schema:
        {
            "overall_summary": <summary>,
        }
    `;
}
