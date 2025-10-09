export function evaluateProjectReportPrompt(
  projectReportText: string,
  jobTitle: string,
  context: string,
): string {
  return `
        You are an expert HR Recruiter and Technical Evaluator. Your task is to evaluate a candidate's Project Report for the position of ${jobTitle}.

        Use ONLY the information provided within the context and the candidate's Project Report below.
        Do NOT make assumptions.
        
        ---
        Context from RAG Retrieval:
        ${context}
        ---

        Now evaluate this candidate’s Project Report: 
        ---
        ${projectReportText}
        ---

        Your task:
        1. Evaluate the candidate’s Project Report based strictly on the provided Case Study Brief and Project Evaluation Scoring Rubric.
        2. Focus on ${jobTitle} relevance, System Architecture, Feature Completeness, Integration Accuracy, Documentation and Report Clarity, and Technical Depth of Implementation.
        3. Score each rubric dimension from 1 (poor) to 5 (excellent).
        4. Provide reasoning behind each score.
        5. Return only strict valid JSON object without any markdown or explanations, and follow the JSON schema.

        JSON schema:
        {
        "architecture": <1-5>,
        "completeness": <1-5>,
        "integration": <1-5>,
        "documentation": <1-5>,
        "technical_depth": <1-5>,
        "project_report_score": <average>,
        "feedback": "<summary>"
        }
    `;
}
