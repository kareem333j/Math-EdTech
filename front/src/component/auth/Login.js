import "./auth.css";
import mathLogin from "../../assets/images/math-login.jpg";
import { PiMathOperationsFill } from "react-icons/pi";
import { FaPhone } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../Axios";
import LinearIndeterminate from "../loading/loading1";
import { AlertSuccess } from "../errors/AlertSuccess";
import FieldError from "../errors/Field_error";
import { ExistBefore } from "../errors/auth/ExistBefore";
import { useLocation } from 'react-router-dom';
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";

function Login(props) {
  const dataAuth = props.dataAuth;
  const navigate = useNavigate();
  let location = useLocation();
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [badReq, setBadReq] = useState(false);

  useEffect(() => {
    Swal.fire({
      icon: "info",
      title: "إرشادات تسجيل الدخول",
      html: `
        <ul style="text-align: right; direction: rtl; font-size: 1rem; line-height: 1.8;">
          <li>✅ يجب أن يكون لديك حساب على المنصة.</li>
          <li>📱 استخدم <b>رقم الهاتف</b> الذي أنشأت به الحساب (رقمك الشخصي، وليس رقم ولي الأمر).</li>
          <li>🔑 إذا نسيت كلمة المرور، تواصل مع <b>الدعم الفني</b> لإعطائك كلمة مرور جديدة.</li>
          <li>⏳ مدة جلسة تسجيل الدخول هي <b>20 يومًا</b> فقط. بعد انتهاء المدة سيتم تسجيل خروجك تلقائيًا.</li>
          <li>🚫 عند انتهاء الجلسة لا تقم بإنشاء حساب جديد، فقط قم بتسجيل الدخول بنفس الحساب وستجد جميع كورساتك كما هي.</li>
        </ul>
      `,
      confirmButtonText: "تمام ✅",
      confirmButtonColor: "#3085d6",
    });
  }, []);

  const handelChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    })
  }

  const alert = (dataAlert) => {
    AlertSuccess(dataAlert);
  }

  const badRequest = () => {
    if (badReq) {
      return <FieldError msg={badReq.message || "رقم الهاتف أو كلمة السر غير صحيح"} />;
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosInstance
      .post(`token/`, {
        phone: formData.phone,
        password: formData.password,
      })
      .then((res) => {
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        axiosInstance.defaults.headers['Authorization'] = 'JWT ' + localStorage.getItem('access_token');
        if (location.state != null) {
          window.location.href = `${window.location.origin}${location.state.next}`;
        } else {
          window.location.href = '/';
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          if (err.response.status === 400 || err.response.status === 401) {
            setBadReq(true); // عرض رسالة الخطأ
          } else {
            alert({
              action: () => {
                console.log("error login");
              },
              btn: "ok",
              icon: "error",
              title: "خطأ",
              text: "لقد حدث خطأ حاول في وقت لاحق وإذا لم تحل المشكلة قم بالتواصل مع الدعم",
            });
          }
        } else {
          alert({
            action: () => {
              console.log('error login');
            },
            btn: 'ok',
            icon: 'error',
            title: 'خطأ',
            text: 'لقد حدث خطأ حاول في وقت لاحق واذا لم تحل المشكلة قم بالتواصل مع الدعم'
          });
        }
      }).finally(() => {
        setLoading(false);
      });
  }

  // const badRequest = () => {
  //   var err = (badReq === true) ? <FieldError msg='رقم الهاتف او كلمة السر غير صحيح' /> : <></>;
  //   const errTimer = setTimeout(() => {
  //     setBadReq(false);
  //     clearTimeout(errTimer);
  //   }, 10000);
  //   return err
  // };
  if (dataAuth.isAuthenticated === true) {
    return (
      <ExistBefore
        title='تحذير'
        message='
        انت قيد تسجيل الدخول بالفعل اذا كنت تريد تسجيل الدخول بحساب آخر عليك بتسجيل الخروج اولا 
        '
        actions={
          {
            'btn1': { 'name': 'الرئيسية', 'to': '/', 'bgColor': 'var(--title-background)', 'color': '#fff' },
            'btn2': { 'name': 'تسجيل الخروج', 'to': '/logout', 'bgColor': 'var(--red1)', 'color': '#fff' },
          }
        } />
    )
  } else {
    return (
      <>
        <LinearIndeterminate load={loading} />
        <Helmet>
          <title> منصة مستر مصطفي حمدي - تسجيل الدخول</title>
          <meta name="description" content="تسجيل الدخول الي حسابك علي منصة مستر مصطفي حمدي" />
        </Helmet>
        <div className="auth">
          <div className="image-container">
            <img src={mathLogin} alt="auth login" className="auth-img" />
          </div>
          <div className="auth-container">
            <div className="auth-content">
              <h3 className="auth-title">
                تسجيل <span>الدخول:</span>
                <PiMathOperationsFill className="auth-icon" />
              </h3>
              <p className="auth-description">
                ادخل علي حسابك بإدخال رقم الهاتف و كلمة المرور المسجل بهم من قبل
              </p>
              {badRequest()}
              <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                <div className="input">
                  <input
                    type="text"
                    name="phone"
                    placeholder="رقم الهاتف"
                    required
                    value={formData.phone}
                    pattern="^01([0-2]|5)\d{8}$"
                    onChange={handelChange}
                  />
                  <div className="input-bg"></div>
                  <FaPhone className="input-icon" />
                </div>
                <div className="input">
                  <input
                    type="password"
                    name="password"
                    placeholder="كلمة السر"
                    required
                    value={formData.password}
                    onChange={handelChange}
                  />
                  <div className="input-bg"></div>
                  <RiLockPasswordFill className="input-icon" />
                </div>
                {/* <div className="input my-0">
                  <Link to="/forgot-password" className="forgot-password">
                    نسيت كلمة المرور ؟ 
                  </Link>
                </div> */}
                <button className="auth-btn" onClick={handleSubmit}>تسجيل الدخول</button>
              </form>
              <p className="go-register">
                لا يوجد لديك حساب؟{" "}
                <Link to="/register">
                  <span>انشئ حسابك الآن!</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Login;

