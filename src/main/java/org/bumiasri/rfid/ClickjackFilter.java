package org.bumiasri.rfid;

import javax.servlet.*;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class ClickjackFilter implements Filter {

	private String mode = "DENY";

	public ClickjackFilter() {
	}

	@Override
	public void init(FilterConfig filterConfig) {
		String configMode = filterConfig.getInitParameter("mode");
		if (configMode != null) {
			this.mode = configMode;
		}
	}

	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
		HttpServletResponse httpServletResponse = (HttpServletResponse)servletResponse;
		filterChain.doFilter(servletRequest, httpServletResponse);
		httpServletResponse.addHeader("X-Frame-Options", this.mode);
	}

	@Override
	public void destroy() {

	}
}
