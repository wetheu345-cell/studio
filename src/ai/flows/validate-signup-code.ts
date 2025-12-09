'use server';
/**
 * @fileOverview A client-side function to call the validateSignupCode Cloud Function.
 */

/**
 * Calls the securely hosted Cloud Function to validate a registration code.
 * @param registrationCode The registration code to validate.
 * @returns An object indicating if the code is valid.
 */
export async function validateSignupCode(
  registrationCode: string
): Promise<{ isValid: boolean }> {

    // In a real app, you would get this from your deployed function's trigger URL.
    // For now, this is a placeholder. You'll need to replace it after deployment.
    const functionUrl = `https://validatesignupcode-4k3p25aiea-uc.a.run.app`;
    
    try {
        const response = await fetch(functionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Method': 'POST',
            },
            body: JSON.stringify({ data: { registrationCode } }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${response.status} ${errorText}`);
        }

        const result = await response.json();
        return result.data;

    } catch (error) {
        console.error("Error calling validateSignupCode function:", error);
        return { isValid: false };
    }
}
