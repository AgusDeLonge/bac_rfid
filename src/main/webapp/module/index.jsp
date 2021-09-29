<%@ page import="id.go.kemenkeu.modulknd.blu.XWeb" %>
<%@ page contentType="text/html;charset=UTF-8" %>
<%
	String contextPath = request.getContextPath();
	Object object = session.getAttribute(XWeb._name + ".user.id");
	String userId;

	if (object != null) userId = object.toString();
	else userId = null;

	int appModuleId = XWeb.BLU_MODULE_ID;

	if (null == userId) {
		/* Forward user to home page */
		if (contextPath.equalsIgnoreCase("")) {
			response.sendRedirect("/");
		} else {
			response.sendRedirect(XWeb._path + "/");
		}
	} else {
		if (XWeb.getModulePermission(userId, appModuleId)) response.sendRedirect(XWeb._path + "/module/main");
		else response.sendError(403);
	}
%>
<html>
<head>
	<title>BLU - MODUL KND</title>

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
<body>

</body>
</html>
