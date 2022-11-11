//import our db, Model, DataTypes
const { db, DataTypes } = require('../db/db')

//Creating a User child class from the Model parent class
const Show = db.define("shows", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    genre: {
        type: DataTypes.ENUM("Comedy", "Drama", "Horror", "Sitcom", "Uncategorised"),
        defaultValue: "Uncategorised"
    },
    rating: {type:DataTypes.INTEGER, defaultValue: 0},
    status: {type: DataTypes.STRING, status: "unknown"},
    watched: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

//exports
module.exports = { Show }
