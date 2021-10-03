function XWebMasterDataRumah() {
	this.id = "MasterData_Rumah";
	this.dir = XWeb.generateModDir(this.id);
	this.perm = 0;

	this.store = Ext.create("Ext.data.Store", {
		autoLoad: false,
		pageSize: _g_paging_size,
		fields: [
			"id",
			"name"
		],
		proxy: {
			type: "ajax",
			api: {
				read: this.dir + "/read.jsp",
				create: this.dir + "/create.jsp",
				update: this.dir + "/update.jsp",
				destroy: this.dir + "/destroy.jsp"
			},
			extraParams: {
				action: "read",
				query: ""
			},
			reader: {
				type: "json",
				rootProperty: "data",
				totalProperty: "total"
			}
		}
	});

	this.buttonAdd = Ext.create("Ext.button.Button", {
		text: "Tambah",
		iconCls: "x-fa fa-plus",
		disabled: true,
		scope: this,
		handler: function() {
			this.doAdd();
		}
	});

	this.formCari = Ext.create("Ext.form.field.Text", {
		emptyText: "Cari...",
		width: 250,
		triggers: {
			foo: {
				cls: "x-fa fa-search",
				handler: function () {
					this.up("grid").getStore().proxy.extraParams.action = "read";
					this.up("grid").getStore().proxy.extraParams.query = this.getValue();
					this.up("grid").getStore().load();
				}
			}
		},
		listeners: {
			specialkey: function (f, e) {
				if (e.ENTER === e.getKey()) {
					this.up("grid").getStore().proxy.extraParams.action = "read";
					this.up("grid").getStore().proxy.extraParams.query = this.getValue();
					this.up("grid").getStore().load();
				}
			}
		}
	});

	this.panel = Ext.create("Ext.grid.Panel", {
		id: this.id,
		store: this.store,
		layout: "fit",
		title: "Master Data - Rumah",
		headerPosition: "left",
		titleRotation: 2,
		titleAlign: "right",
		viewConfig: {
			enableTextSelection: true
		},
		actions: {
			edit: {
				iconCls: "x-fa fa-pencil",
				tooltip: "Ubah",
				scope: this,
				handler: function (g, r) {
					if (this.perm >= 3) {
						var rec = g.getStore().getAt(r);

						this.form.getForm().reset();
						this.form.loadRecord(rec);
						this.formID.setReadOnly(true);
						this.store.proxy.extraParams.action = "update";
						this.win.setIconCls("x-fa fa-pencil");
						this.win.setTitle("Ubah Data");
						this.win.show();
					} else XWeb.toast.info("Anda tidak mempunyai hak akses untuk merubah data!");
				}
			},
			delete: {
				iconCls: "x-fa fa-trash",
				tooltip: "Hapus",
				scope: this,
				handler: function (g, r) {
					if (this.perm >= 4) {
						var rec = g.getStore().getAt(r);

						Ext.MessageBox.confirm(
							"Konfirmasi",
							"Data akan dihapus. <br/> Apakah anda yakin?",
							function (btn) {
								if (btn === "yes") {
									this.form.getForm().reset();
									this.form.loadRecord(rec);
									this.store.proxy.extraParams.action = "destroy";
									this.doSave();
								}
							}, this
						);
					} else XWeb.toast.info("Anda tidak mempunyai hak akses untuk menghapus data!");
				}
			}
		},

		columns: [{
			header: "ID",
			dataIndex: "id",
			width: 100,
			align: "center"
		}, {
			header: "Nama",
			dataIndex: "name",
			flex: 1
		}, {
			menuDisabled: true,
			sortable: false,
			xtype: "actioncolumn",
			width: 60,
			align: "center",
			items: ["@edit", "@delete"]
		}],
		dockedItems: [{
			xtype: "toolbar",
			dock: "top",
			items: [
				this.buttonAdd,
				"->",
				this.formCari
			]
		}, {
			xtype: "pagingtoolbar",
			dock: "bottom",
			store: this.store,
			displayInfo: true,
			pageSize: _g_paging_size,
			plugins: "ux-progressbarpager"
		}]
	});

	this.formID = Ext.create("Ext.form.field.Text", {
		fieldLabel: "ID",
		itemId: "id",
		name: "id",
		allowBlank: false
	});

	this.formName = Ext.create("Ext.form.field.TextArea", {
		fieldLabel: "Nama",
		itemId: "name",
		name: "name",
		allowBlank: false
	});

	this.buttonSave = Ext.create("Ext.button.Button", {
		text: "Simpan",
		iconCls: "x-fa fa-check",
		formBind: true,
		scope: this,
		handler: function () {
			this.doSave();
		}
	});

	this.form = Ext.create("Ext.form.Panel", {
		bodyPadding: "0 10 0 10",
		width: 500,
		items: [{
			xtype: "fieldset",
			title: "Data Rumah",
			defaults: {
				labelWidth: 100,
				anchor: "100%"
			},
			items: [
				this.formID,
				this.formName
			]
		}],
		buttons: [
			this.buttonSave
		]
	});

	this.win = Ext.create("Ext.window.Window", {
		title: "",
		resizable: false,
		modal: true,
		closeAction: "method-hide",
		defaultFocus: "id",
		items: [
			this.form
		]
	});

	this.doAdd = function () {
		this.form.getForm().reset();
		this.formID.setReadOnly(false);
		this.store.proxy.extraParams.action = "create";
		this.win.setIconCls("x-fa fa-plus");
		this.win.setTitle("Tambah Data");
		this.win.show();
	};

	this.doSave = function () {
		var f = this.form.getForm();
		var url;

		switch (this.store.proxy.extraParams.action) {
			case "read":
				url = this.store.proxy.api.read;
				break;
			case "create":
				url = this.store.proxy.api.create;
				break;
			case "update":
				url = this.store.proxy.api.update;
				break;
			case "destroy":
				url = this.store.proxy.api.destroy;
				break;
			default:
				XWeb.toast.error(XWeb.msg.ACTION_UNKNOWN + "'" + this.store.action + "'");
				return;
		}

		f.submit({
			url: url,
			scope: this,
			success: function (form, action) {
				XWeb.toast.info(action.result.data);
				this.win.hide();
				this.panel.getSelectionModel().deselectAll();
				this.doLoad();
			},
			failure: function (form, action) {
				XWeb.toast.error(action.result.data);
				this.panel.getSelectionModel().deselectAll();
				this.win.hide();
				this.doLoad();
			},
			clientValidation: false
		});
	};

	this.doLoad = function () {
		this.store.load();
	};

	this.doRefresh = function (perm) {
		this.perm = perm;

		switch (this.perm) {
			case 2 :
				this.buttonAdd.setDisabled(false);
				break;
			case 3 :
				this.buttonAdd.setDisabled(false);
				break;
			case 4 :
				this.buttonAdd.setDisabled(false);
				break;
			default :
				this.buttonAdd.setDisabled(true);
		}

		this.doLoad();
	};
}

var MasterData_Rumah = new XWebMasterDataRumah();