<%@ page import="org.bumiasri.rfid.XWeb" %>
<%
	try {
		session.removeAttribute(XWeb._name + ".user.id");
		session.removeAttribute(XWeb._name + ".user.name");
		session.removeAttribute(XWeb._name + ".user.gid");

		String m_home = request.getContextPath();

		if (m_home.equalsIgnoreCase("")) {
			response.sendRedirect("/");
		} else {
			response.sendRedirect(XWeb._path);
		}

	} catch (Exception e) {
		e.printStackTrace();
	}
%>
