export function overallSummaryPrompt(
  cvResult: string,
  jobTitle: string,
  jobDescription: string,
): string {
  return `
        You are acting as Human Resource Specialist and AI evaluator for a ${jobTitle} hiring process. Currently, you have the CV Evaluation Result of a candidate.
        You will provide an overall summary of the candidate's fitment for the ${jobTitle} position based on CV Evalutation and provided Job Description.

        Use ONLY the information provided within the context, CV Evaluation Result and Job Description below.
        Do NOT make assumptions.
        
        ---
        Job Description Context:
        ${jobDescription}
        ---

        Now evaluate this CV Evaluation Result:
        ---
        ${cvResult}
        ---

        Your task:
        1. Evaluate the  candidate CV Evaluation Result based strictly on the provided ${jobTitle} Job Description.
        2. Focus on ${jobTitle} relevance and Overall Summary based on given data and context.
        3. Provide reasoning behind overall summary of this job fitment.
        4. Be concise and to the point, dont add additional JSON fields except defined field below.
        5.  Return only strict valid JSON object without any markdown or explanations, and follow the JSON schema.
        
        JSON schema:
        {
        "job_fitment_score": <1-5>,
        "overall_summary": <summary>,
        }
    `;
}
