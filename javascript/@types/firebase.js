/**
 * @typedef {Object} QuerParams
 * @property {number} limit - Maximum number of results to return.
 * @property {string} orderBy - Field name for sorting the query results.
 */

/**
 * @typedef {Object} FirebaseManager
 * @property {function(string, QuerParams): Promise<any[]>} getAll - Fetches all documents from the given collection. Supports optional params like `{ limit, orderBy }`.
 * @property {function(string, string): Promise<any>} get - Fetches document with the specified document ID from the given collection.
 * @property {function(string, Object, string=): Promise<void>} set - Adds or updates a document in the given collection. If `id` is provided, updates the document; otherwise adds a new one.
 * @property {unknown} loggedUser - The authenticated Firebase user (anonymous).
 */

export {};
