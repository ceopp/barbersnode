module.exports = async function (f, opts) {
  const Barber = f.db.Barber;
  f.post(
    "/edit",
    {
      schema: {
        tags: ["user"],
        body: {
          type: "object",
          properties: {
            name: { type: "string" },
            birthday: { type: "string" },
            photo: { type: "string" },
            frequency: { type: "string" },
            countryId: { type: "string" },
            cityId: { type: "string" },
          },
        },
        security: [{ Authorization: [] }],
      },
      onRequest: f.auth,
    },
    async (req, res) => {
      console.log(req.user.id);
      let { name, birthday, photo, frequency, countryId, cityId } = req.body;

      req.user.assign({
        name,
        birthday,
        photo,
        frequency,
        countryId,
        cityId,
      });
      await req.user.save();
      if (req.body.barber) {
        const { latitude, longitude, address } = req.body.barber;
        try {
          let barber = await Barber.findOne({
            where: {
              userId: req.user.id,
            },
          });
          if (barber) {
            await barber.update({ latitude, longitude, address });
          }
        } catch (e) {
          log.e(e);
        }
      }

      res.send(req.user);
    }
  );
};
