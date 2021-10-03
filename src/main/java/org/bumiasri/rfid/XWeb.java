package org.bumiasri.rfid;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.InputStream;
import java.security.MessageDigest;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Properties;

public class XWeb {

	public static String MSG_SUCCESS_CREATE	= "";
	public static String MSG_SUCCESS_UPDATE = "";
	public static String MSG_SUCCESS_DESTROY = "";

	public static String _title	= "RFID WebApp - Bumi Asri Cihanjuang";
	public static String _path = "/rfid";
	public static String _name = "xweb";
	public static String _path_mod = "/module";
	public static int _content_type	= 0;
	public static int _menu_mode = 1;
	public static int _paging_size = 50;

	public static long _c_uid = 0;
	public static String _c_username = "Anonymous";
	public static long _c_gid = 0;

	public static Connection getConnection() {
		Connection connection = null;
		InputStream inputStream;

		try {
			Properties properties = new Properties();
			String propertiesFileName = "application.properties";
			inputStream = XWeb.class.getClassLoader().getResourceAsStream(propertiesFileName);
			if (inputStream != null) properties.load(inputStream);
			else throw new Exception("properties file not found.");

			Class.forName(properties.getProperty("db.class"));
			connection = DriverManager.getConnection(properties.getProperty("db.url"), properties.getProperty("db.username"), properties.getProperty("db.password"));
		} catch (Exception e) {
			e.printStackTrace();
		}

		return connection;
	}

	public static int getIntParameter (HttpServletRequest request, String paramName, int defaultValue) {
		String	paramString = request.getParameter (paramName);
		int	paramValue;

		try {
			paramValue = Integer.parseInt(paramString);
		} catch (NumberFormatException nfe) {
			paramValue = defaultValue;
		}

		return (paramValue);
	}

	public static long getLongParameter (HttpServletRequest request, String paramName, long defaultValue) {
		String	paramString = request.getParameter (paramName);
		long	paramValue	= defaultValue;

		try {
			paramValue = Long.parseLong(paramString);
		} catch (NumberFormatException nfe) {
			nfe.printStackTrace();
		}

		return (paramValue);
	}

	public static JSONArray getRequestBodyJson (HttpServletRequest request) throws Exception {
		StringBuilder req_body = new StringBuilder();
		BufferedReader req_reader = request.getReader();

		String req_line = req_reader.readLine();
		while (req_line != null) {
			req_body.append(req_line).append("\n");
			req_line = req_reader.readLine();
		}
		req_reader.close();

		return JSON.parseArray(req_body.toString().trim());
	}

	public static boolean getModulePermission(String userId) {
		Connection connection;
		PreparedStatement preparedStatement;
		ResultSet resultSet;
		String query;
		int i = 0;
		boolean result = false;

		try {
			connection = XWeb.getConnection();

			query = "SELECT name " +
					"FROM users " +
					"WHERE id = ? ";

			preparedStatement = connection.prepareStatement(query);
			preparedStatement.setString(++i, userId);

			resultSet = preparedStatement.executeQuery();

			if (resultSet.next()) {
				result = true;
			}

			resultSet.close();
			preparedStatement.close();
			connection.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return result;
	}

	public static String encrypt (String data) {
		try {
			MessageDigest md = MessageDigest.getInstance("SHA-256");
			byte[] hash	= md.digest(data.getBytes());
			StringBuilder sb = new StringBuilder();

			for (byte b : hash) {
				sb.append(String.format("%02x", b));
			}

			return sb.toString();
		} catch (Exception e) {
			return "";
		}
	}

	public static void init(HttpServletRequest request) {
		InputStream inputStream;

		try {
			Properties properties = new Properties();
			String propertiesFileName = "application.properties";
			inputStream = XWeb.class.getClassLoader().getResourceAsStream(propertiesFileName);
			if (inputStream != null) properties.load(inputStream);
			else throw new Exception("properties file not found.");

			XWeb._title	=properties.getProperty ("app.title");
			XWeb._path = request.getContextPath();
			XWeb._name = properties.getProperty("app.name");
			XWeb._path_mod = properties.getProperty ("app.module.dir");
			XWeb._content_type = Integer.parseInt (properties.getProperty ("app.content.type"));
			XWeb._menu_mode = Integer.parseInt (properties.getProperty ("app.menu.mode"));
			XWeb._paging_size = Integer.parseInt (properties.getProperty ("app.paging.size"));

			XWeb.MSG_SUCCESS_CREATE = "Data baru telah tersimpan.";
			XWeb.MSG_SUCCESS_UPDATE = "Data telah terubah.";
			XWeb.MSG_SUCCESS_DESTROY = "Data telah terhapus.";
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
