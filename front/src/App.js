import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import Header from "./component/header/header";
import Home from "./Home";
import Footer from "./component/footer/Footer";
import useLocalStorage from "use-local-storage";
import Courses from "./component/courses/Courses";
import CoursesAdmin from "./component/admin/dashboard/pages/Courses";
import Login from "./component/auth/Login";
import Register from "./component/auth/Register";
import { useContext, useEffect, useState } from "react";
import axiosInstance from "./Axios";
import { jwtDecode } from "jwt-decode";
import Logout from "./component/auth/Logout";
import { AlertSuccess } from "./component/errors/AlertSuccess";
import { Warning } from "./component/errors/Warning";
import CourseContent from "./component/courses/course-content/CourseContent";
import ViewCourse from "./component/courses/course-content/ViewCourse";
import { SubscribePage } from "./component/subscribe/SubscribePage";
import { SnackbarProvider } from "notistack";
import { Main } from "./component/admin/dashboard/Main";
import Payments from "./component/admin/dashboard/pages/Payments";
import Users from "./component/admin/dashboard/pages/Users";
import Add from "./component/admin/dashboard/pages/courses-pages/Add";
import Edit from "./component/admin/dashboard/pages/courses-pages/Edit";
import AddCourseProvider from "./context/AddCourseContext";
import EditCourseProvider from "./context/EditCourseContext";
import CourseMainPageForAdmin from "./component/admin/dashboard/pages/courses-pages/Main";
import CourseDataProvider from "./context/AdminCourseDataContext";
import UserProfile from './component/user/profile/Profile';
import { AdminRoutes, ProfileRoutes } from "./utils/CustomRoutes";
import { AuthContext } from "./context/AuthContext";
import { NotificationPage } from "./notifications/Notification";
import NotificationsAdmin from "./component/admin/dashboard/pages/Notifications";
import NotificationProvider from "./context/NotificationsContext";
import { Loading0 } from "./component/loading/Loading0";
import { $404 as Error404 } from "./component/errors/404";

function App() {
  const [isDark, setIsDark] = useLocalStorage("isDark", true);
  const [dataProfile, setDataProfile] = useState({
    isAuthenticated: false,
    profile: null,
  });

  const [user, setUser] = useState(() =>
    localStorage.getItem("access_token")
      ? jwtDecode(localStorage.getItem("access_token"))
      : null
  );
  const [networkError, setNetworkError] = useState(false);
  const location = useLocation();
  const [loadDataUser, setLoadDataUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const AuthDataContext = useContext(AuthContext);

  // 📌 جلب بيانات المستخدم
  const fetchUserProfile = async () => {
    setLoading(true);

    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setUser(null);
      setLoadDataUser(false);
      setDataProfile({ isAuthenticated: false, profile: null });
      AuthDataContext.setDataProfile({ isAuthenticated: false, profile: null });
      setLoading(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(accessToken);
      setUser(decodedToken);
      setLoadDataUser(true);

      const response = await axiosInstance.get(`profile/${decodedToken.user_id}`);
      setDataProfile({ isAuthenticated: true, profile: response.data });
      AuthDataContext.setDataProfile({ isAuthenticated: true, profile: response.data });
    } catch (error) {
      setLoadDataUser(false);

      if (error.response && error.response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        setDataProfile({ isAuthenticated: false, profile: null });
        AuthDataContext.setDataProfile({ isAuthenticated: false, profile: null });
        window.location.href = "/login";
        return;
      }

      alert({
        action: () => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.reload();
        },
        btn: "ok",
        icon: "error",
        position: "center-center",
        reload: true,
        title: "خطأ",
        text: "لقد حدث خطأ ما تأكد من اتصالك بالإنترنت ثم قم بإعادة تحميل الصفحة مرة اخري",
      });
      setNetworkError(true);
    } finally {
      setLoading(false);
    }
  };

  // 📌 عند تحميل التطبيق
  useEffect(() => {
    fetchUserProfile();

    const handleTokenExpired = () => {
      setUser(null);
      setDataProfile({ isAuthenticated: false, profile: null });
      AuthDataContext.setDataProfile({ isAuthenticated: false, profile: null });
      setLoading(false);
    };

    window.addEventListener("tokenExpired", handleTokenExpired);
    return () => {
      window.removeEventListener("tokenExpired", handleTokenExpired);
    };
  }, []);

  // 📌 تغيير شكل الـ app حسب الصفحة
  useEffect(() => {
    const my_app = document.getElementById("app");
    if (location.pathname === "/") {
      my_app.classList.add("home");
    } else {
      my_app.classList.remove("home");
    }
    window.scrollTo(0, 0);
  }, [location]);

  const alert = (dataAlert) => {
    AlertSuccess(dataAlert);
  };

  return (
    <SnackbarProvider maxSnack={3}>
      <div
        className="app"
        id="app"
        data-theme={isDark ? "dark" : "light"}
      >
        {loading ? <Loading0 /> : null}

        <Header
          isChecked={isDark}
          handelMode={() => setIsDark(!isDark)}
          dataAuth={dataProfile}
          data_theme={isDark}
        />

        {networkError && (
          <Warning
            title="تحذير هام"
            message="هناك خطأ ما قد حدث قد لا يعمل الموقع بشكل سليم تأكد من اتصالك بالإنترنت ثم قم بإعادة تحميل الموقع"
          />
        )}

        <Routes>
          {/* Home route */}
          <Route exact path="/" element={<Home dataAuth={dataProfile} />} />

          {/* course routes */}
          <Route path="/courses/:grade" element={<><Outlet /></>}>
            <Route path="" element={<Courses dataAuth={dataProfile} />} />
            <Route path="/courses/:grade" element={<><Outlet /></>} />
            <Route
              path="course/:course_id"
              element={
                <CourseContent
                  dataAuth={dataProfile}
                  data_theme={isDark ? "dark" : "light"}
                />
              }
            />
            <Route
              path="course/:course_id/view"
              element={<ViewCourse dataAuth={dataProfile} />}
            />
            <Route
              path="course/:course_id/subscribe"
              element={
                <SubscribePage
                  data_theme={isDark ? "dark" : "light"}
                  dataAuth={dataProfile}
                  userLoaded={loadDataUser}
                />
              }
            />
          </Route>

          {/* auth routes */}
          <Route path="/login" element={<Login dataAuth={dataProfile} />} />
          <Route path="/register" element={<Register dataAuth={dataProfile} />} />
          <Route path="/logout" element={<Logout dataAuth={dataProfile} />} />

          {/* admin routes */}
          <Route element={<AdminRoutes />}>
            <Route
              path="/admin/dashboard"
              element={<Main dataAuth={dataProfile} data_theme={isDark} />}
            >
              <Route index element={<CoursesAdmin dataAuth={dataProfile} />} />
              <Route path="courses" element={<><Outlet data_theme={isDark} /></>}>
                <Route
                  path=""
                  element={
                    <CoursesAdmin data_theme={isDark} dataAuth={dataProfile} />
                  }
                />
                <Route
                  path="add"
                  element={
                    <AddCourseProvider>
                      <Add dataAuth={dataProfile} />
                    </AddCourseProvider>
                  }
                />
                <Route path=":course_id" element={<><Outlet /></>}>
                  <Route
                    path=""
                    element={
                      <CourseDataProvider>
                        <CourseMainPageForAdmin
                          data_theme={isDark ? "dark" : "light"}
                          dataAuth={dataProfile}
                        />
                      </CourseDataProvider>
                    }
                  />
                </Route>
                <Route
                  path=":course_id/edit"
                  element={
                    <EditCourseProvider>
                      <Edit dataAuth={dataProfile} />
                    </EditCourseProvider>
                  }
                />
              </Route>
              <Route
                path="payments"
                element={<Payments data_theme={isDark} dataAuth={dataProfile} />}
              />
              <Route path="users" element={<Users data_theme={isDark} dataAuth={dataProfile} />} />
              <Route
                path="notifications"
                element={
                  <NotificationProvider>
                    <NotificationsAdmin
                      data_theme={isDark ? "dark" : "light"}
                      dataAuth={dataProfile}
                    />
                  </NotificationProvider>
                }
              />
            </Route>
          </Route>

          {/* user */}
          <Route element={<ProfileRoutes />}>
            <Route
              path="/user/:user_id/profile"
              element={<UserProfile dataAuth={dataProfile} />}
            />
          </Route>

          {/* notifications */}
          <Route
            path="/notifications/:notification_id"
            element={<NotificationPage dataAuth={dataProfile} />}
          />

          {/* not found */}
          <Route
            path="*"
            element={<Error404 message="هذه الصفحة غير موجودة" />}
          />
        </Routes>
        <Footer />
      </div>
    </SnackbarProvider>
  );
}

export default App;

