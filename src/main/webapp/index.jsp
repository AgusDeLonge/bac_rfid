<% response.addHeader("X-Frame-Options", "DENY"); %>
<%@ page import="org.bumiasri.rfid.XWeb" %>
<%@ page contentType="text/html" pageEncoding="UTF-8"%>
<%
    XWeb.init(request);

    String contextPath = request.getContextPath();
    Object object = session.getAttribute(XWeb._name + ".user.id");
    String userId;

    if (object != null) userId = object.toString();
    else userId = null;

    if (null != userId) {
        if (!XWeb.getModulePermission(userId)) response.sendError(403);
        else {
            /* Forward user to home page */
            if (contextPath.equalsIgnoreCase("")) {
                response.sendRedirect("/module/main");
            } else {
                response.sendRedirect(XWeb._path + "/module/main");
            }
        }
    }
%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="description" content="RFID WebApp - Bumi Asri Cihanjuang">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <title>RFID WebApp - BAC</title>

    <!--begin::Web font -->
    <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.16/webfont.js"></script>
    <script>
        WebFont.load({
            google: {"families":["Poppins:300,400,500,600,700","Roboto:300,400,500,600,700"]},
            active: function() {
                sessionStorage.fonts = true;
            }
        });
    </script>
    <!--end::Web font -->

    <!--begin::Base Styles -->
    <link href="<%= XWeb._path %>/resources/pages/login/assets/vendors/base/vendors.bundle.css" rel="stylesheet" type="text/css" />
    <link href="<%= XWeb._path %>/resources/pages/login/assets/demo/default/base/style.bundle.css" rel="stylesheet" type="text/css" />
    <!--end::Base Styles -->

    <link rel="shortcut icon" href="<%= XWeb._path %>/resources/images/favicon.ico"/>

    <style id="antiClickjack">body{display:none !important;}</style>
    <script type="text/javascript">
        if (self === top) {
            var antiClickjack = document.getElementById("antiClickjack");
            antiClickjack.parentNode.removeChild(antiClickjack);
        } else {
            top.location = self.location;
        }
    </script>
</head>

<body class="m--skin- m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default"  >
<!-- begin:: Page -->
<div class="m-grid m-grid--hor m-grid--root m-page">
    <div class="m-grid__item m-grid__item--fluid m-grid m-grid--hor m-login m-login--singin m-login--2 m-login-2--skin-2" id="m_login" style="background-image: url(<%= XWeb._path %>/resources/pages/login/assets/app/media/img//bg/bg-3.jpg);">
        <div class="m-grid__item m-grid__item--fluid	m-login__wrapper">
            <div class="m-login__container">
                <div class="m-login__logo">
                    <a href="#">
                        <img src="<%= XWeb._path %>/resources/images/logo-small.png">
                    </a>
                </div>
                <div class="m-login__signin">
                    <div class="m-login__head">
                        <h3 class="m-login__title">Bumi Asri Cihanjuang</h3>
                        <h3 class="m-login__title">- RFID WebApp -</h3>
                    </div>
                    <form class="m-login__form m-form" action="" method="post">
                        <div class="form-group m-form__group">
                            <input class="form-control m-input" type="text" placeholder="Username" name="username" autocomplete="off">
                        </div>
                        <div class="form-group m-form__group">
                            <input class="form-control m-input m-login__form-input--last" type="password" placeholder="Password" name="password">
                        </div>
                        <div class="m-login__form-action">
                            <button id="m_login_signin_submit" class="btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air m-login__btn m-login__btn--primary">
                                Sign In
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- end:: Page -->
<!--begin::Base Scripts -->
<script src="<%= XWeb._path %>/resources/pages/login/assets/vendors/base/vendors.bundle.js" type="text/javascript"></script>
<script src="<%= XWeb._path %>/resources/pages/login/assets/demo/default/base/scripts.bundle.js" type="text/javascript"></script>
<!--end::Base Scripts -->
<!--begin::Page Snippets -->
<script src="<%= XWeb._path %>/login.js" type="text/javascript"></script>
<!--end::Page Snippets -->

<script type="text/javascript">
    var _g_root	= "<%= XWeb._path %>";
</script>
</body>
</html>
