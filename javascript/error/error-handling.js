export function withErrorHandling(
    fn,
    { errorMessage = "An error occurred", onError }
) {
    return async (...args) => {
        try {
            return await fn(...args);
        } catch (err) {
            const error = new Error(`${errorMessage}: ${err.message}`);
            error.cause = err;

            if (onError && typeof onError === "function") {
                onError(error);
            }

            throw error;
        }
    };
}
