import React, { useEffect, useState, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import axiosInstance from './Axios';
import { fadeIn } from './variants';
import './App.css';
import './index.css';
import './component/header/header.css';

// Images
import Mostafa from './assets/images/section/mostafa_noback0.png';
import Mostafa2 from './assets/images/section/mostafa2.jpg';
import Text_background from './assets/images/section/text-background.png';
import Clock_img from './assets/images/section/clock.png';
import Loop_img from './assets/images/section/loop.png';
import Quiz_img from './assets/images/section/quiz.png';

// Components
import Panner from './component/Panner/Panner';
import Waves from './component/inherit/Waves';
import RedMainBtn from './component/inherit/MainBtn';
import Title from './component/title/Title';
import { NoteBox2 } from './component/inherit/Note-Box2';
import Card1 from './component/cards/Card1';
import LoadingGradient from './component/loading/Loading2';
import ReloadBtn1 from './component/inherit/ReloadBtn1';

// SVG Paths data
const fingerprintPaths = [
  {d: 'M 80 100 Q 120 70 175 100 Q 230 130 270 100 Q 320 80 260 160 Q 210 230 175 180 Q 140 130 100 180 Q 60 230 110 160 Q 160 80 80 100 Z'},
  {d: 'M 95 120 Q 140 90 175 120 Q 220 150 255 120 Q 300 100 250 170 Q 200 230 175 200 Q 150 170 120 200 Q 80 230 130 170 Q 180 100 95 120 Z'},
  {d: 'M 110 140 Q 160 110 175 140 Q 210 170 240 140 Q 280 120 240 180 Q 200 230 175 215 Q 150 200 140 215 Q 110 230 150 180 Q 190 120 110 140 Z'},
  {d: 'M 125 160 Q 180 130 175 160 Q 200 190 225 160 Q 260 140 230 190 Q 200 230 175 225 Q 150 220 160 225 Q 130 230 170 190 Q 210 140 125 160 Z'},
  {d: 'M 140 180 Q 200 150 175 180 Q 190 210 210 180 Q 240 160 220 200 Q 200 230 175 235 Q 150 240 180 200 Q 210 160 140 180 Z'},
  {d: 'M 155 200 Q 220 170 175 200 Q 180 230 195 200 Q 220 180 210 210 Q 200 230 175 245 Q 150 260 190 210 Q 230 180 155 200 Z'},
  {d: 'M 170 220 Q 240 190 175 220 Q 170 250 180 220 Q 200 200 200 220 Q 200 230 175 255 Q 150 280 200 220 Q 250 200 170 220 Z'},
  {d: 'M 185 240 Q 260 210 175 240 Q 160 270 165 240 Q 180 220 190 240 Q 200 250 175 265 Q 150 280 210 240 Q 270 220 185 240 Z'},
  {d: 'M 200 260 Q 280 230 175 260 Q 150 290 155 260 Q 170 240 180 260 Q 200 270 175 275 Q 150 280 220 260 Q 290 240 200 260 Z'},
  {d: 'M 215 280 Q 300 250 175 280 Q 140 320 145 280 Q 160 260 170 280 Q 200 290 175 295 Q 150 300 230 280 Q 310 260 215 280 Z'}
];

function Home({ dataAuth }) {
  const [scrollY, setScrollY] = useState(0);
  const [grades, setGrades] = useState({
    loading: false,
    catch: { error: false, message: '' },
    grades: null
  });

  const handleScroll = useCallback(() => setScrollY(window.scrollY), []);

  useEffect(() => {
    getGrades();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const getGrades = useCallback(() => {
    setGrades(prev => ({
      ...prev,
      loading: true,
      catch: { error: false, message: '' },
      grades: null
    }));
    
    axiosInstance.get('/grades')
      .then((response) => {
        setGrades({
          loading: false,
          catch: { error: false, message: '' },
          grades: response.data
        });
      })
      .catch((err) => {
        setGrades({
          loading: false,
          catch: { error: true, message: 'لقد حدث خطأ ما حاول في وقت لاحق...!' },
          grades: null
        });
      });
  }, []);

  const renderGrades = () => {
    if (grades.loading) return <LoadingGradient />;
    if (grades.catch.error) return (
      <div className='d-flex justify-content-center align-items-center' style={{ minHeight: '35vh' }}>
        <div dir='rtl' className="w-100 h-100 d-flex justify-content-center align-items-center">
          <h3 className="text-danger d-flex flex-column gap-3">
            {grades.catch.message}
            <ReloadBtn1 onclick={getGrades} title='اعادة التحميل' />
          </h3>
        </div>
      </div>
    );
    if (!grades.grades) return (
      <div className='d-flex justify-content-center align-items-center' style={{ minHeight: '35vh' }}>
        <div dir='rtl' className="w-100 h-100 d-flex justify-content-center align-items-center">
          <h3 className="text-danger d-flex flex-column gap-3">
            لم يتم إدراج اي صفوف دراسية حتي الأن...!
            <ReloadBtn1 onclick={getGrades} title='اعادة التحميل' />
          </h3>
        </div>
      </div>
    );

    return (
      <div className='cards row'>
        {grades.grades.map((grade, i) => (
          <motion.div
            variants={fadeIn("scale_up", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: true, amount: 0.7 }}
            key={grade.id}
            className='col-lg-4 mb-5'
          >
            <Card1 id={grade.id} title={grade.name} description={grade.description} />
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>منصة مستر مصطفي حمدي - الصفحة الرئيسية</title>
        <meta name="description" content="تعلم الرياضيات بأسلوب مبسط مع الباشمهندس مصطفى حمدي. شرح منهج الرياضيات الثانوية العامة بالكامل." />
      </Helmet>
      
      <div className='main-background' />
      
      <section className='main-sec d-flex justify-content-center align-items-center'>
        <motion.div
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.7 }}
          className="container content row d-flex align-items-center flex-row-reverse"
          dir="rtl"
          style={{ position: 'relative', zIndex: 2 }}
        >
          <div className="col-lg-5 image-collection col-md-12 d-flex justify-content-end align-items-center mb-4 mb-lg-0 position-relative main-sec-img-wrap">
            <div className="main-img-container position-relative d-flex align-items-center justify-content-center" style={{ minWidth: '350px', minHeight: '350px' }}>
              <img
                src={Mostafa}
                alt="مصطفى حمدي"
                className="img-fluid"
                style={{
                  width: '350px',
                  height: '350px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  zIndex: 2
                }}
                loading="lazy"
              />
              <span className="img-anim-bg">
                <span className="animated-lines-bg">
                  <svg viewBox="0 0 350 350">
                    <path
                      className="fingerprint-base-shape"
                      d="M 85 250 Q 110 320 175 320 Q 240 320 265 250 Q 275 230 260 260 Q 245 290 175 290 Q 105 290 90 260 Q 75 230 85 250 Z"
                      fill="#e5395b"
                      opacity="0.85"
                    />
                    <path
                      className="fingerprint-base-shape"
                      d="M 105 270 Q 130 305 175 305 Q 220 305 245 270 Q 255 255 240 275 Q 225 295 175 295 Q 125 295 110 275 Q 95 255 105 270 Z"
                      fill="#e5395b"
                      opacity="0.85"
                    />
                    <path
                      className="fingerprint-base-shape"
                      d="M 120 290 Q 145 315 175 310 Q 205 315 230 290 Q 240 280 225 295 Q 210 310 175 305 Q 140 310 125 295 Q 110 280 120 290 Z"
                      cx="250"
                      cy="370"
                      rx="48"
                      ry="28"
                      fill="#e5395b"
                      opacity="0.8"
                      style={{transform: 'rotate(10deg)'}}
                    />
                    <ellipse cx="80" cy="100" rx="38" ry="22" fill="#e5395b" opacity="0.7"/>
                    {fingerprintPaths.map((line, i) => {
                      const colorClass = i % 2 === 0 ? 'fp-red' : 'fp-cyan';
                      const delayClass = `delay${i}`;
                      return (
                        <path
                          key={i}
                          className={`fingerprint-line ${colorClass} ${delayClass}`}
                          d={line.d}
                        />
                      );
                    })}
                  </svg>
                </span>
              </span>
            </div>
          </div>
          
          <div className="col-lg-7 text-collection p-0 col-md-12 d-flex flex-column align-items-start justify-content-center text-end" style={{zIndex:2}}>
            <p className="fw-bold title-ext" style={{fontSize:'2em',fontFamily:'Droid Arabic Kufi, serif'}}>مهندس</p>
            <h1 className="main-title fw-bold mb-2" style={{fontSize:'2.3em',color:'var(--text-cyan-700)',fontFamily:'Droid Arabic Kufi, serif'}}>مصطفي حمدي</h1>
            <h5 className="main-desc mb-5" style={{fontSize:'1.6rem',color:'var(--color-default-50)',fontWeight:'700'}}>منصة متخصصة لشرح منهج الرياضيات للثانوية العامة</h5>
            <div className='actions mt-5 d-flex gap-3'>
              {dataAuth.isAuthenticated !== true ? 
                <>
                  <RedMainBtn to='/register' name='إشترك الأن !' />
                  <a href='#courses' className='flat-btn d-flex gap-1 align-items-center' dir='rtl'>
                    <span style={{ color: 'var(--color-default2)' }}>الصفوف </span>
                    <span style={{ color: 'var(--red-light)' }}>الدراسية</span>
                  </a>
                </> : 
                <RedMainBtn href='#courses' name='الكورسات !' />
              }
            </div>
          </div>
        </motion.div>
      </section>
      
      <section className='sec2 d-flex justify-content-center align-items-center'>
        <Waves color={['var(--red-light000)', 'var(--red-light00)', 'var(--red-light0)', 'var(--red-light)']} />
        <Container className='p-0 d-flex justify-content-center align-items-center'>
          <Panner 
            img={Mostafa2} 
            dir='rtl' 
            paragraph='منصة مصطفي حمدي' 
            h31='لشرح منهج الرياضيات' 
            h32='للمرحلة الثانوية' 
            color={{ color1: 'var(--color-white)', color2: 'var(--text-cyan-500)' }} 
          />
        </Container>
      </section>

      <section className='sec3'>
        <div className='container'>
          <div className='row justify-content-center'>
            <NoteBox2 direction="right" once={true} img={Quiz_img} bgColor='var(--text-cyan-700)' col='col-lg-4' name='احضر امتحانات دورية ومستمرة' />
            <NoteBox2 direction="scale_up" once={true} img={Loop_img} bgColor='var(--red-light)' col='col-lg-4' name='شاهد دروسك اكتر من مرة' />
            <NoteBox2 direction="left" once={true} img={Clock_img} bgColor='var(--text-cyan-500)' col='col-lg-4' name='وفر وقت المواصلات والسنتر' />
          </div>
        </div>
      </section>
      
      <section className='sec4' id='courses'>
        <Title 
          colors={['var(--wave-default4)', 'var(--wave-default3)', 'var(--wave-default2)', 'var(--wave-default1)']} 
          bgColor='var(--red-gradient)' 
          title='الصفوف الدراسية' 
        />
        <Container className='d-flex justify-content-center align-items-center'>
          {renderGrades()}
        </Container>
      </section>
    </>
  );
}

export default React.memo(Home);
