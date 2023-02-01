module.exports = (sequelize, Sequelize) => {
  const user = sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: Sequelize.STRING
    },
    last_name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING,
      unique:true
    },
    password: {
      type: Sequelize.STRING
    }
  });

  return user;
};
