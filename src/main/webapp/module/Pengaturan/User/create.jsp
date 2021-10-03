<%@ page import="com.alibaba.fastjson.JSONObject" %>
<%@ page import="java.io.PrintWriter" %>
<%@ page import="java.sql.Connection" %>
<%@ page import="java.sql.PreparedStatement" %>
<%@ page import="org.bumiasri.rfid.XWeb" %>
<%
	PrintWriter writer = response.getWriter();

	Connection _cn = null;
	PreparedStatement _ps;
	String _q;
	int	_i = 0;

	JSONObject _r = new JSONObject ();

	try {
		_cn	= XWeb.getConnection ();
		if (_cn == null) throw new Exception("Tidak ada koneksi ke database!");

		_q ="INSERT INTO users ( " +
			"	group_id, " +
			"	name, " +
			"	username, " +
			"	password, " +
			"	status " +
			") " +
			"VALUES (?, ?, ?, ?, ?)";

		_ps = _cn.prepareStatement(_q);
		_ps.setInt(++_i, Integer.parseInt(request.getParameter("group_id")));
		_ps.setString(++_i, request.getParameter("name"));
		_ps.setString(++_i, request.getParameter("username"));
		_ps.setString(++_i, XWeb.encrypt(request.getParameter("password")));
		_ps.setInt(++_i, Integer.parseInt(request.getParameter("status")));
		_ps.executeUpdate();
		_ps.close();

		_r.put("success", true);
		_r.put("data", XWeb.MSG_SUCCESS_CREATE);
	} catch (Exception e) {
		_r.put("success", false);
		_r.put("data", e.getMessage());
	} finally {
		if (_cn != null) {
			try {
				_cn.close();
			} catch (Exception e) {
				_r.put("success", false);
				_r.put("data", e.getMessage());
			}
		}

		writer.print(_r);
	}
%>