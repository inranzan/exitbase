export const formatValidationError = errors => {
    if (!errors) return "Validation Failed";

    if (Array.isArray(errors.issues)) {
        return errors.issues.map(issue => issue.message).join(", ");
    }

    return typeof errors === "string" ? errors : JSON.stringify(errors);
};
