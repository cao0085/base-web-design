// components/MenuOverlay.tsx
import style from './css/menuOverlay.module.css';

interface MenuOverlayProps {
  onClose: () => void;
}

export default function MenuOverlay({ onClose }: MenuOverlayProps) {
  return (
    <div className={style.overlay}>
      <div className={style.menuContent}>
        {/* <button className={style.closeBtn} onClick={onClose}>×</button> */}
        
        <nav className={style.navigation}>
          <a href="#home">首頁</a>
          <a href="#about">關於我們</a>
          <a href="#services">服務項目</a>
          <a href="#contact">聯絡我們</a>
        </nav>
      </div>
    </div>
  );
}