const Product = require('./product');
const mongoose = require('mongoose');
const {isEmail} = require('validator');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        validate: [isEmail, 'invalid email']
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpiration: Date,
    isAdmin: {
        type: Boolean,
        default: false
    },
    cart: {
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    require: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
    }
});

userSchema.methods.addToCart = function (product) {
    const index = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString()
    });

    const updatedCartItems = [...this.cart.items];

    let itemQuantity = 1;
    if (index > 0) {
        // cart zaten eklenmek istenen product var: quantity'i arttır
        itemQuantity = this.cart.items[index].quantity + 1;
        updatedCartItems[index].quantity = itemQuantity;
    } else {
        // updatedCartItems!a yeni bir eleman ekle
        updatedCartItems.push({
            productId: product._id,
            quantity: itemQuantity
        });
    }
    this.cart = {
        items: updatedCartItems
    };
    return this.save();
}

userSchema.methods.getCart = function (product) {

    const ids = this.cart.items.map(i => {
        return i.productId;
    });

    return Product
        .find({
            _id: {
                $in: ids
            }
        })
        .select('name price imageUrl')
        .then(products => {
            return products.map(p => {
                return {
                    name: p.name,
                    price: p.price,
                    imageUrl: p.imageUrl,
                    quantity: this.cart.items.find(i => {
                        return i.productId.toString() === p._id.toString()
                    }).quantity
                }
            });
        });

}


userSchema.methods.deleteCartItem = function (productid) {
    const cartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productid.toString()
    });

    this.cart.items = cartItems;
    return this.save();
}


userSchema.methods.clearCart = function () {
    this.cart = { items: [] };
    return this.save();
}

module.exports = mongoose.model('User', userSchema);












// const getDb = require('../utility/database').getdb;
// const mongodb = require('mongodb');

// class User {
//     constructor(name, email, cart, id) {
//         this.name = name;
//         this.email = email;
//         this.cart = cart ? cart : {};
//         this.cart.items = cart ? cart.items : [];
//         this._id = id;

//     }
//     save() {
//         const db = getDb();
//         db.collection('users')
//             .insertOne(this);

//     }
    
//     getCart() {
//         const ids = this.cart.items.map(i => {
//             return i.productId;
//         });
      
//         const db = getDb();
//         return db.collection('products')
//             .find({
//                 _id: ids
//             })
//             .toArray()
//             .then(products => {
//                 return products.map(p => {
//                     return {
//                         ...p,
//                         quantity: this.cart.items.find(i => {
//                             i.productId.toString() === p._id.toString()
//                         }).quantity
//                     }
//                 });
//             })
//     }

//     addToCart(product) {
//         const index = this.cart.items.findIndex(cp => {
//             return cp.productId.toString(product)._id.toString()
//         });

//         const updatedCartItems = [...this.cart.items];

//         let itemQuantity = 1;

//         if (index > 0) {
//             // cart zaten eklenmek istenen product var: quantity'i arttır
//             itemQuantity = this.cart.items[index].quantity + 1;
//             updatedCartItems[index].quantity = itemQuantity;
//         } else {
//             // updatedCartItems!a yeni bir eleman ekle
//             updatedCartItems.push({
//                 productId: new mongodb.ObjectId(product._id), quantity: itemQuantity
//             });

//         }

//         const db = getDb();
//         return db.collection('users')
//             .updateOne(
//                 { _id: new mongodb.ObjectId(product._id) },
//                 {
//                     $set: {
//                         cart: {
//                             items: updatedCartItems
//                         }
//                     }
//                 }
//             );
//     }
//     postCart(product) {
//         //save this.cart.items
//     }

//     static findById(userid) {
//         const db = getDB();
//         db.collection('users')
//             .findOne({ _id: new mongodb.ObjectId(userid) })
//             .then(user => {
//                 return user;
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//     }
//     static findByUserName(username) {

//         const db = getDb();
//         return db.collection('users')
//             .findOne({ name: username })
//             .then(user => {
//                 return user;
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//     }
//     deleteCartItem(productid) {
//         const cartItems = this.cart.items.filter(item => {
//             return item.productId.toString() !== productid.toString()
//         });

//         const db = getDb();

//         return db.collection('users')
//             .updateOne(
//                 { _id: new mongodb.ObjectId(this._id) },
//                 {
//                     $set: {
//                         cart: { items: cartItems }
//                     }
//                 }
//             )
//     }
//     addOrder() {
//         // get cart

//         // create order object

//         // save order

//         // update card

//         const db = getDb();
//         return this.getCart()
//             .then(products => {
//                 const order = {
//                     items: products.map(item => {
//                         return {
//                             _id: item._id,
//                             name: item.name,
//                             price: item.price,
//                             imageUrl: item.imageUrl,
//                             userId: item.userId,
//                             quantity: item.quantity
//                         }
//                     }),
//                     user: {
                    
//                         _id: mongodb.ObjectId(this._id),
//                         name: this.name,
//                         email: this.email
//                     },
//                     date: new Date().toLocaleString()
//                 }

//                 return db.collection('orders').insertOne(order);
//             })
//             .then(() => {
//                 this.cart = { items: [] };
//                 return db.collection('users')
//                     .updateOne({ _id: new mongodb.ObjectId(this._id) },
//                         {
//                             $set: {
//                             cart: {
//                                 items: []}
//                             }
                        
//                     })
                    
//             })

//     }

//     getOrders() {
//         const db = getDb();
//         return db.collection('orders')
//             .find({'user._id': new mongodb.ObjectId(this._id)})
//             .toArray();
        
//         }

// }
    

// // const Sequelize = require('sequelize');

// // const sequelize = require('../utility/database');

// // const User = sequelize.define('user', {
// //     id: {
// //         type: Sequelize.INTEGER,
// //         autoIncrement: true,
// //         allowNull: false,
// //         primaryKey: true
// //     },
// //     name: Sequelize.STRING,
// //     email: Sequelize.STRING
// // });

// module.exports = User;