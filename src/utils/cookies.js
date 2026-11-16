export const cookies = {
    getOptions: () => ({
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }),

    // set cookies
    set: (res, name, value, options = {}) => {
        res.cookie(name, value, { ...cookies.getOptions(), ...options });
    },

    // clear cookies
    clear: (res, name, options = {}) => {
        const { maxAge, ...clearOptions } = {
            ...cookies.getOptions(),
            ...options,
        };
        res.clearCookie(name, clearOptions);
    },

    // get cookies
    get: (req, name) => {
        return req.cookies?.[name];
    },
};
