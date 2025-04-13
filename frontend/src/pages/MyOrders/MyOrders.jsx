import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';
const MyOrders = () => {



    const {url,token} = useContext(StoreContext);
    const [data,setData] = useState([]);

       
    const fetchOrders = async () => {
        try {
            const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
            console.log("Fetched orders response:", response.data); // Log toàn bộ phản hồi
            setData(response.data.data || []);
        } catch(error) {
            console.error("Fetch orders error:", error);
        }
    }
    

    useEffect(() =>{
        if (token) {
            fetchOrders();
        }
    },[token])

  return (
    <div className='my-orders'>
        <h2>Đơn hàng của tôi</h2>
        <div className="container">
            {data.map((order,index)=>{
                return(
                    <div key={index} className='my-orders-order'>
                        <img src={assets.parcel_icon} alt="" />
                        <p>{order.items.map((item,index) =>{
                            if (index === order.items.length-1) {
                                return item.name+" x "+item.quantity
                            }
                            else{
                                return item.name+" x "+item.quantity+", "
                            }
                        })}</p>
                            <p>{order.amount.toLocaleString("vi-VN")} VNĐ</p>
                            <p>Mặt hàng: {order.items.length}</p>
                            <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                            <button onClick={fetchOrders}>Theo dõi đơn hàng</button>
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default MyOrders
