import React, { useContext } from 'react';
import "./Cart.css";
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext);
  const navigate = useNavigate();

  // Lấy giá trị từ getTotalCartAmount()
  const rawSubtotal = getTotalCartAmount();
  // Nếu rawSubtotal là chuỗi đã định dạng (có chứa "VNĐ"), chuyển về số
  const subtotal =
    typeof rawSubtotal === "string"
      ? Number(rawSubtotal.replace(" VNĐ", "").replace(/\./g, ""))
      : rawSubtotal;

  // Nếu giỏ hàng rỗng (subtotal = 0) thì Delivery Fee = 0, ngược lại là 2 USD chuyển VNĐ
  const deliveryFee = subtotal === 0 ? 0 : 2 * 26787;
  // Tổng tiền: nếu subtotal = 0 thì là 0, nếu có sản phẩm thì là subtotal + deliveryFee
  const total = subtotal === 0 ? 0 : subtotal + deliveryFee;

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Mặt hàng</p>
          <p>Tiêu đề</p>
          <p>Giá</p>
          <p>Số lượng</p>
          <p>Tổng cộng</p>
          <p>Xóa</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={index}>
                <div className='cart-items-title cart-items-item'>
                  <img src={url+"/image/"+item.image} alt="" />
                  <p>{item.name}</p>
                  <p>{(item.price).toLocaleString("vi-VN")} VNĐ</p>
                  <p>{cartItems[item._id]}</p>
                  <p>{(item.price * cartItems[item._id]).toLocaleString("vi-VN")} VNĐ</p>
                  <p onClick={() => removeFromCart(item._id)} className='cross'>x</p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Thanh toán</h2>
          <div>
            <div className="cart-total-details">
              <p>Tạm tính</p>
              <p>{subtotal.toLocaleString("vi-VN")} VNĐ</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Phí giao hàng</p>
              <p>{subtotal === 0 ? "0 VNĐ" : deliveryFee.toLocaleString("vi-VN") + " VNĐ"}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Tổng cộng</b>
              <b>{total === 0 ? "0 VNĐ" : total.toLocaleString("vi-VN") + " VNĐ"}</b>
            </div>
          </div>
          <button onClick={() => navigate('/order')}>TIẾN HÀNH THANH TOÁN</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>Nếu bạn có mã khuyến mãi, hãy nhập vào đây</p>
            <div className='cart-promocode-input'>
              <input type="text" placeholder='mã khuyến mãi' />
              <button>Áp dụng</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
