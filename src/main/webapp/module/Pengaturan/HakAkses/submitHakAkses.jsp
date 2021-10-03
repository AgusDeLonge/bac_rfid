<%@ page import="com.alibaba.fastjson.JSONObject" %>
<%@ page import="java.io.PrintWriter" %>
<%@ page import="java.sql.Connection" %>
<%@ page import="java.sql.PreparedStatement" %>
<%@ page import="org.bumiasri.rfid.XWeb" %>
<%@ page import="com.alibaba.fastjson.JSONArray" %>
<%
	PrintWriter writer = response.getWriter();

	Connection _cn = null;
	PreparedStatement _ps;
	String _q;
	int	_i;

	JSONObject _r = new JSONObject ();
	JSONArray _a;
	JSONObject _o;

	int groupId;
	int menuId;
	int permission;

	try {
		_cn	= XWeb.getConnection ();
		if (_cn == null) throw new Exception("Tidak ada koneksi ke database!");

		_a = XWeb.getRequestBodyJson(request);

		for (int x = 0; x < _a.size(); x++) {
			_o = _a.getJSONObject(x);

			groupId = Integer.parseInt(request.getParameter("group_id"));
			menuId = _o.getIntValue("id");
			permission = _o.getIntValue("permission");

			if (groupId <= 0) throw new Exception ("Invalid group ID :'"+ groupId +"'!");
			if (menuId <= 0) throw new Exception ("Invalid menu ID :'"+ menuId +"'!");
			if (permission < 0) throw new Exception ("Invalid permission value :'"+ permission +"'!");

			_q ="DELETE " +
				"FROM privileges " +
				"WHERE menu_id = ? " +
				"AND group_id = ? ";

			_ps = _cn.prepareStatement(_q);
			_i = 0;
			_ps.setInt(++_i, menuId);
			_ps.setInt(++_i, groupId);
			_ps.executeUpdate();
			_ps.close();

			_q ="INSERT INTO privileges ( " +
				"	menu_id, " +
				"	group_id, " +
				"	permission " +
				") VALUES (?, ?, ?) ";

			_ps = _cn.prepareStatement(_q);
			_i = 0;
			_ps.setInt(++_i, menuId);
			_ps.setInt(++_i, groupId);
			_ps.setInt(++_i, permission);
			_ps.executeUpdate();
			_ps.close();
		}

		_r.put("success", true);
		_r.put("data", XWeb.MSG_SUCCESS_UPDATE);
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