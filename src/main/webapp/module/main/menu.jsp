<%@ page import="com.alibaba.fastjson.JSONArray" %>
<%@ page import="com.alibaba.fastjson.JSONObject" %>
<%@ page import="java.io.PrintWriter" %>
<%@ page import="java.sql.Connection" %>
<%@ page import="java.sql.PreparedStatement" %>
<%@ page import="java.sql.ResultSet" %>
<%@ page import="org.bumiasri.rfid.XWeb" %>
<%!
	private JSONArray getMenu(Connection db_con, int pid, int depth) {
		JSONArray a = new JSONArray();
		JSONObject o;
		JSONArray c;
		PreparedStatement ps;
		ResultSet rs;
		int i = 0;

		try {
			String q =	"SELECT	 * " +
						"FROM	( " +
						"		SELECT	" +
						"			a.id, " +
						"			? depth, " +
						"			a.pid parentId, " +
						"			a.label, " +
						"			a.icon iconCls, " +
						"			a.module, " +
						"			b.permission " +
						"		FROM " +
						"			menus a " +
						"		RIGHT JOIN " +
						"			privileges b on a.id = b.menu_id " +
						"		WHERE " +
						"			a.pid = ? AND " +
						"			b.permission > 0 " +
						"		ORDER BY a.id " +
						"		) A";
			ps = db_con.prepareStatement(q);
			ps.setInt(++i, depth);
			ps.setInt(++i, pid);
			rs = ps.executeQuery();

			while (rs.next()) {
				o = new JSONObject();

				o.put("id", rs.getInt("id"));
				o.put("parentId", rs.getInt("parentId"));
				o.put("text", "<span title='" + rs.getString("label") + "'>" + rs.getString("label") + "</span>");
				o.put("iconCls", rs.getString("iconCls"));
				o.put("module", rs.getString("module"));
				o.put("permission", rs.getInt("permission"));

				c = getMenu(db_con, o.getIntValue("id"), depth + 1);

				if (c.size() <= 0) {
					o.put("leaf", true);
				} else {
					o.put("children", c);
					o.put("expandable", true);
					o.put("expanded", false);
				}

				a.add(o);
			}

			rs.close();
			ps.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return a;
	}
%>
<%
	PrintWriter writer = response.getWriter();

	Connection _cn = null;

	JSONObject _r = new JSONObject();
	JSONArray _a = null;

	try {
		_cn = XWeb.getConnection();
		if (_cn == null) throw new Exception("Tidak ada koneksi ke database!");

		_a = getMenu(_cn, 0, 0);

		_r.put("text", ".");
		_r.put("children", _a);
	} catch (Exception e) {
		e.printStackTrace();
		_r.put("text", ".");
		_r.put("children", _a);
	} finally {
		if (_cn != null) {
			try {
				_cn.close();
			} catch (Exception e) {
				_r.put("text", ".");
				_r.put("children", _a);
			}
		}

		writer.print(_r);
	}
%>