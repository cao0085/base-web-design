import { useState } from 'react';
import style from './css/hamburgerBtn.module.css';

interface HamburgerBtnProps {
  onClick?: (isOpen: boolean) => void;
  className?: string;
}

export default function HamburgerBtn({ onClick, className }: HamburgerBtnProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    onClick?.(newIsOpen);
  };

  return (
    <button 
      className={`${style.hamburgerBtn} ${isOpen ? style.active : ''} ${className || ''}`}
      onClick={handleClick}
      aria-label={isOpen ? "關閉選單" : "開啟選單"}
      aria-expanded={isOpen}
    >
      <span className={style.line}></span>
      <span className={style.line}></span>
      <span className={style.line}></span>
    </button>
  );
}