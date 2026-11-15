export const cookies = {
    getOptions: () => ({
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 20 * 60 * 1000, // 20 minutes
    }),

    // set cookies
    set: (res, name, value, options = {}) => {
        res.cookie(name, value, { ...cookies.getOptions(), ...options });
    },

    // clear cookies
    clear: (res, name, options = {}) => {
        res.clearCookie(name, { ...cookies.getOptions, ...options });
    },

    // get cookies
    get: (req, name) => {
        return req.cookies[name];
    },
};
