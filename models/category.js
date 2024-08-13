const mongoose = require('mongoose');

categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String
});

module.exports = mongoose.model('Category', categorySchema);




// const getDb = require('../utility/database').getdb;
// const mongodb = require('mongodb');


// class Category{
//     constructor(name, description,id) {
//         this.name = name;
//         this.description = description;
//         this._id = id? new mongodb.ObjectId(id):null
//     }

//     save() {
//         let db = getDb();

//         if (this._id) {
//             db = db.collection('categories').updateOne({ _id: this._id }, { $set: this });
//         } else {
//             db = db.collection('categories').insertOne(this);
//         }

//         return db
//             .then(result => console.log(result))
//             .catch(err => console.log(err));
//     }

//     static findAll() {
//         const db = getDb();
//         return db.collection('categories')
//             .find()
//             .toArray()
//             .then(categories => {
//                 return categories;
//             }).catch(err => console.log(err));
//     }

//     static findById(categoryid) {
//         const db = getDb();
//         return db.collection('categories')
//             .findOne({_id:new mongodb.ObjectId(categoryid)})
//             .then(category => {
//                 return category;
//             }).catch(err => console.log(err));
//     }

// }


// // const Sequelize = require('sequelize');
// // const sequelize = require('../utility/database');

// // const Category = sequelize.define('category', {
// //     id: {
// //         type: Sequelize.INTEGER,
// //         autoIncrement: true,
// //         allowNull: false,
// //         primaryKey: true
// //     },
// //     name: Sequelize.STRING,
// //     description: {
// //         type: Sequelize.STRING,
// //         allowNull: true
// //     }

// // });

// module.exports = Category;