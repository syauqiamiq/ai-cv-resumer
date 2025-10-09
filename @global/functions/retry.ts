import { BadRequestException } from '@nestjs/common';

/**
 * Simple retry function for external service calls
 *
 * @param fn Function to retry
 * @param maxRetries Number of retry attempts (default: 3)
 * @param delay Delay between retries in ms (default: 1000)
 * @returns Promise with the result
 *
 * @example
 * ```typescript
 * const result = await retry(() => externalApiCall());
 * const result = await retry(() => externalApiCall(), 5, 2000);
 * ```
 */
export async function retry<T>(
  fn: () => T | Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
): Promise<T> {
  let lastError: string = 'Unknown error';

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);

      if (attempt === maxRetries) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new BadRequestException(`${lastError}`);
}
