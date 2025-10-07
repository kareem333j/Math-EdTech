import "./auth.css";
import { TbMath } from "react-icons/tb";
import { FaPhone } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { LiaUserEditSolid } from "react-icons/lia";
import { MdAlternateEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import mathLogin from "../../assets/images/math-login.jpg";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../Axios";
import FieldError from "../errors/Field_error";
import { AlertSuccess } from "../errors/AlertSuccess";
import LinearIndeterminate from "../loading/loading1";
import { ExistBefore } from "../errors/auth/ExistBefore";
import { Helmet } from "react-helmet";
import { Alert } from "@mui/material";
import Swal from "sweetalert2";


const errorMsgs = {
  required: "يجب ملئ هذا الحقل",
  name_3char: "يجب ان يكون الأسم علي الأقم 3 احرف",
  phone_11num: "رقم هاتف غير صحيح",
  phonesMatch: "يجب ان يكون هاتف ولي الأمر مختلف عن الأبن",
  invalid: "هذا الحقل غير صحيح",
  emailUsed: 'هذا البريد مستخدم من قبل',
  phoneUsed: 'هذا الهاتف مستخدم من قبل',
  passwordShort: 'كلمة السر يجب ان تكون 8 احرف علي الأقل',
  password_confirmation: 'كلمة السر غير متشابهة',
  password_must: 'كلمة السر يجب ان تحتوي علي حرف واحد او رمز واحد علي الأقل',
}

function Register({ dataAuth }) {
  let navigate = useNavigate();
  let phoneNumRegex = useRef();
  let parentPhoneNumRegex = useRef();

  useEffect(() => {
    Swal.fire({
      icon: "info",
      title: "إرشادات إنشاء الحساب",
      html: `
        <ul style="text-align: right; direction: rtl; font-size: 1rem; line-height: 1.8;">
          <li> 📝 الاسم الأول لا يقل عن <b>3 أحرف</b></li>
          <li> 📝 الاسم الأخير لا يقل عن <b>3 أحرف</b></li>
          <li> 📧 البريد الإلكتروني يجب أن يكون صحيح (مثال: <b>example@gmail.com</b>)</li>
          <li> 📱 رقم الهاتف صحيح (11 رقم) وغير مسجل من قبل</li>
          <li> 👨‍👩‍👦 رقم هاتف ولي الأمر صحيح ومختلف عن رقم الطالب</li>
          <li> 🔑 كلمة المرور لا تقل عن <b>8 أحرف</b> وتحتوي على <b>حرف أو رمز</b> على الأقل</li>
        </ul>
      `,
      confirmButtonText: "فهمت ✅",
      confirmButtonColor: "#3085d6",
    });
  }, []);

  const governorate = [
    { name: "الإسكندرية", value: "الإسكندرية" },
    { name: "الإسماعيلية", value: "الإسماعيلية" },
    { name: "كفر الشيخ", value: "كفر الشيخ" },
    { name: "أسوان", value: "أسوان" },
    { name: "أسيوط", value: "أسيوط" },
    { name: "الأقصر", value: "الأقصر" },
    { name: "الوادي الجديد", value: "الوادي الجديد" },
    { name: "شمال سيناء", value: "شمال سيناء" },
    { name: "البحيرة", value: "البحيرة" },
    { name: "بني سويف", value: "بني سويف" },
    { name: "بورسعيد", value: "بورسعيد" },
    { name: "البحر الأحمر", value: "البحر الأحمر" },
    { name: "الجيزة", value: "الجيزة" },
    { name: "الدقهلية", value: "الدقهلية" },
    { name: "جنوب سيناء", value: "جنوب سيناء" },
    { name: "دمياط", value: "دمياط" },
    { name: "سوهاج", value: "سوهاج" },
    { name: "السويس", value: "السويس" },
    { name: "الشرقية", value: "الشرقية" },
    { name: "الغربية", value: "الغربية" },
    { name: "الفيوم", value: "الفيوم" },
    { name: "القاهرة", value: "القاهرة" },
    { name: "القليوبية", value: "القليوبية" },
    { name: "قنا", value: "قنا" },
    { name: "مطروح", value: "مطروح" },
    { name: "المنوفية", value: "المنوفية" },
    { name: "المنيا", value: "المنيا" }
  ];

  const fromInputs = {
    first_name: { value: "", catch: { error: true, msg: errorMsgs.required } },
    last_name: { value: "", catch: { error: true, msg: errorMsgs.required } },
    phone: { value: "", catch: { error: true, msg: errorMsgs.required } },
    parent_phone: { value: "", catch: { error: true, msg: errorMsgs.required } },
    state: { value: governorate[0].value, catch: { error: false, msg: errorMsgs.required } },
    grade: { value: "الصف الأول الثانوي", catch: { error: false, msg: errorMsgs.required } },
    gender: { value: "ذكر", catch: { error: false, msg: errorMsgs.required } },
    email: { value: "", catch: { error: true, msg: errorMsgs.required } },
    // username: { value: "", catch: { error: true, msg: errorMsgs.required } },
    password: { value: "", catch: { error: true, msg: errorMsgs.required } },
    password_confirmation: { value: "", catch: { error: true, msg: errorMsgs.required } },
  }
  const fromInputsErr = {
    first_name: { value: "", catch: { error: false, msg: errorMsgs.required } },
    last_name: { value: "", catch: { error: false, msg: errorMsgs.required } },
    phone: { value: "", catch: { error: false, msg: errorMsgs.required } },
    parent_phone: { value: "", catch: { error: false, msg: errorMsgs.required } },
    state: { value: "", catch: { error: false, msg: errorMsgs.required } },
    grade: { value: "", catch: { error: false, msg: errorMsgs.required } },
    gender: { value: "", catch: { error: false, msg: errorMsgs.required } },
    email: { value: "", catch: { error: false, msg: errorMsgs.required } },
    // username: { value: "", catch: { error: false, msg: errorMsgs.required } },
    password: { value: "", catch: { error: false, msg: errorMsgs.required } },
    password_confirmation: { value: "", catch: { error: false, msg: errorMsgs.required } },
  }
  const initialFormData = Object.freeze(fromInputs);
  const [formData, setFormData] = useState(initialFormData);
  const [inputsError, setInputsError] = useState(fromInputsErr);
  const [formValidation, setFormValidation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phones, setPhones] = useState({
    user: formData.phone,
    parent: formData.parent_phone,
  });

  const handelErrors = (value, name) => {
    // required errors
    if (value === "") {
      return {
        value: value, catch: { error: true, msg: errorMsgs.required }
      }
    }
    // name errors
    else if (name === 'first_name' || name === 'last_name') {
      if (value.length < 3) {
        return {
          value: value, catch: { error: true, msg: errorMsgs.name_3char }
        }
      }
      return {
        value: value, catch: { error: false, msg: errorMsgs.name_3char }
      }
    }
    // phone numbers errors
    else if (name === 'phone' || name === 'parent_phone') {
      setPhones({
        ...phones,

        [name]: value,
      })
      if (value.length === 11) {
        return {
          value: value, catch: { error: false, msg: "valid" }
        }
      }
      return {
        value: value, catch: { error: true, msg: errorMsgs.phone_11num }
      }
    }
    else if (name === 'email') {
      // let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let emailRegex2 = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      ;
      if (!emailRegex2.test(value)) {
        return {
          value: value,
          catch: { error: true, msg: errorMsgs.invalid }
        }
      }
      return {
        value: value,
        catch: { error: false, msg: "valid" }
      }
    }
    else {
      return {
        value: value, catch: { error: false, msg: "valid" }
      }
    }
  };

  const handelPhoneErrors = () => {
    let phoneRegEx = /^01([0-2]|5){1}\d{8}$/;

    if (formData.phone.value.length !== 11) {
      inputsError.phone.catch = { error: true, msg: errorMsgs.phone_11num }
    }
    else if (formData.parent_phone.value.length !== 11) {
      inputsError.parent_phone.catch = { error: true, msg: errorMsgs.phone_11num }
    }
    else if (formData.parent_phone.value === formData.phone.value) {
      formData.phone.catch = { error: true, msg: errorMsgs.phonesMatch }
      formData.parent_phone.catch = { error: true, msg: errorMsgs.phonesMatch }
      inputsError.phone.catch = { error: true, msg: errorMsgs.phonesMatch }
      inputsError.parent_phone.catch = { error: true, msg: errorMsgs.phonesMatch }
    }
    else {
      formData.phone.catch = { error: false, msg: '' }
      formData.parent_phone.catch = { error: false, msg: '' }
      inputsError.phone.catch = { error: false, msg: '' }
      inputsError.parent_phone.catch = { error: false, msg: '' }
    }
    if (phoneRegEx.test(phoneNumRegex.current.value) === false) {
      formData.phone.catch = { error: true, msg: errorMsgs.phone_11num }
      inputsError.phone.catch = { error: true, msg: errorMsgs.phone_11num }
    }
    if (phoneRegEx.test(parentPhoneNumRegex.current.value) === false) {
      formData.parent_phone.catch = { error: true, msg: errorMsgs.phone_11num }
      inputsError.parent_phone.catch = { error: true, msg: errorMsgs.phone_11num }
    }
  }

  const putFailedError = (name, err) => {
    formData[name].catch = { error: true, msg: err }
    inputsError[name].catch = { error: true, msg: err }
  }

  const catchFieldError = (dataError) => {
    if (dataError.email) {
      if (dataError.email[0] === "new user with this email already exists.") {
        putFailedError('email', errorMsgs.emailUsed);
      }
    }
    if (dataError.phone) {
      if (dataError.phone[0] === "new user with this phone number already exists.") {
        putFailedError('phone', errorMsgs.phoneUsed);
      }
    }
    if (dataError.profile) {
      if (dataError.profile.parent_phone) {
        if (dataError.profile.parent_phone[0] === "profile with this parent number already exists.") {
          putFailedError('parent_phone', errorMsgs.phoneUsed);
        }
      }
    }

    if (dataError.password) {
      if (dataError.password[0] === "This password is too short. It must contain at least 8 characters.") {
        putFailedError('password', errorMsgs.passwordShort);
      }
      if (dataError.password[0] === "Password fields didn't match.") {
        putFailedError('password', errorMsgs.password_confirmation);
        putFailedError('password_confirmation', errorMsgs.password_confirmation);
      }
      if (dataError.password[0] === "This password is too common." || dataError.password[0] === "This password is entirely numeric.") {
        putFailedError('password', errorMsgs.password_must);
      }
    }
    if (dataError.password2) {
      if (dataError.password2[0] === "This password is too short. It must contain at least 8 characters.") {
        putFailedError('password_confirmation', errorMsgs.passwordShort);
      }
    }
  }

  const handelChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: handelErrors(e.target.value, e.target.name),
    });
    setInputsError({
      ...inputsError,

      [e.target.name]: handelErrors(e.target.value, e.target.name),
    });
  }


  const handleSubmit = (e) => {
    e.preventDefault();

    setInputsError(formData);
    for (let key in inputsError) {
      if (inputsError[key].catch.error === true) {
        setFormValidation(false);
        break;
      } else {
        setFormValidation(true);
      }
    }

    handelPhoneErrors();
    if (formValidation === true) {
      setLoading(true);
      axiosInstance
        .post(`user/register/`, {
          phone: formData.phone.value,
          first_name: formData.first_name.value,
          last_name: formData.last_name.value,
          profile: {
            parent_phone: formData.parent_phone.value,
            state: formData.state.value,
            gender: formData.gender.value,
            grade: formData.grade.value
          },
          email: formData.email.value,
          // username: formData.username.value,
          password: formData.password.value,
          password2: formData.password_confirmation.value,
        })
        .then((res) => {
          alert({
            action: () => {
              navigate("/login");
            },
            btn: 'تسجيل الدخول',
            icon: 'success',
            title: 'تم انشاء حسابك بنجاح'
          });
        }).catch((err) => {
          setLoading(false);
          if (err.response) {
            console.log(err);
            if (err.response.status === 400) {
              catchFieldError(err.response.data);
              alert({
                action: () => {
                  console.log('error register');
                },
                btn: 'فهمت ذالك',
                icon: 'error',
                title: 'خطأ',
                text: 'لقد حدث خطأ يرجي مراجعة بياناتك مرة اخري..'
              });
            };
          }
          else {
            alert({
              action: () => {
                console.log('error register');
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
    };

  };

  const alert = (dataAlert) => {
    AlertSuccess(dataAlert);
  }

  const fieldErrorAlert = (inputName) => {
    return (inputsError[inputName].catch.error === true) ? <FieldError msg={inputsError[inputName].catch.msg} /> : <></>
  }

  if (dataAuth.isAuthenticated === true) {
    return (
      <ExistBefore
        title='تحذير'
        message='انت تمتلك حساب بالفعل اذا كنت تريد انشاء حساب آخر عليك بتسجيل الخروج اولا'
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
          <title> منصة مستر مصطفي حمدي - إنشاء حساب جديد</title>
          <meta name="description" content="إنشاء حساب جديد في منصة مستر مصطفي حمدي - إشترك في منصة مصطفي حمدي وابداء التعلم" />
        </Helmet>
        <div className="auth register">
          <div className="image-container">
            <img src={mathLogin} alt="auth login" className="auth-img" />
          </div>
          <div className="auth-container">
            <div className="auth-content">
              <h3 className="auth-title">
                أنشء <span>حسابك الآن :</span>
                <TbMath className="auth-icon" />
              </h3>
              <p className="auth-description">
                ادخل بياناتك بشكل صحيح للحصول علي افضل تجربة داخل الموقع
              </p>
              <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                <div className="multi-inputs">
                  <div>
                    <div className="input">
                      <input
                        type="text"
                        name="first_name"
                        placeholder="الاسم الأول"
                        required
                        value={formData.first_name.value}
                        onChange={handelChange}
                      />
                      <div className="input-bg"></div>
                      <LiaUserEditSolid className="input-icon" />
                    </div>
                    {fieldErrorAlert("first_name")}
                  </div>
                  <div>
                    <div className="input">
                      <input
                        type="text"
                        name="last_name"
                        placeholder="الاسم الأخير"
                        required
                        value={formData.last_name.value}
                        onChange={handelChange}
                      />
                      <div className="input-bg"></div>
                      <LiaUserEditSolid className="input-icon" />
                    </div>
                    {fieldErrorAlert("last_name")}
                  </div>

                </div>
                <div className="multi-inputs">
                  <div>
                    <div className="input">
                      <input
                        type="text"
                        name="phone"
                        placeholder="رقم الهاتف"
                        required
                        value={formData.phone.value}
                        pattern="^01([0-2]|5)\d{8}$"
                        ref={phoneNumRegex}
                        onChange={handelChange}
                      />
                      <div className="input-bg"></div>
                      <FaPhone className="input-icon" />
                    </div>
                    {fieldErrorAlert("phone")}
                  </div>
                  <div>
                    <div className="input">
                      <input
                        type="text"
                        name="parent_phone"
                        placeholder="رقم هاتف ولي الأمر"
                        required
                        value={formData.parent_phone.value}
                        pattern="^01([0-2]|5)\d{8}$"
                        ref={parentPhoneNumRegex}
                        onChange={handelChange}
                      />
                      <div className="input-bg"></div>
                      <FaPhone className="input-icon" />
                    </div>
                    {fieldErrorAlert("parent_phone")}
                  </div>

                </div>
                <div>
                  <div className="input">
                    <Form.Select
                      aria-label=" select governorate"
                      name="state"
                      className="governorate-select"
                      value={formData.state.value}
                      onChange={handelChange}>
                      {governorate.map((g) => {
                        return (
                          <option key={g.value} value={g.value}>
                            {g.name}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </div>
                  {fieldErrorAlert("state")}
                </div>

                <div>
                  <div className="input">
                    <Form.Select
                      aria-label=" select grade"
                      name="grade"
                      className="year-select"
                      value={formData.grade.value}
                      onChange={handelChange} >
                      <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
                      <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
                      <option value="الصف الثالث الثانوي" selected>الصف الثالث الثانوي</option>
                    </Form.Select>
                  </div>
                  {fieldErrorAlert("grade")}
                </div>

                <div>
                  <div className="input">
                    <Form.Select
                      aria-label=" select grade"
                      name="gender"
                      value={formData.gender.value}
                      className="year-select"
                      onChange={handelChange}>
                      <option value="ذكر" selected>ذكر</option>
                      <option value="انثي">انثي</option>
                    </Form.Select>
                  </div>
                  {fieldErrorAlert("gender")}
                </div>

                <div>
                  <div className="input">
                    <input
                      type="email"
                      name="email"
                      placeholder="البريد الإلكتروني"
                      required
                      value={formData.email.value}
                      onChange={handelChange}
                    />
                    <div className="input-bg"></div>
                    <MdAlternateEmail className="input-icon" />
                  </div>
                  {fieldErrorAlert("email")}
                </div>

                <div className="multi-inputs">
                  <div>
                    <div className="input">
                      <input
                        type="password"
                        name="password"
                        placeholder="كلمة السر"
                        required
                        value={formData.password.value}
                        onChange={handelChange}
                      />
                      <div className="input-bg"></div>
                      <RiLockPasswordFill className="input-icon" />
                    </div>
                    {fieldErrorAlert("password")}
                  </div>
                  <div>
                    <div className="input">
                      <input
                        type="password"
                        name="password_confirmation"
                        placeholder="تأكيد كلمة السر"
                        required
                        value={formData.password_confirmation.value}
                        onChange={handelChange}
                      />
                      <div className="input-bg"></div>
                      <RiLockPasswordFill className="input-icon" />
                    </div>
                    {fieldErrorAlert("password_confirmation")}
                  </div>

                </div>
                <Alert variant="outlined" severity="warning" sx={{ width: "100%", fontSize: "0.9em", color: "orange", gap: '2px' }}>
                  ملحوظة: يجب ان تكون كلمة السر 8 احرف علي الأقل وتحتوي علي حرف واحد او رمز واحد علي الأقل
                </Alert>
                <button className="btn btn-danger auth-btn" onClick={handleSubmit}>انشئ الحساب !</button>
              </form>
              <p className="go-register">
                يوجد لديك حساب بالفعل؟{" "}
                <Link to="/login">
                  <span>ادخل إلى حسابك الآن !</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Register;

