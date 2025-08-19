import { useState } from 'react';
import style from './css/page.module.css'
import rootTheme from './css/root.module.css'

import HamburgerBtn from './components/HamburgerBtn'
import MenuOverlay from './components/MenuOverlay'

export default function BrandPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMenuVisible, setIsMenuVisible] = useState(false); // 控制元件是否存在
    const [isClosing, setIsClosing] = useState(false); // 控制是否正在關閉

    const handleMenuOpen = () => {
        setIsMenuVisible(true);
        setIsMenuOpen(true);
        setIsClosing(false);
    };

    const handleMenuClose = () => {
        setIsClosing(true);
        setIsMenuOpen(false);
        setTimeout(() => {
            setIsMenuVisible(false);
            setIsClosing(false);
        }, 450);
    };

    const handleMenuToggle = (isOpen: boolean) => {
        if (isOpen) {
            handleMenuOpen();
        } else {
            handleMenuClose();
        }
    };

    return (
        <div className={rootTheme.root}>
            <main>
                <HamburgerBtn 
                    className={style.hamburgerPosition} 
                    onClick={handleMenuToggle}
                    isOpen={isMenuOpen}
                />
                {isMenuVisible && (
                    <MenuOverlay 
                        isOpen={isMenuOpen}
                        isClosing={isClosing}
                        onClose={handleMenuClose}
                    />
                )}
                <section className={style.s1}>
                </section>
                <section className={style.brandingQuotes}>
                    <div>Quiet confidence in every detail</div>
                </section>
                <section className={style.award}>
                    <div>Quiet confidence in every detail</div>
                </section>
            </main>
            <footer>
                
            </footer>
        </div>
    )
}