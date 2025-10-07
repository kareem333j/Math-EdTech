import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './shared.css';
import { SearchBar } from '../inherit/SearchBar';
import axiosInstance from '../../../../Axios';
import { useEffect, useState } from 'react';
import LoadingGradient from '../../../loading/Loading2';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { enqueueSnackbar } from 'notistack';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import HttpsIcon from '@mui/icons-material/Https';
import { Link } from 'react-router-dom';
import LinearIndeterminate from '../../../loading/loading1';

export default function Users(props) {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [userSearched, setUserSearched] = useState(false);
    const [notHavePermission, setNotHavePermission] = useState({ catch: false, msg: '' });
    const [openGrades, setOpenGrades] = useState({});
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'left',
    });
    const { vertical, horizontal } = state;

    const handleClickVariant = (variant, msg) => {
        enqueueSnackbar(msg, { variant: variant, anchorOrigin: { vertical, horizontal } });
    };

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = () => {
        setLoading(true);
        axiosInstance
            .get('admin/users')
            .then((response) => {
                setLoading(false);
                setUsers(response.data);
                setUserSearched(false);
            })
            .catch((err) => {
                setUserSearched(false);
                setLoading(false);
                if (err.response.status === 403) {
                    setNotHavePermission({ catch: true, msg: err.response.data.detail });
                } else {
                    setNotHavePermission({ catch: false, msg: 'have access' });
                }
            });
    };

    const handleSearchChange = (e) => {
        var text = e.target.value;
        let text_without_spacing = text.replace(/\s+/g, '');
        var value = text;

        if (text_without_spacing === '') {
            value = null;
        }
        setLoading(true);
        axiosInstance
            .get(`admin/users/search/${value}`)
            .then((response) => {
                setLoading(false);
                setUsers(response.data);
                setUserSearched(true);
            })
            .catch((err) => {
                setUserSearched(true);
                setLoading(false);
                if (err.response.status === 403) {
                    setNotHavePermission({ catch: true, msg: err.response.data.detail });
                } else {
                    setNotHavePermission({ catch: false, msg: 'have access' });
                }
            });

        if (value === null || value.length === 0) {
            setUserSearched(false);
            getUsers();
        }
    };

    const deleteUser = (user_id) => {
        setLoading(true);
        axiosInstance
            .delete(`admin/users/${user_id}/delete`)
            .then(() => {
                setLoading(false);
                getUsers();
                handleClickVariant('success', 'تم حذف المستخدم بنجاح');
            })
            .catch((err) => {
                setLoading(false);
                handleClickVariant('error', 'لقد حدث خطأ ');
            });
    };

    const handleDeleteBtn = (user_id) => {
        withReactContent(Swal).fire({
            title: "! حذف ",
            text: "هل انت متأكد من حذف هذا المستخدم",
            icon: "question",
            cancelButtonText: "إلغاء",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "نعم, حذف",
        }).then((response) => {
            if (response.isConfirmed) {
                deleteUser(user_id);
            }
        });
    };

    const groupUsersByGrade = () => {
        const grouped = {
            "المسؤولين": [],
            "المساعدين": [],
            "غير محدد": [],
            "الصف الأول الثانوي": [],
            "الصف الثاني الثانوي": [],
            "الصف الثالث الثانوي": [],
        };

        users.forEach(user => {
            if (!user.userInfo) {
                grouped["غير محدد"].push(user);
                return;
            }

            if (user.userInfo.is_superuser) {
                grouped["المسؤولين"].push(user);
                return;
            }
            if (!user.userInfo.is_superuser && user.userInfo.is_staff) {
                grouped["المساعدين"].push(user);
                return;
            }

            const grade = user.grade || 'غير محدد';
            grouped[grade].push(user);
        });

        // Remove empty groups to avoid rendering empty tables
        return Object.fromEntries(
            Object.entries(grouped).filter(([_, users]) => users.length > 0)
        );
    };

    const toggleGradeTable = (grade) => {
        setOpenGrades(prev => ({
            ...prev,
            [grade]: !prev[grade]
        }));
    };


    // change password
    const [open, setOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [loadingUserEditing, setLoadingUserEditing] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setPassword("");
        setConfirmPassword("");
    };

    const handleSubmitChangePassword = () => {
        setLoadingUserEditing(true);

        if (password !== confirmPassword) {
            setLoadingUserEditing(false);
            alert("كلمة المرور غير متطابقة!");
            return;
        }

        if (password.length < 8) {
            setLoadingUserEditing(false);
            alert("يجب أن تكون كلمة المرور 8 أحرف على الأقل!");
            return;
        }

        axiosInstance
            .post(`user/admin/users/change-password/`, {
                user_id: currentUser,
                new_password: password,
                confirm_password: confirmPassword,
            })
            .then(() => {
                handleClickVariant('success', 'تم تغيير كلمة المرور للمستخدم بنجاح');
            })
            .catch((err) => {
                handleClickVariant('error', "لم يتم تغيير كلمة المرور بنجاح تأكد من صحتها قبل التغيير");
            }).finally(() => {
                setLoadingUserEditing(false);
                handleClose();
            });
    };

    const renderTable = (usersList) => (
        <div className='users-div area-table'>
            <table>
                <thead>
                    <tr>
                        <th className='td-id'>#</th>
                        <th className='head'><span>المستخدم</span></th>
                        <th className='head'><span>رقم الهاتف</span></th>
                        <th className='head'><span>رقم هاتف ولي الأمر</span></th>
                        <th className='head'><span>تاريخ الإنضمام</span></th>
                        <th className='head'><span>الحالة</span></th>
                        <th className='head'><span>البريد الإلكتروني</span></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {usersList.map(user => (
                        <tr key={user.id}>
                            <td style={{ background: user.is_vip ? 'goldenrod' : '' }} className='td-id'>{user.id}</td>
                            <td style={{ background: user.is_vip ? 'goldenrod' : '' }}>
                                <div className='user-main-info d-flex flex-row'>
                                    <div>
                                        <Avatar
                                            className='avatar'
                                            sx={{ p: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                            data-content={user.userInfo.first_name[0]}
                                            alt="User"
                                        />
                                    </div>
                                    <div className='content d-flex flex-column'>
                                        <h3>
                                            {(user.userInfo.first_name + ' ' + user.userInfo.last_name).slice(0, 26)}
                                            {(user.userInfo.first_name + ' ' + user.userInfo.last_name).length > 26 ? '...' : ''}
                                        </h3>
                                        <span>
                                            {user.userInfo.is_superuser ? (
                                                <span className='admin-user'>ادمن</span>
                                            ) : user.userInfo.is_staff ? (
                                                <span className='staff-user'>مساعد</span>
                                            ) : (
                                                <span className='student-user'>طالب</span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td style={{ background: user.is_vip ? 'goldenrod' : '' }}>{user.userInfo.phone || 'لايوجد'}</td>
                            <td style={{ background: user.is_vip ? 'goldenrod' : '' }}>{user.parent_phone || 'لايوجد'}</td>
                            <td style={{ background: user.is_vip ? 'goldenrod' : '' }}>{user.userInfo.data_join}</td>
                            <td style={{ background: user.is_vip ? 'goldenrod' : '' }}>
                                {user.userInfo.is_active ? (
                                    <span className='active'>مفعل</span>
                                ) : (
                                    <span className='not-active'>غير مفعل</span>
                                )}
                            </td>
                            <td style={{ background: user.is_vip ? 'goldenrod' : '' }}>
                                {(user.userInfo.email.length > 26) ? `${user.userInfo.email.slice(0, 26)}...` : user.userInfo.email}
                            </td>
                            <td style={{ background: user.is_vip ? 'goldenrod' : '' }}>
                                <div className='d-flex gap-4 px-3'>
                                    <Tooltip title="إعدادات المستخدم">
                                        <IconButton
                                            size="large"
                                            edge="start"
                                            color="inherit"
                                            aria-label="details"
                                            className='custom-edit-button options-btn'
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <MoreHorizIcon />
                                        </IconButton>
                                    </Tooltip>

                                    <ul className={`dropdown-menu dropdown-menu${(props.data_theme) ? '-dark' : ''}`}>
                                        <li className='dropdown-item p-0'>
                                            <Link to={`/user/${user.user}/profile`} style={{ padding: '0.25rem 1rem', color: 'var(--color-default2)' }} className='d-flex gap-2 align-items-center text-start w-100' >
                                                <EditIcon size="small" sx={{ fontSize: '1.1em' }} />
                                                <span style={{ "cursor": "pointer" }}>تعديل الصلاحيات</span>
                                            </Link>
                                        </li>
                                        <li style={{ "cursor": "pointer", color: 'var(--color-default2)' }} onClick={() => {
                                            handleOpen();
                                            setCurrentUser(user.user);
                                        }} className='dropdown-item d-flex gap-2 align-items-center text-start'>
                                            <HttpsIcon size="small" sx={{ fontSize: '1.1em' }} />
                                            <span>تغيير كلمة المرور</span>
                                        </li>
                                        <li style={{ "cursor": "pointer", color: 'var(--color-default2)' }} onClick={() => handleDeleteBtn(user.user)} className='dropdown-item d-flex gap-2 align-items-center text-start'>
                                            <DeleteIcon size="small" sx={{ fontSize: '1.1em' }} />
                                            <span>حذف المستخدم</span>
                                        </li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* change password dialog */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>تغيير كلمة المرور</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="كلمة المرور الجديدة"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="تأكيد كلمة المرور"
                        type="password"
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>إلغاء</Button>
                    <Button onClick={handleSubmitChangePassword} variant="contained" color="primary">
                        حفظ
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
    return (
        <div className="users">
            <LinearIndeterminate load={loadingUserEditing} />
            <div className='options w-100 admin-search pt-2 px-1 d-flex justify-content-center align-items-center'>
                <SearchBar
                    placeholder="ابحث عن مستخدم..."
                    onChange={handleSearchChange}
                />
            </div>

            {loading ? (
                <LoadingGradient />
            ) : userSearched ? (
                users.length === 0 ? (
                    <div className='text-center' style={{ color: 'var(--text-cyan-700)', fontSize: '1.2em', padding: '20px' }}>
                        لا يوجد مستخدم بهذه المواصفات
                    </div>
                ) : (
                    renderTable(users)
                )
            ) : (
                Object.entries(groupUsersByGrade()).map(([grade, usersInGrade], idx) => (
                    <div key={idx} className='w-100 d-flex flex-column mt-2'>
                        <div
                            onClick={() => toggleGradeTable(grade)}
                            className='title d-flex justify-content-start align-items-center gap-2 p-2 mt-3'
                            style={{
                                backgroundColor: 'var(--color-dark-1)',
                                color: 'var(--color-default2)',
                                borderRadius: '5px',
                                fontWeight: 'bold',
                                fontSize: '1.1em',
                                cursor: 'pointer',
                                boxShadow: 'var(--default-shadow2)',
                            }}
                        >
                            <ArrowDropDownIcon />
                            {grade}
                            <span style={{ backgroundColor: 'red', padding: '2px 9px', borderRadius: '100%' }}>{usersInGrade.length}</span>
                        </div>
                        <div className={`users-div area-table ${!openGrades[grade] ? 'd-none' : ''}`}>
                            {usersInGrade.length === 0 ? (
                                <div className='text-center' style={{ color: 'var(--text-cyan-700)', fontSize: '1.2em', padding: '20px' }}>
                                    لا يوجد أي مستخدمين حتى الآن
                                </div>
                            ) : (
                                renderTable(usersInGrade)
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
