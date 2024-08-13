const mongoose = require('mongoose');


const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'ürün ismi girmelisiniz'],
        minlength: [5, 'ürün ismi için minimum 5 karakter girmelisiniz!'],
        maxlength: [255, 'ürün ismi için maximum 255 karakter girmelisiniz!'],
        lowercase: true,
        trim:true
    },
   
    
    price: {
        type: Number,
        required: function () {
            return this.isActive;
        },
        min: 0,
        max: 10000,
        get: value => Math.round(value),
        set: value => Math.round(value)
    },

    description: {
        type: String,
        minlength:10
    },

    imageUrl: String,
    
    date: {
        type: Date,
        default: Date.now
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    

    tags: {
        type: Array,
        validate: {
            validator: function (value) {
                return value && value - length > 0;

            },
            message:'ürünün için en az bir etket giriniz'
        }
    },

    isActive: Boolean,
    
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required:false
        }
    ]
});
module.exports = mongoose.model('Product', productSchema);


// const getDb = require('../utility/database').getdb;

// const mongodb = require('mongodb');

// class Product{
//     constructor(name, price, description, imageUrl,categories, id, userId) {
//         this.name = name;
//         this.price = price;
//         this.description = description;
//         this.imageUrl = imageUrl;
//         this.categories = (categories && ! Array.isArray(categories))?Array.of(categories):categories;
//         this._id = id ? new mongodb.ObjectID(id) : null;
//         this.userId = userId;

//     }
//     save() {
//         let db = getDb();
        
//     if (this._id) {
//         db = db.collection('products').updateOne({_id: this._id },{$set: this});
            
//     } else {
//         db = db.collection('products')
//             .insertOne(this)
//     }

//     return db
//             .then(result => {
//                 console.log(result);
//             })
//             .catch(err => { console.log(err) });
//     }

//     static findAll() {
//         const db = getDb();
//         return db.collection('products')
//             .find()
//             .project({ name:1, price:1, imageUrl:1})
//             .toArray()
//             .then(products => {
//                 return products;
//             })
//             .catch(err => console.log(err));
//     }

//     static findById(productid) {
//         const db = getDb();
//         // return db.collection('products')
//         //      .find({ _id: new mongodb.ObjectID(productid) })
//         //      .toArray()
//         //      .then(products => {
//         //          return products;
//         //      }).catch(err => {
//         //          console.log(err);
//         //      })

//         return db.collection('products').
//             findOne({ _id: new mongodb.ObjectID(Productid) })
//             .then(product => {
//                 return product;
//             }).catch(err => {
//                 console.log(err);
//             });
//     }

//     static deleteById(productid) {
//         const db = getDb();
//         return db.collection('products')
//             .deleteOne({_id: new mongodb.ObjectID(productid)})
//             .then(() => {
//                 console.log('deleted');
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//     }

//     static findByCategoryId(categoryid) {
//         const db = getDb();
//         return db.collection('products')
//             .find({categories:categoryid})
//             .toArray()
//             .then(products => {
//                 return products
//         })
//     }
// }

// module.exports = Product;





























// // const Sequelize = require('sequelize');
// // const sequelize = require('../utility/database');

// // const Product = sequelize.define('product', {

// //     id: {
// //         type: Sequelize.INTEGER,
// //         autoIncrement: true,
// //         allowNull: false,
// //         primaryKey: true
// //     },

// //     name: Sequelize.STRING,
// //     price: {
// //         type: Sequelize.DOUBLE,
// //         allowNull:false
// //     },
// //     imageUrl: {
// //         type: Sequelize.STRING,
// //         allowNull: false
// //     },

// //     description: {
// //         type: Sequelize.STRING,
// //         allowNull: true
// //     }
    
// // });

// // module.exports = Product;