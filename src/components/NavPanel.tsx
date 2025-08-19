import { NavLink } from 'react-router-dom';
import styles from '@/css/components/NavPanel.module.css';

export default function NavPanel() {
  return (
    <div className={styles.navPanel}>
      <NavLink 
        to="/BrandPage" 
        className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}
      >
        <h2>BrandPage</h2>
      </NavLink>
      
      <NavLink 
        to="/category_1" 
        className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}
      >
        <h2>Test</h2>
      </NavLink>
      
      <NavLink 
        to="/category_2" 
        className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}
      >
        <h2>Contact Me</h2>
      </NavLink>
    </div>
  );
}