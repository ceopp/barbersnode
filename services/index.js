module.exports = async (f, opts) => {
    f.setNotFoundHandler(async (req, res) => {
        return res.notFound('Method not found');
    });
};
