module.exports = async function (f, opts) {
  const Barber = f.db.Barber;
  const User = f.db.User;
  f.post('/edit', {
    schema: {
      tags: ['barber'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        }
      },
      body: {
        type: "object",
        properties: {
          name: { type: "string" },
          about: {type: "string"},
          orderPlace: {type: "array", items: {type: "string"}},
          portfolio: {type: "array", items: {type: "string"}},
          latitude: {type: "string"},
          longitude: {type: "string"},
          address: {type: "string"},
          cityName: { type: "string"}
        },
      },
      security: [{ 'Authorization': [] }]
    },
    onRequest: f.auth,
  }, async (req, res) => {
    const { name, phone, about, cityName} = req.body
    const barber = await Barber.findByPk(req.params.id);
    const user = await User.findByPk(barber.userId)
    if (barber && user) {
      barber.assign({
        about
      });
      await barber.save();
      user.assign({
        name,
        phone,
        cityName
      })
      await user.save();
    } else {
      console.log('Error delete')
    }
    res.send(barber);
  });
};
