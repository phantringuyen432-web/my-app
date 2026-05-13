const express = require('express');
const cors = require('cors');

const app = express();

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes'); // kết hợp với app.use để tạo một APi endpint
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/product', productRoutes); // liên kết với fetch trong frontend App.jsx
app.use('/api/order', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use("/uploads", express.static("uploads"));

app.get('/', (req, res) => {
    res.send('API is running');
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});