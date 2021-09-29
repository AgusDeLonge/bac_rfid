var main;

function XWebUtilityUbahPassword() {
	this.id = "Utility_UbahPassword";
	this.dir = _g_module_path;

	this.userId = Ext.create("Ext.form.field.Text", {
		fieldLabel: "User ID",
		itemId: "user_id",
		name: "user_id",
		hidden: true,
		value: _g_c_uid
	});

	this.passwordCurrent = Ext.create("Ext.form.field.Text", {
		fieldLabel: "Password Lama",
		itemId: "password_current",
		name: "password_current",
		inputType: "password"
	});

	this.passwordNew = Ext.create("Ext.form.field.Text", {
		fieldLabel: "Password Baru",
		itemId: "password_new",
		name: "password_new",
		inputType: "password",
		vtype: "strength",
		strength: 24,
		plugins: {
			ptype: "passwordstrength"
		}
	});

	this.passwordConfirm = Ext.create("Ext.form.field.Text", {
		fieldLabel: "Konfirmasi Password",
		itemId: "password_confirm",
		name: "password_confirm",
		inputType: "password",
		vtype: "strength",
		plugins: {
			ptype: "passwordstrength"
		},
		listeners: {
			scope: this,
			specialkey: function(f, e) {
				if (e.ENTER === e.getKey()) {
					this.doChangePassword();
				}
			}
		}
	});

	this.button = Ext.create("Ext.button.Button", {
		text: "Simpan",
		iconCls: "x-fa fa-check",
		itemId: "button_ok",
		scope: this,
		handler: function() {
			this.doChangePassword();
		}
	});

	this.form = Ext.create("Ext.form.Panel", {
		id: this.id + "Form",
		url: _g_module_path + "ChangePassword.jsp",
		border: false,
		bodyPadding: "0 10 0 10",
		width: 400,
		items: [{
			xtype: "fieldset",
			title: "Data Password User",
			defaults: {
				vtype: "alphanum",
				labelWidth: 140,
				anchor: "100%",
				allowBlank: false
			},
			items: [
				this.userId, this.passwordCurrent, this.passwordNew, this.passwordConfirm
			]
		}]
	});

	this.win = Ext.create("Ext.window.Window", {
		id: this.id,
		title: "Ubah Password",
		iconCls: "x-fa fa-key",
		modal: true,
		draggable: false,
		resizable: false,
		defaultFocus: "password_current",
		layout: "fit",
		items: [
			this.form
		],
		buttonAlign: "right",
		buttons: [
			this.button
		]
	});

	this.doChangePassword = function() {
		if (this.passwordCurrent.getValue() !== "") {
			if (this.passwordNew.getValue() !== "") {
				if (this.passwordNew.score > 24) {
					if (this.passwordNew.getValue() !== this.passwordConfirm.getValue()) {
						XWeb.toast.error("Konfirmasi password salah!");
						return false;
					}

					Ext.Ajax.request({
						scope: this,
						url: _g_module_path + "ChangePassword.jsp",
						params: {
							user_id: this.userId.getValue(),
							password_current: this.passwordCurrent.getValue(),
							password_new: this.passwordNew.getValue()
						},
						success: function(response) {
							if (Ext.JSON.decode(response.responseText).success) {
								this.win.hide();
							}

							XWeb.toast.info(Ext.JSON.decode(response.responseText).data);
						},
						failure: function() {
							XWeb.toast.error("Proses penggantian password gagal!");
						}
					});
				} else {
					XWeb.toast.error("Password baru tidak memenuhi kriteria. Silahkan isi dengan kombinasi huruf kecil, huruf besar, angka, dan simbol.");
				}
			} else {
				XWeb.toast.error("Password baru harus diisi!");
			}
		} else {
			XWeb.toast.error("Password lama harus diisi!");
		}
	};

	this.doRefresh = function() {
		this.win.show();
	}
}

function XWebMain() {
	this.id = "Main";
	this.menuStoreId = this.id + "MenuStore";
	this.contentHomeId = this.id + "Home";
	this.headerId = this.id + "Header";
	this.headerTextId = this.id + "HeaderText";
	this.separatorId = this.id + "Separator";
	this.footerId = this.id + "Footer";
	this.dir = _g_module_dir + this.id;
	this.module = "undefined";
	this.uid = 0;
	this.microMenu = false;

	this.store = Ext.create("Ext.data.TreeStore", {
		storeId: this.menuStoreId,
		fields: [
			"id",
			"pid",
			"label",
			"iconCls"
		],
		proxy: {
			type: "ajax",
			url: _g_module_path + "menu.jsp",
			reader: {
				type: "json"
			}
		},
		listeners: {
			scope: this,
			load: function () {
				this.treeList.setSelection(this.store.getRoot().firstChild);
			}
		}
	});

	this.header = Ext.create("Ext.container.Container", {
		id: this.headerId,
		region: "north",
		height: 55,
		layout: "hbox",
		items: [{
			xtype: "box",
			height: 50,
			width: 50,
			margin: "7 5 3 5",
			html: "<img src='../../resources/images/logo.png'" +
			"	style='display:block; margin-left:auto; margin-right:auto;'" +
			"	height='40'/>"
		}, {
			id: this.headerTextId,
			margin: "8 0 0 0",
			xtype: "box",
			html: "RFID WEBAPP<br>BUMI ASRI CIHANJUANG",
			width: 200
		}, {
			xtype: "button",
			style: {
				backgroundColor: "transparent"
			},
			border: false,
			iconCls: "x-fa fa-bars",
			margin: "12 5 0 0",
			scope: this,
			handler: function () {
				this.showHideMenu();
			}
		}, {
			xtype: "container",
			flex: 1
		}, {
			xtype: "button",
			style: {
				backgroundColor: "transparent"
			},
			border: false,
			margin: "12 15 0 0",
			text: _g_c_username,
			iconCls: "x-fa fa-user",
			menuAlign: "tr-br",
			menu: [{
				text: "Ubah Password",
				iconCls: "x-fa fa-key",
				scope: this,
				handler: function() {
					this.doChangePassword();
				}
			}, {
				xtype: "menuseparator"
			}, {
				text: "Logout",
				iconCls: "x-fa fa-sign-out",
				scope: this,
				handler: function() {
					this.doLogout();
				}
			}]
		}]
	});

	this.separator = Ext.create("Ext.container.Container", {
		id: this.separatorId,
		region: "north",
		height: 3
	});

	this.footer = Ext.create("Ext.container.Container", {
		id: this.footerId,
		region: "south",
		height: 20,
		layout: {
			type: "hbox",
			align: "middle",
			pack: "center"
		},
		items: [{
			xtype: "box",
			html: "RFID WebApp" + "&nbsp;&nbsp;&copy;&nbsp;&nbsp;2021 - BUMI ASRI CIHANJUANG",
			flex: 1
		}]
	});

	this.contentHome = Ext.create("Ext.panel.Panel", {
		region: "center",
		bodyPadding: 5,
		layout: {
			type: "hbox",
			pack: "start",
			align: "stretch"
		},
		items: []
	});

	this.main = Ext.create("Ext.container.Viewport", {
		layout: "border",
		border: false,
		renderTo: Ext.getBody(),
		items: [
			this.header,
			this.separator,
			this.contentHome,
			this.footer
		]
	});

	this.loadingMask = Ext.create("Ext.LoadMask", {
		target: this.main,
		border: false,
		autoShow: false
	});

	this.treeList = Ext.create("Ext.list.Tree", {
		store: this.store,
		singleExpand: false,
		expanderOnly: false,
		ui: "nav",
		listeners: {
			scope: this,
			selectionchange: function (tree, node) {
				if (node.data.leaf) {
					this.onMenuClick(node);
				}
			}
		}
	});

	this.doChangePassword = function() {
		if (this.changePassword === undefined) {
			this.changePassword = new XWebUtilityUbahPassword();
		} else {
			if (this.changePassword.win !== undefined) {
				delete this.changePassword;
				this.changePassword = new XWebUtilityUbahPassword();
			}
		}
		this.changePassword.doRefresh();
	};

	this.doLogout = function() {
		Ext.MessageBox.confirm("Konfirmasi", "Logout?", function(btn) {
			if (btn === "yes") {
				location.href = _g_module_path + "logout.jsp?id=" + _g_c_uid;
			}
		}, this);
	};

	this.onMenuClick = function(b) {
		this.loadingMask.show();

		this.module = b.data;

		if (b.data.module === this.contentHomeId) {
			this.content.hide();
			this.contentHome.show();
			this.loadingMask.hide();
			return;
		}

		this.content.show();
		this.contentHome.hide();

		// Find menu module in content area.
		switch (_g_content_type) {
			case 0:
				// do nothing
				break;
			case 1:
				var c = main.content.getComponent(b.data.module);

				if (c !== undefined) {
					main.content.setActiveTab(c);
					this.loadingMask.hide();
					return;
				}
				break;
		}

		// If not exist, add module to content area
		Ext.Ajax.request({
			url: _g_module_dir + b.data.module.replace(/_/g, "/") + "/layout.js",
			failure: function() {
				XWeb.toast.error("Fail to load module!");
				main.loadingMask.hide();
			},
			success: function(response) {
				try {
					window.execScript ?
						window.execScript(response.responseText) :
						window.eval(response.responseText);

					var module = eval(b.data.module);

					switch (_g_content_type) {
						case 0:
							main.content.removeAll(true);
							main.content.add(module.panel);
							break;
						case 1:
							main.content.add(module.panel);
							main.content.setActiveTab(module.panel);
							// main.content.doLayout();
							break;
					}

					module.doRefresh(b.data.permission);
					main.loadingMask.hide();
				} catch (e) {
					if (undefined !== console) {
						console.log(e);
					}
					XWeb.toast.error(e.message);
					main.loadingMask.hide();
				}
			}
		});
	};

	this.loadMenu = function() {
		this.store.load({
			scope: this,
			callback: function(r, op, success) {
				if (!success) {
					XWeb.toast.error("Failed to load application menu! <br/>");
				}
			}
		});
	};

	this.hideLoading = function() {
		setTimeout(function () {
			Ext.get("loading").hide();
			Ext.get("loading-mask").fadeOut({
				remove		: false,
				useDisplay	: true
			});
		}, 1500);
	};

	this.showHideMenu = function() {
		if (!this.microMenu) {
			this.treeList.setMicro(true);
			this.treeList.ownerCt.setWidth(44);
			this.microMenu = true;
		} else {
			this.treeList.setMicro(false);
			this.treeList.ownerCt.setWidth(250);
			this.microMenu = false;
		}
	};

	this.init = function () {
		this.uid = _g_c_uid;

		this.loadMenu();

		this.menu = Ext.create("Ext.panel.Panel", {
			region: "west",
			width: 200,
			layout: {
				type: "vbox",
				align: "stretch"
			},
			border: false,
			split: true,
			scrollable: 'y',
			cls: 'treelist-with-nav',
			items: [
				this.treeList
			]
		});

		this.content = Ext.create("Ext.panel.Panel", {
			region: "center",
			padding: "5 5 5 0",
			plain: true,
			layout: "fit",
			hidden: true
		});

		this.main.add(this.menu);
		this.main.add(this.content);

		this.treeList.ownerCt.setWidth(250);

		this.hideLoading();
	}
}

Ext.onReady(function () {
	main = new XWebMain();
	main.init();
});