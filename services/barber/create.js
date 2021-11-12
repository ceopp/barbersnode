module.exports = async function (f, opts) {
  const Barber = f.db.Barber;
  const User = f.db.User;
  f.post(
    "/create",
    {
      schema: {
        tags: ["barber"],
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
            countryId: { type: "string" },
            cityId: { type: "string" },
            cityName: { type: "string"}
          },
        },
        security: [{Authorization: []}],
      },
      onRequest: f.auth,
    },
    async (req, res) => {
      try {
        let {
          portfolio,
          about,
          orderPlace,
          latitude,
          longitude,
          address,
          phone,
          name,
          cityName = 'Москва'
        } = req.body;

        let user = await User.findOne({
          where: {
            phone,
          },
        });
        let barber
        if (user) {
          barber = await Barber.findOne({
            where: {
              userId: user.id,
            },
          });
          if (barber) return res.methodNotAllowed("You already have registered Barber");
        } else {
          const phoneCode = req.body.phone == '+7(999) 999-99-99' || req.body.phone == '+7(999) 999-99-66' ? 1234 : f.utils.genCode();
          user = await User.create({
            phone,
            name,
            phoneCode,
            cityName
          });
        }

        if (req.body.barber) {
          latitude = req.body.barber.latitude;
          longitude = req.body.barber.longitude;
          address = req.body.barber.address;
        }
        barber = await Barber.create({
          userId: user.id,
          portfolio,
          about,
          orderPlace,
          latitude,
          longitude,
          address,
        });
        res.send(barber);
      } catch (e) {
        log.e(e);
      }
      res.internalServerError();
    }
  );
};
