import React,{useEffect} from 'react';
import {ArrowUpRight,Users,Mountain} from 'lucide-react';
import ResultsScene from './ResultsScene';
export default function OwnerPage(){
 useEffect(()=>{document.documentElement.classList.remove('scene-mode');document.documentElement.classList.add('owner-mode');return()=>document.documentElement.classList.remove('owner-mode')},[]);
 return <div className="owner-app"><header className="owner-header"><a className="brand" href="/"><span className="brand-icon"><Mountain size={22}/></span><span>road to<br/><b>gather.</b></span></a><span><Users size={13}/> TỔNG KẾT CÂU TRẢ LỜI CỦA NHÓM</span><a href="/">Về trang chuyến đi <ArrowUpRight size={14}/></a></header><ResultsScene/></div>;
}
