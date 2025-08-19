import { useState } from 'react';
import style from './css/page.module.css'
import rootTheme from './css/root.module.css'

import HamburgerBtn from './components/HamburgerBtn'
import MenuOverlay from './components/MenuOverlay'

export default function BrandPage() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuToggle = (isOpen: boolean) => {
        setIsMenuOpen(isOpen);
    };

    return (
        <div className={rootTheme.root}>
            <main>
                <HamburgerBtn className={style.hamburgerPosition} onClick={handleMenuToggle}></HamburgerBtn>
                {isMenuOpen && (
                    <MenuOverlay onClose={() => setIsMenuOpen(false)} />
                )}
                <section className={style.s1}>
                    
                </section>
                <section className={style.s2}>ttt</section>
                
            </main>
        </div>
    )
}