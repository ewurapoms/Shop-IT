const Cart = require("../models/cartModel");
const Product = require("../models/prodModel");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

exports.createOrder = async (req, res, next) => {
  const newOrder = {
    product: req.body.productId,
    quantity: parseInt(req.body.quantity),
    user: req.body.userId,
  };

  try {
    const stock = await Product.findById(newOrder.product);
    if (newOrder.quantity > stock.quantity) return res.status(200).send({ message: "Product is out of stock" });
    const product = await Cart.create(newOrder);
    const update = { quantity: stock.quantity - newOrder.quantity };
    await Product.findByIdAndUpdate(stock.id, update, { new: true });
    return res.status(200).send({ message: "Order created successfully!", product });
  } catch (error) {
    return res.status(400).send({ message: "unable to create order", error });
  }
};

exports.getOrder = async (req, res, next) => {
  await Cart.findById(req.params.cartId)
    .populate("product", "productImage name price")
    .exec((err, cart) => {
      if (err) return res.status(400).send({ message: "showing order", err });
      const order = returnOrder(cart);
      return res.status(200).send({ message: "showing order", order });
    });
};

exports.getAllOrders = async (req, res, next) => {
  try {
    // Fetch all orders from the Cart model
    const orders = await Cart.find({});

    // Map each order to the desired format using the returnOrder function
    const formattedOrders = orders.map(order => returnOrder(order));

    // Return the formatted orders in the response
    return res.status(200).json({
      status: "success",
      results: formattedOrders,
    });
  } catch (error) {
    // Handle any errors that occur during fetching of orders
    return res.status(400).json({ message: "Error fetching orders", error });
  }
};


function returnOrder(cart) {
  return {
    name: cart.product.name,
    description: cart.product.description,
    price: cart.product.price,
    quantity: cart.quantity,
    total: cart.product.price * cart.quantity,
    image: cart.product.productImage,
    orderDate: cart.createdAt,
  };
}