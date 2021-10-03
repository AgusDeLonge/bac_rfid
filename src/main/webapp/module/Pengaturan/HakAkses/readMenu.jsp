<%@ page import="org.bumiasri.rfid.XWeb" %>
<%@ page import="java.io.PrintWriter" %>
<%@ page import="com.alibaba.fastjson.JSONArray" %>
<%@ page import="java.sql.Connection" %>
<%@ page import="com.alibaba.fastjson.JSONObject" %>
<%@ page import="java.sql.PreparedStatement" %>
<%@ page import="java.sql.ResultSet" %>
<%!
	private JSONArray getSystemMenu(Connection db_con, int gid, int pid, int depth) {
		JSONArray a = new JSONArray();
		JSONObject o;
		JSONArray c;
		PreparedStatement ps;
		ResultSet rs;
		int i = 0;

		try {
			String q =	"SELECT	* " +
						"FROM	( " +
						"		SELECT	" +
						"			a.id, " +
						"			? depth, " +
						"			a.pid parentId, " +
						"			a.label, " +
						"			a.icon AS iconCls, " +
						"			a.module, " +
						"			COALESCE(b.group_id, ?) AS group_id, " +
						"			b.permission " +
						"		FROM menus a " +
						"		LEFT JOIN privileges b ON a.id = b.menu_id AND b.group_id = ? " +
						"		WHERE a.pid = ? " +
						"		ORDER BY a.id " +
						"		) A ";
			ps = db_con.prepareStatement(q);
			ps.setInt(++i, depth);
			ps.setInt(++i, gid);
			ps.setInt(++i, gid);
			ps.setInt(++i, pid);
			rs = ps.executeQuery();

			while (rs.next()) {
				o = new JSONObject();

				o.put("id", rs.getInt("id"));
				o.put("parentId", rs.getInt("parentId"));
				o.put("label", rs.getString("label"));
				o.put("iconCls", rs.getString("iconCls"));
				o.put("group_id", rs.getInt("group_id"));
				o.put("permission", rs.getInt("permission"));

				c = getSystemMenu(db_con, gid, o.getIntValue("id"), depth + 1);

				if (c.size() <= 0) {
					o.put("leaf", true);
				} else {
					o.put("children", c);
					o.put("expanded", true);
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

	Connection connection = null;

	JSONObject jsonObject = new JSONObject();
	JSONArray jsonArray = null;

	try {
		connection = XWeb.getConnection();
		if (connection == null) throw new Exception("Tidak ada koneksi ke database!");

		int groupId = XWeb.getIntParameter(request, "group_id", 0);

		if (groupId <= 0) {
			jsonArray = new JSONArray();
		} else {
			jsonArray = getSystemMenu(connection, groupId, 0, 0);
		}
		jsonObject.put("text", ".");
		jsonObject.put("children", jsonArray);
	} catch (Exception e) {
		e.printStackTrace();
		jsonObject.put("text", ".");
		jsonObject.put("children", jsonArray);
	} finally {
		if (connection != null) {
			try {
				connection.close();
			} catch (Exception e) {
				jsonObject.put("text", ".");
				jsonObject.put("children", jsonArray);
			}
		}

		writer.print(jsonObject);
	}
%>
