<%@ page import="com.alibaba.fastjson.JSONObject" %>
<%@ page import="com.alibaba.fastjson.JSONArray" %>
<%@ page import="java.io.PrintWriter" %>
<%@ page import="java.sql.Connection" %>
<%@ page import="java.sql.PreparedStatement" %>
<%@ page import="java.sql.ResultSet" %>
<%@ page import="org.bumiasri.rfid.XWeb" %>
<%
	PrintWriter writer = response.getWriter();

	Connection _cn = null;
	PreparedStatement _ps;
	ResultSet _rs;
	String _q;

	JSONObject _r = new JSONObject ();
	JSONArray _a;
	JSONObject _o;

	try {
		_cn	= XWeb.getConnection ();
		if (_cn == null) throw new Exception("Tidak ada koneksi ke database!");

		_q ="SELECT " +
			"	id, " +
			"	name " +
			"FROM " +
			"	`groups` " +
			"ORDER BY " +
			"	id ";

		_ps = _cn.prepareStatement(_q);
		_rs = _ps.executeQuery();
		_a = new JSONArray();

		while (_rs.next()) {
			_o = new JSONObject();

			_o.put("id", _rs.getInt("id"));
			_o.put("name", _rs.getString("name"));

			_a.add(_o);
		}

		_rs.close();
		_ps.close();

		_r.put("success", true);
		_r.put("data", _a);
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