const express = require('express');
const env = require('dotenv');
const { response } = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

//routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin/auth');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const initialDataRoutes = require('./routes/admin/initialData');
const pageRoutes = require('./routes/admin/page');
const addressRoutes = require('./routes/address');
const orderRoutes = require('./routes/order');
const adminOrderRoutes = require('./routes/admin/order.routes');

//environment variable or you can say constants

env.config();

//mongodb connection

// mongodb+srv://ishan:<password>@cluster0.x0d3gzz.mongodb.net/?retryWrites=true&w=majority

mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.x0d3gzz.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true, useUnifiedTopology: true
    }
).then(() => {
    console.log("Database Connected");
});

app.use(cors());
app.use(express.json());
app.use('/public',express.static(path.join(__dirname, 'uploads')))
app.use('/api',authRoutes);
app.use('/api',adminRoutes);
app.use('/api',categoryRoutes);
app.use('/api',productRoutes);
app.use('/api',cartRoutes);
app.use('/api',initialDataRoutes);
app.use('/api',pageRoutes);
app.use('/api',addressRoutes);
app.use('/api',orderRoutes);
app.use('/api',adminOrderRoutes);


app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
});


