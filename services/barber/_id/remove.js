module.exports = async function (f, opts) {
  const Barber = f.db.Barber;
  const User = f.db.User;
  f.delete('/delete', {
    schema: {
      tags: ['barber'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        }
      },
      security: [{ 'Authorization': [] }]
    },
    onRequest: f.auth,
  }, async (req, res) => {
    const barber = await Barber.findByPk(req.params.id);
    const user = await User.findByPk(barber.userId)
    if (barber && user) {
      Barber.destroy({
        where: {
          id: barber.id,
        }
      });
      User.destroy({
        where: {
          id: user.id,
        }
      });
    } else {
      console.log('Error delete')
    }
    res.send(true);
  });
};
