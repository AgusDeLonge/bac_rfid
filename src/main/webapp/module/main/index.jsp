<%@ page import="org.bumiasri.rfid.XWeb" %>
<%@ page contentType="text/html;charset=UTF-8" %>
<%
	String contextPath = request.getContextPath();
	Object object = session.getAttribute(XWeb._name + ".user.id");
	String userId;

	if (object != null) userId = object.toString();
	else userId = null;

	if (null == userId) {
		/* Forward user to home page */
		if (contextPath.equalsIgnoreCase ("")) {
			response.sendRedirect ("/");
		} else {
			response.sendRedirect (XWeb._path + "/");
		}
	} else {
		if (!XWeb.getModulePermission(userId)) response.sendError(403);
		else {
			XWeb._c_uid = Integer.parseInt((String) session.getAttribute(XWeb._name + ".user.id"));
			XWeb._c_username = (String) session.getAttribute(XWeb._name + ".user.name");
			XWeb._c_gid = Integer.parseInt((String) session.getAttribute(XWeb._name + ".user.gid"));
		}
	}
%>
<html>
<head>
	<title>RFID WebApp - BAC</title>

	<link rel="shortcut icon" href="<%= XWeb._path %>/resources/images/favicon.ico"/>

	<script>
        var _g_root = "<%= XWeb._path %>";
        var _g_module_dir = "<%= XWeb._path + XWeb._path_mod%>/";
        var _g_module_path = _g_module_dir + "/main/";
        var _g_content_type = <%= XWeb._content_type %>;
        var _g_paging_size = <%= XWeb._paging_size %>;
        var _g_title = "<%= XWeb._title %>";
        var _g_c_uid = "<%= XWeb._c_uid %>";
		var _g_c_gid = "<%= XWeb._c_gid %>";
        var _g_c_username = "<%= XWeb._c_username %>";
        var _g_menu_mode = <%= XWeb._menu_mode %>;
	</script>

	<link rel="stylesheet" type="text/css" href="<%= XWeb._path %>/resources/ext-js/theme-triton/resources/theme-triton-all.css">
	<link rel="stylesheet" type="text/css" href="<%= XWeb._path %>/resources/ext-js/packages/charts/classic/triton/resources/charts-all.css">
	<link rel="stylesheet" type="text/css" href="<%= XWeb._path %>/resources/ext-js/packages/font-awesome/resources/font-awesome-all.css">
	<link rel="stylesheet" type="text/css" href="<%= XWeb._path %>/resources/ext-js/packages/font-pictos/resources/font-pictos-all.css">
	<link rel="stylesheet" type="text/css" href="${pageContext.request.requestURI}layout.css" />

	<script type="text/javascript" src="<%= XWeb._path %>/resources/ext-js/ext-all.js"></script>
	<script type="text/javascript" src="<%= XWeb._path %>/resources/ext-js/theme-triton/theme-triton.js"></script>
	<script type="text/javascript" src="<%= XWeb._path %>/resources/ext-js/packages/charts/classic/charts.js"></script>
	<script type="text/javascript" src="<%= XWeb._path %>/resources/ext-js/packages/charts/classic/muted.js"></script>
	<script type="text/javascript" src="<%= XWeb._path %>/resources/ext-js/packages/font-awesome/font-awesome.js"></script>
	<script type="text/javascript" src="<%= XWeb._path %>/resources/ext-js/packages/font-pictos/font-pictos.js"></script>
	<script type="text/javascript" src="<%= XWeb._path %>/resources/ext-js/ux/CurrencyField.js"></script>
	<script type="text/javascript" src="<%= XWeb._path %>/resources/ext-js/ux/ProgressBarPager.js"></script>
	<script type="text/javascript" src="<%= XWeb._path %>/resources/ext-js/ux/Currency.js"></script>
	<script type="text/javascript" src="<%= XWeb._path %>/resources/js/application.js"></script>

	<script type="text/javascript">
        Ext.apply(Ext.form.VTypes, {
            strength: function(val, field) {
                return field.score > field.strength;
            },
            strengthText: "Password belum sesuai dengan kriteria!"
        });
	</script>

	<script type="text/javascript">
        function idleLogout() {
            var t;
            window.onload = resetTimer;
            window.onmousemove = resetTimer;
            window.onmousedown = resetTimer; // catches touchscreen presses
            window.onclick = resetTimer;     // catches touchpad clicks
            window.onscroll = resetTimer;    // catches scrolling with arrow keys
            window.onkeypress = resetTimer;

            function logout() {
                window.location.reload ();
            }

            function resetTimer() {
                clearTimeout(t);
                t = setTimeout(logout, 1260000);  // time is in milliseconds
            }
        }
        idleLogout();
	</script>

	<style id="antiClickjack">body{display:none !important;}</style>
	<script type="text/javascript">
        if (self === top) {
            var antiClickjack = document.getElementById("antiClickjack");
            antiClickjack.parentNode.removeChild(antiClickjack);
        } else {
            top.location = self.location;
        }
	</script>

	<script type="text/javascript" src="${pageContext.request.requestURI}layout.js"></script>
</head>
<body>
<div id="loading-mask" style=""></div>
<div id="loading">
	<div class="loading-indicator">
		<img src="<%= XWeb._path %>/resources/images/loading.gif" width="32" height="32" style="margin-right:8px;float:left;vertical-align:top;"/>
		RFID WebApp
		-
		<a href="http://www.djkn.kemenkeu.go.id">bumiasri.org</a>
		<br />
		<span id="loading-msg">Loading application...</span>
	</div>
</div>
</body>
</html>
