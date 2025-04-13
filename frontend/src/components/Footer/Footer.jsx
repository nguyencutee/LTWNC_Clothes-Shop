import React from 'react'
import "./Footer.css"
import { assets } from '../../assets/assets'
const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo} alt="" />
            <p>Tại NBLK Fashion, chúng tôi không chỉ tạo ra quần áo chúng tôi tạo nên phong cách. Mỗi thiết kế là sự kết hợp giữa chất liệu chọn lọc, form dáng chuẩn và gu thời trang độc đáo, giúp bạn tự tin thể hiện cá tính riêng. Không đại trà, không rập khuôn – NBLK mang đến trải nghiệm thời trang dành riêng cho bạn.</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
         <div className="footer-content-center">
            <h2>CÔNG TY</h2>
            <ul>
                <li>Trang chủ</li>
                <li>Về chúng tôi</li>
                <li>Vận chuyển</li>
                <li>Chính sách bảo mật</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>LIÊN HỆ</h2>
            <ul>
                <li>+84-399-286-974</li>
                <li>contact@webnangcao.com</li>
            </ul>
        </div>       
      </div>
      <hr />
      <p className="footer-copyright">© 2025 All rights reserved. Designed by <span>WebnangcaoNguyenBaoLuanKien</span></p>
    </div>
  )
}

export default Footer
