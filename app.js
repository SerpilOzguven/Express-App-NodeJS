const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoDbStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');
const multer = require('multer');

app.set('view engine', 'pug');
app.set('views', './views');

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/shop');
const accountRoutes = require('./routes/account');


const errorController = require('./controllers/errors');
const User = require('./models/user');
const { title } = require('process');

const ConnectionString = 'mongodb://localhost/node-app'

var store = new mongoDbStore({
    uri: ConnectionString,
    collection: 'mySessions'

});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/public/img/');
    },
    filename: function (req, file, cb) {
        cb(null, file.filename + '-' + Date.now() + path.extname(file.orginalname));//image-312223132.jpg
    }
})



//const mongoConnect = require('./utility/database').mongoConnect;





//Session  bilgilerinin veri tababıbda saklanması-Atlas MongoDb
//const ConnectionString = 'mongodb+srv://serpilozguven:.....'
//var store = new mongoDbStore({
//    uri: ConnectionString
//});

// const sequelize = require('./utility/database');

// const Category = require('./models/category');
// const Product = require('./models/product');
// const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cartItem');
// const Order = require('./models/order');
// const OrderItem = require('./models/orderItem');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage: storage}).single('image'));


app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000
    },
    store: store
}));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => { console.log(err) });
})
app.use(csurf());



// app.use((req,res,next) => {
//     User.findByPk(1)
//         .then(user => {
//             req.user = user;
//             next();
//         })
//         .catch(err => {
//             console.log(err);
//         })
// });

// routes
app.use('admin', adminRoutes);
app.use(userRoutes);
app.use(accountRoutes);

app.use(errorController.get500Page);

app.use((error, req, res, next) => {
    res.status(500).render('error/500', { title: 'Error' });
});



// Product.belongsTo(Category, {
//     foreignKey: {
//         allowNull:false
//     }
// });
// Category.hasMany(Product);
// Product.belongsTo(User);
// User.hasMany(Product);

// User.hasOne(Cart);
// Cart.belongsTo(User);

// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });

// Order.belongsTo(User);
// User.hasMany(Order);

// Order.belongsToMany(Product, { through: OrderItem });
// Product.belongsToMany(Order, { through: OrderItem });

// let _user;

// sequelize
//     //.sync({force:true})
//     .sync()
//     .then(() => {

//         User.findByPk(1)
//             .then(user => {
//                 if (!user) {
//                     return User.create({ name: 'sadikturan', email: 'email@gmail.com' });
//                 }
//                 return user;
//             }).then(user => {
//                 _user = user;
//                 return user.getCart();
//             }).then(cart => {
//                 if (!cart) {
//                     return _user.createCart();
//                 }
//                 return cart;
//             }).then(() => {
//                 Category.count()
//                     .then(count => {
//                         if (count === 0) {
//                             Category.bulkCreate([
//                                 { name: 'Telefon', description: 'telefon kategorisi' },
//                                 { name: 'Bilgisayar', description: 'bilgisayar kategorisi' },
//                                 { name: 'Elektronik', description: 'elektronik kategorisi' }
//                             ]);
//                         }
//                     });
//             });
//     })
//     .catch(err => {
//         console.log(err);
//     });
/*
mongoConnect(() => {
    
    User.findByUserName('serpilozguven')
        .then(user => {
            if (!user) {
                user = new User('serpilozguven', 'ozgser-1470@hotmail.com')
                return user.save();
            }
            return user;
        })
        .then(user => {
            console.log(user);
            app.listen(3000);
        })
        .catch(err => { console.log(err) });
});
*/


//mongoose.connect(ConnectionString)
//mongoose.connect('mongodb://localhost/node-app')

mongoose.connect(ConnectionString)
    .then(() => {
        console.log('connected to mongodb');
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })
        // User.findOne({ name: `serpilozguven` })
        //     .then(user => {
        //         if (!user) {
        //             user = new User({
        //                 name: 'serpilozguven',
        //                 email: 'ozgser-1470@hotmail.com',
        //                 cart: {
        //                     items: []
        //                 }
        //             });
        //             return user.save();
                    
        //         }
        //         return user;
        //     })
        //     .then(user => {
        //         console.log(user);
                
        
        
            