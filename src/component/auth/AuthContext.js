import React, { useState, useEffect, useCallback } from "react";
import * as authAction from './AuthAction';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

let logoutTimer;
const AuthContext = React.createContext({
    token: (email, memberName, phone) => { },
    userObj: { email: '', memberName: '', memberRole: '' },
    isLoggedIn: false,
    isSuccess: false,
    isGetSuccess: false,
    signup: (email, password, memberName, phone, memberRole) => { },
    socialSignup: (email, password, memberName, phone, kakaoTokenId) => { },
    login: (email, password) => { },
    logout: () => { },
    getUser: () => { },
    // changeMemberName: (memberName) => { },
    changePassword: (exPassword, newPassword) => { },
    findPassword: (newPassword, newPasswordConfirm) => { }
});


export const AuthContextProvider = (props) => {
    const tokenData = authAction.retrieveStoredToken();
    let initialToken;
    if (tokenData) {
        initialToken = tokenData.token;
    }
    const [token, setToken] = useState(initialToken);
    const [userObj, setUserObj] = useState({
        email: '',
        memberName: '',
        memberRole: ''
    });
    const [isSuccess, setIsSuccess] = useState(false);
    const [isGetSuccess, setIsGetSuccess] = useState(false);
    const userIsLoggedIn = !!token;

    const signupHandler = (email, password, memberName, phone, memberRole) => {
        setIsSuccess(false);
        const response = authAction.signupActionHandler(email, password, memberName, phone, memberRole);
        response.then((result) => {
            if (result !== null) {
                setIsSuccess(true);

                if (memberRole === "ROLE_ADMIN") {
                    const title = `${memberName}님의 RE-PLANET 가입이 완료되었습니다.`
                    const message = `RE-PLANET 가입을 축하드립니다.<br/>
                                    <strong>"${memberName}"</strong>님<br/>
                                    아이디는 <strong>"${email}"</strong><br/>
                                    임시비밀번호는 <strong>"${password}"</strong>입니다.<br/>
                                    첫 로그인 후 비밀번호를 바꾸시는걸 권장드리며 더 궁금하신 사항이 있으시다면<br/>
                                    <strong>"replanetorg@gmail.com"</strong>로 문의 부탁드립니다.<br/>
                                    감사합니다.`
                    authAction.successRegistOrgActionHandler(email, title, message);
                    // 가입 성공 시에 메일 보내야함
                } else {
                    Swal.fire({
                        title: "가입 성공",
                        text: "확인 버튼을 누르시면 로그인 페이지로 이동합니다.",
                        confirmButtonText: "확인"}).then(function() {
                            window.location = "/login";
                        }); 
                }
            } else {
                Swal.fire("회원가입 조건을 확인해 주세요!", "이메일 주소가 중복되었거나 필수 기입 항목이 누락되었습니다.")
            }
        });
    };

    const socialSignupHandler = (email, password, memberName, phone, kakaoTokenId) => {
        setIsSuccess(false);
        const response = authAction.socialSignupActionHandler(email, password, memberName, phone, kakaoTokenId);
        response.then((result) => {
            if (result !== null) {
                    Swal.fire({
                        title: "가입 성공",
                        text: "확인 버튼을 누르시면 로그인 페이지로 이동합니다.",
                        confirmButtonText: "확인"}).then(function() {
                            window.location = "/login";
                        }); 
            } else {
                Swal.fire("회원가입 조건을 확인해 주세요!", "이메일 주소가 중복되었거나 필수 기입 항목이 누락되었습니다.")
            }
        });
    };

    const loginHandler = (email, password) => {
        setIsSuccess(false);
        console.log(isSuccess);
        const data = authAction.loginActionHandler(email, password);
        data.then((result) => {
            if (result !== null) {
                const loginData = result.data;
                setToken(loginData.accessToken);
                logoutTimer = setTimeout(logoutHandler, authAction.loginTokenHandler(loginData.accessToken, loginData.tokenExpiresIn));
                setIsSuccess(true);
                console.log(isSuccess);
            } else {
                Swal.fire("", "로그인 실패")
            }
        });
    };
    const logoutHandler = useCallback(() => {
        setToken('');
        authAction.logoutActionHandler();
        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    }, []);
    const getUserHandler = () => {
        setIsGetSuccess(false);
        const data = authAction.getUserActionHandler(token);
        data.then((result) => {
            if (result !== null) {
                console.log('get user start!');
                const userData = result.data;
                setUserObj(userData);
                setIsGetSuccess(true);
            }
        });
    };

    const changePasswordHandler = (exPassword, newPassword) => {
        setIsSuccess(false);
        const data = authAction.changePasswordActionHandler(exPassword, newPassword, token);
        data.then((result) => {
            if (result !== null) {
                setIsSuccess(true);
                logoutHandler();
            }
        });
    };

    const findPasswordHandler = (newPassword, newPasswordConfirm) => {
        setIsSuccess(false);
        const data = authAction.changePasswordActionHandler(newPassword, newPasswordConfirm);
        data.then((result) => {
            if (result !== null) {
                setIsSuccess(true);
            }
        });
    };

    useEffect(() => {
        if (tokenData) {
            console.log(tokenData.duration);
            logoutTimer = setTimeout(logoutHandler, tokenData.duration);
        }
    }, [tokenData, logoutHandler]);
    const contextValue = {
        token,
        userObj,
        isLoggedIn: userIsLoggedIn,
        isSuccess,
        isGetSuccess,
        signup: signupHandler,
        socialSignup: socialSignupHandler,
        login: loginHandler,
        logout: logoutHandler,
        getUser: getUserHandler,
        changePassword: changePasswordHandler,
        findPassword: findPasswordHandler
    };
    return (React.createElement(AuthContext.Provider, { value: contextValue }, props.children));
};
export default AuthContext;
