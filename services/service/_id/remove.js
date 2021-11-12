module.exports = async function (f, opts) {
  const Service = f.db.Service;
  f.delete('/delete', {
    schema: {
      tags: ['services'],
      params: {
        type: 'object',
        properties: {
          id: {type: 'string'},
        }
      },
      security: [{'Authorization': []}]
    },
    onRequest: f.auth,
  }, async (req, res) => {
    Service.destroy({
      where: {
        id: req.params.id,
      }
    });
    res.send(true);
  });
};
