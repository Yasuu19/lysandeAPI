import Availability from '../models/Availabity.js';

const formatAvailibilityOfRequest = (el, user) => ({
  date: el.at.date,
  moment: el.at.moment,
  platform: el.platform,
  user,
});

export const formatAvailibilityOfResponse = (el) => ({
  at: {
    date: el.date,
    moment: el.moment,
  },
  platform: el.platform,
  user: el.user,
});

const getAvailabilityByData = async (date, moment, user) => {
  try {
    const availability = await Availability.findOne({ date, moment, user });
    return availability;
  } catch (err) {
    return err;
  }
};

export const supressPastDate = async (availabilities) => {
  const supressElement = async (_id) => {
    await Availability.deleteOne({ _id });
  };
  let error;
  availabilities.forEach((el) => {
    if (!error) {
      if (new Date(+el.date) < new Date()) {
        try {
          supressElement(el._id);
        } catch (err) {
          error = err;
        }
      }
    }
  });
  return error;
};

export const updateAvailability = (req, res) => {
  if (req.body.length) {
    if (
      req.auth.role === 'admin'
      || !req.body.some((el) => {
        const abailityInDB = getAvailabilityByData(el.at.date, el.at.moment, req.auth.user);
        return abailityInDB && abailityInDB.user === req.auth.userId;
      })
    ) {
      const availabilities = [];
      try {
        let error = '';
        req.body.forEach(async (el) => {
          if (!error) {
            const availability = await getAvailabilityByData(
              el.at.date,
              el.at.moment,
              req.auth.userId,
            );
            if (availability) {
              await Availability.updateOne(
                { _id: availability._id },
                formatAvailibilityOfRequest(el, req.auth.userId),
              );
            } else {
              try {
                const availabilityEl = new Availability(
                  formatAvailibilityOfRequest(el, req.auth.userId),
                );
                await availabilityEl.save();
              } catch (err) {
                error = err;
              }
            }
            availabilities.push(el);
          }
        });
        if (!error) res.status(200).json(availabilities);
        else res.status(500).json(error);
      } catch (err) {
        res.status(500).json(err);
      }
    } else res.status(403).json('Unautharized');
  } else res.status(400).json('Body is required');
};

export const getAvailabilities = async (req, res) => {
  if (
    req.auth.role === 'admin'
    || req.auth.role === 'gm'
  ) {
    let availabilities = await Availability.find();
    const error = await supressPastDate(availabilities);
    if (error) res.status(500).json(error);
    else {
      availabilities = await Availability.find();
      res.status(200).json(availabilities.sort((a, b) => (+a.date) - (+b.date)).map(
        (el) => formatAvailibilityOfResponse(el),
      ));
    }
  } else res.status(403).json('Unautharized');
};

export const setSessionAvailability = async (date, moment, userId) => {
  try {
    await Availability.updateOne({
      date,
      moment: 'journée',
      user: userId,
    }, {
      platform: moment === 'journée' ? 'in-game' : 'rest',
    });
    await Availability.updateOne({
      date,
      moment: 'soirée',
      user: userId,
    }, {
      platform: moment === 'soirée' ? 'in-game' : 'rest',
    });
  } catch (error) {
    return error;
  }
  return 0;
};

export const deleteAllAvailabilities = async (req, res) => {
  if (req.auth.role === 'admin') {
    try {
      await Availability.deleteMany();
      res.status(200).json('All availabilities deleted');
    } catch (err) {
      res.status(500).json(err);
    }
  } else res.status(403).json('Unautharized');
};
