export function setNestedValue(obj, path, value) {
    const parts = path.split(".");
    let current = obj;
    parts.forEach((part, index) => {
        if (index === parts.length - 1) {
            current[part] = value;
        } else {
            if (!current[part] || typeof current[part] !== "object") {
                current[part] = {};
            }
            current = current[part];
        }
    });
}
