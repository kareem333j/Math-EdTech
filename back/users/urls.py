from django.urls import path
from .views import CustomUserCreate, BlacklistTokenUpdateView, AdminChangePasswordView

app_name = 'users'

urlpatterns = [
    path('register/', CustomUserCreate.as_view(), name='create_user'),
    path('logout/blacklist/', BlacklistTokenUpdateView.as_view(),name='blacklist'),
    path("admin/users/change-password/", AdminChangePasswordView.as_view(), name="admin-change-password"),
]
