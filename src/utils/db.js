const mongoose = require ('mongoose');

const connect = async database => {
  try {
    await mongoose.connect (database, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (e) {
    console.error (`Couldn't connect to database, Error: ${e}`);
  }
};

module.exports = connect;
