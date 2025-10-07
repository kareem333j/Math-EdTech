import React, { useEffect, useState } from 'react';
import './footer.css';
import { Container } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import background_image from '../../assets/images/background.png';

const Footer = () => {
  const location = useLocation();
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(()=>{
    setIsAdminUser(false);
    if(location.pathname.substring(1,6) === 'admin'){
      setIsAdminUser(true);
    }
  }, [location]);
  return (
    <footer className={`d-flex justify-content-center align-items-center ${isAdminUser?'d-none':''}`}>
      <Container className='d-flex justify-content-center align-items-center flex-column'>
        <div className='social-media-icons d-flex justify-content-center align-items-center'>
          <a href='https://www.facebook.com/mostafa.hamdy.652000?mibextid=wwXIfr&mibextid=wwXIfr' target='blank' style={{'backgroundColor':'blue'}} className='icon'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill='#fff' d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z" /></svg>
          </a>
          <a href='https://youtube.com/@mostafa.hamdy.6565?si=uD3wqqu42tTxot8u' target='blank' style={{'backgroundColor':'red'}} className='icon'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill='#fff' d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z" /></svg>
          </a>
        </div>
        <hr />
        <div className='slogan'>💖 تم صنع هذه المنصة بهدف تهيئة الطالب لـ كامل جوانب الثانوية العامة و ما بعدها
        💖</div>
        <div className='developers d-flex gap-3 mt-3 mb-2'>
          <span className='dev-logo'>&lt; Developed By &gt;</span>
          <span className='names d-flex gap-2'>
            <a href='https://www.facebook.com/karem.magdy1287s.el/' target='blank'>Karim</a>
            <span className='text-white'>,</span>
            <a href='https://www.facebook.com/profile.php?id=100007443429833' target='blank'>Ahmed</a>
          </span>
        </div>
        <h6 className='text-light rights'>All Copy Rights Reserved ©️2025 - 2026</h6>
      </Container>
    </footer>
  )
}

export default Footer;