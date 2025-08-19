import { useState, useEffect } from 'react';
import style from './css/menuOverlay.module.css';

interface MenuItem {
  id: string;
  label: string;
  href: string;
  imageUrl: string;
  description?: string;
}

interface MenuOverlayProps {
  isOpen: boolean;
  isClosing: boolean;
  onClose: () => void;
}

const menuItems: MenuItem[] = [
  {
    id: 'whats-on',
    label: "What's On",
    href: '#contact',
    imageUrl: '/images/whats-on.jpg',
    description: '最新活動與展覽'
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    href: '#home', 
    imageUrl: '/images/portfolio.jpg',
    description: '作品集展示'
  },
  {
    id: 'articles',
    label: 'Articles',
    href: '#services',
    imageUrl: '/images/articles.jpg',
    description: '文章與思考'
  },
  {
    id: 'about',
    label: 'About Me',
    href: '#about',
    imageUrl: '/images/about.jpg',
    description: '關於我的故事'
  }
];

export default function MenuOverlay({ isOpen, isClosing, onClose }: MenuOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // 處理進場動畫
  useEffect(() => {
    if (isOpen && !isClosing) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isOpen, isClosing]);

  // 處理退場動畫
  useEffect(() => {
    if (isClosing) {
      setIsVisible(false);
    }
  }, [isClosing]);

  const currentImage = hoveredItem 
    ? menuItems.find(item => item.id === hoveredItem)?.imageUrl 
    : null;

  return (
    <div 
      className={`${style.overlay} ${isVisible ? style.show : ''}`}
      onClick={onClose}
    >
      <div className={style.menuContent}>
        <div className={style.leftSection}>
          {currentImage ? (
            <img 
              src={currentImage} 
              alt="Menu preview" 
              className={style.previewImage}
            />
          ) : (
            <div className={style.placeholder}>
              這是照片區域
            </div>
          )}
        </div>
        <div className={style.rightSection}>
          <nav className={`${style.navigation} ${isVisible ? style.contentShow : ''}`}>
            {menuItems.map((item) => (
              <a 
                key={item.id}
                href={item.href}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={style.navLink}
                onClick={onClose}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className={style.info}>
            <div>Philippe Starck</div>
            <div>design@starck.com</div>
            <div className={style.infoTag}>
              <span>+886 920-200-100</span>
              <div className={style.locationGroup}>
                <span className={style.country}>Taiwan</span>
                <span className={style.separator}>|</span>
                <span className={style.since}>Since 2014</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}