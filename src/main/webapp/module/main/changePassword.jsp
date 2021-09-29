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
	int _i = 0;

	JSONObject _r = new JSONObject();

	try {
		int i;
		long id = Long.parseLong(request.getParameter("user_id"));
		String password_current = request.getParameter("password_current");
		String password_new = request.getParameter("password_new");

		_cn = XWeb.getConnection();
		if (_cn == null) throw new Exception("Tidak ada koneksi ke database!");

		_q = "	update	users"
			+ "	set		password	= ?"
			+ "	where	id			= ?"
			+ "	and		password	= ?";

		_ps = _cn.prepareStatement(_q);

		if (id < 0) {
			throw new Exception("Invalid data ID!");
		}

		_ps.setString(++_i, XWeb.encrypt(password_new));
		_ps.setLong(++_i, id);
		_ps.setString(++_i, XWeb.encrypt(password_current));
		i = _ps.executeUpdate();

		if (i <= 0) {
			throw new Exception("Password lama salah!");
		}

		_ps.close();

		_r.put("success", true);
		_r.put("data", "Password berhasil diubah.");
	} catch (Exception e) {
		_r.put("success", false);
		_r.put("data", e.getMessage());
	} finally {
		try {
			if (_cn != null) {
				_cn.close();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	writer.print(_r);
%>
