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
	int	_i = 0;
	long _t = 0;

	JSONObject _r = new JSONObject ();
	JSONArray _a;
	JSONObject _o;

	try {
		_cn	= XWeb.getConnection ();
		if (_cn == null) throw new Exception("Tidak ada koneksi ke database!");

		String query = request.getParameter("query");
		int limit = XWeb.getIntParameter(request, "limit", XWeb._paging_size);
		int start = XWeb.getIntParameter(request, "start", 0);

		// get total row
		_q ="SELECT " +
			"	count(ID) AS total " +
			"FROM " +
			"	houses " +
			"WHERE " +
			"	LOWER(id) LIKE LOWER(?) OR LOWER(name) LIKE LOWER(?)";

		_ps = _cn.prepareStatement(_q);
		_ps.setString(++_i, "%" + query + "%");
		_ps.setString(++_i, "%" + query + "%");
		_rs = _ps.executeQuery();

		if (_rs.next()) {
			_t = _rs.getLong("total");
		}

		_rs.close();
		_ps.close();

		_q ="SELECT " +
			"	id, " +
			"	name " +
			"FROM " +
			"	houses " +
			"WHERE " +
			"	LOWER(id) LIKE LOWER(?) OR LOWER(name) LIKE LOWER(?) " +
			"ORDER BY " +
			"	id " +
			"LIMIT ? OFFSET ? ";

		_ps = _cn.prepareStatement(_q);
		_i = 0;
		_ps.setString(++_i, "%" + query + "%");
		_ps.setString(++_i, "%" + query + "%");
		_ps.setInt(++_i, limit);
		_ps.setInt(++_i, start);
		_rs = _ps.executeQuery();
		_a = new JSONArray();

		while (_rs.next()) {
			_o = new JSONObject();

			_o.put("id", _rs.getString("id"));
			_o.put("name", _rs.getString("name"));

			_a.add(_o);
		}

		_rs.close();
		_ps.close();

		_r.put("success", true);
		_r.put("data", _a);
		_r.put("total", _t);
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