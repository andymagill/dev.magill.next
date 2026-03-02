/**
 * Utility function to resolve Next.js 16+ async params
 *
 * Next.js 16 may pass `params` as either a direct object or a Promise.
 * This utility normalizes both cases into a single resolved object.
 *
 * @param params - Either a params object or a Promise that resolves to a params object
 * @returns A Promise that resolves to the normalized params object
 *
 * @example
 * // In a Next.js Server Component or async function:
 * const params = await resolveParams(props.params);
 * const slug = params.slug;
 */
export async function resolveParams<T>(params: T | Promise<T>): Promise<T> {
	return (params as any)?.then ? await (params as any) : params;
}
