import { useState } from 'react';
import style from './css/menuOverlay.module.css';

interface MenuItem {
  id: string;
  label: string;
  href: string;
  imageUrl: string;
  description?: string;
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




export default function MenuOverlay() {

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const currentImage = hoveredItem 
    ? menuItems.find(item => item.id === hoveredItem)?.imageUrl 
    : null;

  return (
    <div className={style.overlay}>
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
          <nav className={style.navigation}>
            {menuItems.map((item) => (
              <a 
                key={item.id}
                href={item.href}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={style.navLink}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className={style.info}>
            test
          </div>
        </div>
      </div>
    </div>
  );
}