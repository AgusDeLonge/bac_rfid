//== Class Definition
var SnippetLogin = function() {

	var login = $('#m_login');

	var showErrorMsg = function(form, type, msg) {
		var alert = $('<div class="m-alert m-alert--outline alert alert-' + type + ' alert-dismissible" role="alert">\
			<button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>\
			<span></span>\
		</div>');

		form.find('.alert').remove();
		alert.prependTo(form);
		alert.animateClass('fadeIn animated');
		alert.find('span').html(msg);
	};

	//== Private Functions

	var displaySignUpForm = function() {
		login.removeClass('m-login--forget-password');
		login.removeClass('m-login--signin');

		login.addClass('m-login--signup');
		login.find('.m-login__signup').animateClass('flipInX animated');
	};

	var displaySignInForm = function() {
		login.removeClass('m-login--forget-password');
		login.removeClass('m-login--signup');

		login.addClass('m-login--signin');
		login.find('.m-login__signin').animateClass('flipInX animated');
	};

	var displayForgetPasswordForm = function() {
		login.removeClass('m-login--signin');
		login.removeClass('m-login--signup');

		login.addClass('m-login--forget-password');
		login.find('.m-login__forget-password').animateClass('flipInX animated');
	};

	var handleFormSwitch = function() {
		$('#m_login_forget_password').click(function(e) {
			e.preventDefault();
			displayForgetPasswordForm();
		});

		$('#m_login_forget_password_cancel').click(function(e) {
			e.preventDefault();
			displaySignInForm();
		});

		$('#m_login_signup').click(function(e) {
			e.preventDefault();
			displaySignUpForm();
		});

		$('#m_login_signup_cancel').click(function(e) {
			e.preventDefault();
			displaySignInForm();
		});
	};

	var handleSignInFormSubmit = function() {
		$('#m_login_signin_submit').click(function(e) {
			e.preventDefault();
			var btn = $(this);
			var form = $(this).closest('form');

			form.validate({
				rules: {
					username: {
						required: true
					},
					password: {
						required: true
					}
				}
			});

			if (!form.valid()) {
				return;
			}

			btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);

			form.ajaxSubmit({
				url: 'login.jsp',
				data: form.serialize(),
				dataType: "json",
				success: function(data) {
					btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);

					if (!data.success) showErrorMsg(form, 'danger', data.data);
					else location.href = _g_root + "/module/main";
				}
			});
		});
	};

	var handleSignUpFormSubmit = function() {
		$('#m_login_signup_submit').click(function(e) {
			e.preventDefault();

			var btn = $(this);
			var form = $(this).closest('form');

			form.validate({
				rules: {
					username: {
						required: true
					},
					password: {
						required: true
					}
				}
			});

			if (!form.valid()) {
				return;
			}

			btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);

			form.ajaxSubmit({
				url: 'login-admin.jsp',
				data: form.serialize(),
				dataType: "json",
				success: function(data) {
					btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);

					if (!data.success) {
						showErrorMsg(form, 'danger', data.data);
					} else {
						location.href = _g_root + "/admin/main";
					}
				}
			});
		});
	};

	var handleForgetPasswordFormSubmit = function() {
		$('#m_login_forget_password_submit').click(function(e) {
			e.preventDefault();

			var btn = $(this);
			var form = $(this).closest('form');

			form.validate({
				rules: {
					username: {
						required: true
					},
					password: {
						required: true
					}
				}
			});

			if (!form.valid()) {
				return;
			}

			btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);

			form.ajaxSubmit({
				url: 'login-dashboard.jsp',
				data: form.serialize(),
				dataType: "json",
				success: function(data) {
					btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);

					if (!data.success) {
						showErrorMsg(form, 'danger', data.data);
					} else {
						location.href = _g_root + "/dashboard";
					}
				}
			});
		});
	};

	//== Public Functions
	return {
		// public functions
		init: function() {
			handleFormSwitch();
			handleSignInFormSubmit();
			handleSignUpFormSubmit();
			handleForgetPasswordFormSubmit();
		}
	};
}();

jQuery(document).ready(function() {
	SnippetLogin.init();
});
