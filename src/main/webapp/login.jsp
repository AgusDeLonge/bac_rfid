<%@ page import="java.io.PrintWriter" %>
<%@ page import="java.sql.Connection" %>
<%@ page import="org.bumiasri.rfid.XWeb" %>
<%@ page import="java.sql.PreparedStatement" %>
<%@ page import="java.sql.ResultSet" %>
<%@ page import="com.alibaba.fastjson.JSONObject" %>
<%@ page import="java.sql.SQLException" %>
<%
	PrintWriter writer = response.getWriter();

	Connection _cn = null;
	PreparedStatement _ps;
	ResultSet _rs;

	String _q;
	int _i = 0;

	JSONObject _r = new JSONObject();

	try {
		String username = request.getParameter("username");
		String password = request.getParameter("password");
		int id;
		String realname;
		int gid;
		int status;

		if (null == username || null == password) {
			throw new Exception("Username atau Password salah!");
		}

		_cn = XWeb.getConnection();

		if (_cn == null) {
			throw new Exception("Koneksi ke database gagal!");
		}

		/* Check if username and password is valid */
		_q ="select " +
			"	id, " +
			"	group_id, " +
			"	name, " +
			"	status " +
			"from users " +
			"where username = ? " +
			"and password	= ? ";

		_ps = _cn.prepareStatement(_q);
		_ps.setString(++_i, username);
		_ps.setString(++_i, XWeb.encrypt(password));
		_rs = _ps.executeQuery();

		if (!_rs.next()) {
			throw new Exception("Username atau Password salah!");
		}

		id = _rs.getInt("id");
		gid = _rs.getInt("group_id");
		realname = _rs.getString("name");
		status = _rs.getInt("status");

		if (status == 0) {
			throw new Exception("User belum di aktifkan, silahkan hubungi Administrator.");
		}

		_rs.close();
		_ps.close();
		_cn.close();

		/* Save user info to session */
		session.setAttribute(XWeb._name + ".user.id", Integer.toString(id));
		session.setAttribute(XWeb._name + ".user.name", realname);
		session.setAttribute(XWeb._name + ".user.gid", Integer.toString(gid));

		/* Forward user to main page */
		_r.put("success", true);
		_r.put("data", "Logging in ...");
	} catch (Exception e) {
		_r.put("success", false);
		_r.put("data", e.getMessage());
	} finally {
		if (_cn != null) {
			try {
				_cn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}

	writer.print(_r);
%>
