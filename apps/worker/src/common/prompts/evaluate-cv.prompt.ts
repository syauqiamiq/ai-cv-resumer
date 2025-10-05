export function evaluateCvPrompt(
  cvText: string,
  jobTitle: string,
  context: string,
): string {
  return `
        You are an AI evaluator for a ${jobTitle} position hiring process.

        Use the following context as your evaluation guide:
        ---
        ${context}
        ---

        Now evaluate this candidate’s CV: 
        ---
        ${cvText}
        ---

        Your task:
        1. Evaluate the candidate’s CV based strictly on the provided Job Description and Scoring Rubric.
        2. Focus on ${jobTitle} relevance, technical depth, clarity, and role alignment.
        3. Score each rubric dimension from 1 (poor) to 5 (excellent).
        4. Provide reasoning behind each score.
        5. Return only a valid JSON object without any markdown or explanations.
        
        JSON schema:
        {
        "cv_relevance": <1-5>,
        "technical_depth": <1-5>,
        "experience_representation": <1-5>,
        "role_fit": <1-5>,
        "clarity": <1-5>,
        "cv_score": <average>,
        "feedback": "<summary>"
        }
    `;
}
