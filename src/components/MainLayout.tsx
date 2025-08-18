import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store/store';
import { Outlet } from 'react-router-dom';
import { setLanguage } from '@/store/slices/languageSlice';
import { setTheme } from '@/store/slices/viewsSlice';
import NavPanel from '@/components/NavPanel';
import layoutStyles from '@/css/components/MainLayout.module.css';

import EarthIcon from '@/assets/svgIcon/Earth'
import MoonIcon from '@/assets/svgIcon/Moon'
import SunIcon from '@/assets/svgIcon/Sun'

export default function MainLayout() {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  const dispatch = useDispatch();

  const currentLang = useSelector((state: RootState) => state.language.currentLanguage);
  const currentTheme = useSelector((state: RootState) => state.views.theme);

  // 檢測屏幕尺寸
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // 手機版默認關閉側邊欄
      if (mobile) {
        setOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const toggleTheme = () =>
    dispatch(setTheme(currentTheme === 'dark' ? 'light' : 'dark'));
  
  const toggleLanguage = () => {
    const newLang = currentLang === 'zh' ? 'en' : 'zh';
    dispatch(setLanguage(newLang));
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleOverlayClick = () => {
    // 手機版點擊遮罩關閉側邊欄
    if (isMobile && open) {
      setOpen(false);
    }
  };

  return (
    <div className={`${layoutStyles.layout} ${isMobile && open ? layoutStyles.drawerOpen : ''}`}>
      <div className={layoutStyles.headerWrapper}>
        <button className={layoutStyles.drawerButton} onClick={handleDrawerToggle}>
          ≡
        </button>
      </div>
      
      {/* 手機版背景遮罩 */}
      {isMobile && open && (
        <div 
          className={layoutStyles.overlay} 
          onClick={handleOverlayClick}
        />
      )}
      
      <aside className={`${layoutStyles.drawerWapperOpen} ${!open ? layoutStyles.drawerWapperClosed : ''}`}>
        <div 
          className={`${open ? layoutStyles.drawerContent : layoutStyles.drawerHide}`}
        > 
          <NavPanel/>
          <div className={layoutStyles.drawerBottom}>
            <button onClick={toggleLanguage} className={layoutStyles.nonStyleButton} title="切換語言">
              <EarthIcon/>
            </button>
            <button onClick={toggleTheme} className={layoutStyles.nonStyleButton} title="切換主題">
              {currentTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </aside>

      {/* 電腦版佔位符 */}
      {!isMobile && (
        <div className={`${layoutStyles.placeHolder} ${!open ? layoutStyles.placeHolderClosed : ''}`}></div>
      )}
      
      {/* 主要內容 */}
      <main className={layoutStyles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}