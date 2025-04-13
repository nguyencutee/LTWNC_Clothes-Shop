import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5174";
  
  try {
    // Lấy giá trị VNĐ từ frontend (có thể là "6.000.000 VNĐ" hoặc số thô)
    const rawAmount = req.body.amount;
    const vndAmount = Number(String(rawAmount).replace(/[^\d]/g, ""));

    // Tỷ giá VNĐ → USD (bạn có thể cập nhật bằng API)
    const exchangeRate = 26787.4016; // giống như Stripe hiển thị

    // Convert VND → USD (cent)
    const usdAmountInCents = Math.round((vndAmount / exchangeRate) * 100);

    // Tạo đơn hàng mới trong database
    const newOrder = new orderModel({
      userId: req.userId,
      items: req.body.items,
      amount: vndAmount,
      address: req.body.address,
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

    // Tạo line items từ từng sản phẩm
    const line_items = req.body.items.map((item) => {
        const priceVND = Number(String(item.price).replace(/[^\d]/g, ""));
        const priceUSDInCents = Math.round((priceVND / exchangeRate) * 100);
      
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
            },
            unit_amount: priceUSDInCents,
          },
          quantity: item.quantity,
        };
      });
      

      const deliveryFeeUSD = 2; // 2 USD
      const deliveryFeeInCents = deliveryFeeUSD * 100;      

      line_items.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Delivery Charges",
          },
          unit_amount: deliveryFeeInCents, // Chính xác: 2 USD = 200 cents
        },
        quantity: 1,
      });
      

    // Tạo session thanh toán Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Đã xảy ra lỗi khi đặt hàng." });
  }
};

const verifyOrder = async (req,res) => {
    const {orderId,success} = req.body;
    try {
      if (success === "true") {
        await orderModel.findByIdAndUpdate(orderId,{payment:true});
        res.json({success:true,message:"Paid"})
      }
      else{
          await orderModel.findByIdAndDelete(orderId);
          res.json({success:false,message:"Not Paid"})
      }
    } catch (error) {
      console.log(error);
      res.json({success:false,message:"Error"})
      
    }
}


// user order for forntend
const userOrders = async (req,res) => {
  try {
    const orders = await orderModel.find({userId:req.userId});
    res.json({success:true,data:orders});
  } catch (error) {
    console.log(error);
    res.json({success:false, message:"Error"})
  }
}

// Listing orders for admin panel
const listOrders = async (req,res) =>{
  try {
      const orders = await orderModel.find({});
      res.json({success:true,data:orders})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
    
  }
}

// api for updating oder status
const updateStatus = async (req,res) =>{
    try {
      await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
      res.json({success:true,message:"Status Updated"})
    } catch (error) {
      console.log(error);
      res.json({success:false,message:"Error"})
    }
}

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
