import React from 'react';
import {ArrowUpRight} from 'lucide-react';
export default function DestinationScene({destination}) {
 const mountain=destination==='hagiang';
 return <section className={'destination-scene '+(mountain?'mountain-scene':'coast-scene')} aria-label={mountain?'Cảnh Hà Giang':'Cảnh Đà Nẵng'}>
  <div className="scene-landscape"><img src={mountain?'/images/ha-giang.jpg':'/images/da-nang.jpg'} alt={mountain?'Toàn cảnh núi non Hà Giang':'Toàn cảnh vịnh và thành phố Đà Nẵng'}/></div>
  <div className="scene-shade"/><div className="scene-contour" aria-hidden="true"/>
  <div className="cinema-top"><span>MỘT CHUYẾN ĐI. HAI CHÂN TRỜI.</span><span>01 — 03 / 01 / 2027</span></div>
  <div className="cinema-chapter"><span className="cinema-kicker">{mountain?'01 / ĐI VỀ PHÍA MÂY':'02 / THEO TIẾNG SÓNG'}</span><h2>{mountain?'Hà Giang':'Đà Nẵng'}<span>{mountain?<>Chạm vào <em>hùng vĩ.</em></>:<>Thả mình vào <em>bao la.</em></>}</span></h2><p>{mountain?<>Có những cung đường, đi một lần<br/>mà nhớ cùng nhau rất lâu.</>:<>Cầu Vàng là lựa chọn thêm.<br/>Một kỳ nghỉ có đủ chúng mình.</>}</p><a className="button lime" href="#journey">Xem lịch trình {mountain?'Hà Giang':'Đà Nẵng'} <ArrowUpRight size={17}/></a></div>
  <div className="scene-coordinate">{mountain?'23°16′ B · 105°22′ Đ':'16°03′ B · 108°12′ Đ'}</div>
 </section>;
}
