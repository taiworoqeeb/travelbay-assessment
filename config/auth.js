
exports.isAuthenticated = (context) => {
    if (context) {
        return true;
    }
    throw new Error('User is not logged in (or authenticated).');
};
