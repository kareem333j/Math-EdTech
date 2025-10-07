import re
from rest_framework import serializers
from .models import NewUser,Profile
from django import forms
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from django.db import transaction, IntegrityError


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewUser
        fields = ('phone','first_name', 'last_name', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}
    
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)  
        instance = self.Meta.model(**validated_data)
        if password is not None: # if password is ((NOT) None) set it
            instance.set_password(password)
        instance.save()
        return instance
    
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('id','parent_phone', 'state','gender','grade')
        # extra_kwargs = {}
    
    
class RegisterSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=True)
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = NewUser
        fields = ('id','phone','first_name','last_name','profile','email',  'password', 'password2')

    # new validation for email
    def validate_email(self, value):
        email_regex = re.compile(r'^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$', re.I)
        if not email_regex.match(value):
            raise ValidationError("البريد الإلكتروني غير صالح.")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})
            
        return attrs
    
    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        password = validated_data.pop('password')
        validated_data.pop('password2')

        try:
            with transaction.atomic():
                user = NewUser.objects.create(**validated_data)
                user.set_password(password)
                user.save()

                Profile.objects.filter(user=user).update(**profile_data)

            return user

        except Exception as e:
            raise IntegrityError(f"فشل إنشاء الحساب: {str(e)}")

    # def create(self, validated_data):
    #     user = NewUser.objects.create(
    #         email=validated_data['email'],
    #         phone=validated_data['phone'],
    #         first_name=validated_data['first_name'],
    #         last_name=validated_data['last_name'],
    #     )

    #     user.set_password(validated_data['password'])
    #     user.save()

    #     return user
    
    
# change password serializer
class AdminPasswordChangeSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"password": "كلمة المرور غير متطابقة"})
        return attrs

    def save(self, **kwargs):
        user_id = self.validated_data["user_id"]
        new_password = self.validated_data["new_password"]

        try:
            user = NewUser.objects.get(id=user_id)
        except NewUser.DoesNotExist:
            raise serializers.ValidationError({"user": "المستخدم غير موجود"})

        user.set_password(new_password)
        user.save()
        return user
