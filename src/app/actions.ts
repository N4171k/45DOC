'use server';

import { reviewCode, type CodeReviewInput, type CodeReviewOutput } from '@/ai/flows/code-review';

type ActionResult = {
  success: boolean;
  data?: CodeReviewOutput;
  error?: string;
}

export async function performCodeReview(input: CodeReviewInput): Promise<ActionResult> {
  try {
    const result = await reviewCode(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("Code review failed:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unexpected error occurred during code review." };
  }
}
