function XWebTransaksiRegistrasiKartu() {
	this.id = "Transaksi_RegistrasiKartu";
	this.dir = XWeb.generateModDir(this.id);
	this.perm = "4";

	this.store = Ext.create("Ext.data.Store", {
		autoLoad: false,
		pageSize: _g_paging_size,
		fields: [
			"id",
			"denizen_id",
			"card_id",
			"type",
			"status"
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

	this.storeDenizens = Ext.create("Ext.data.Store", {
		autoLoad: false,
		fields: [
			"id",
			"name"
		],
		proxy: {
			type: "ajax",
			url: this.dir + "/readDenizens.jsp",
			reader: {
				type: "json",
				rootProperty: "data"
			}
		}
	});

	this.buttonAdd = Ext.create("Ext.button.Button", {
		text: "Tambah",
		iconCls: "x-fa fa-plus",
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
		title: "Transaksi - Registrasi Kartu",
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
					var rec = g.getStore().getAt(r);

					this.form.getForm().reset();
					this.form.loadRecord(rec);
					this.store.proxy.extraParams.action = "update";
					this.win.setIconCls("x-fa fa-pencil");
					this.win.setTitle("Ubah Data");
					this.win.show();
				}
			},
			delete: {
				iconCls: "x-fa fa-trash",
				tooltip: "Hapus",
				scope: this,
				handler: function (g, r) {
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
				}
			}
		},

		columns: [{
			header: "RFID",
			dataIndex: "card_id",
			width: 100,
			align: "center"
		}, {
			header: "Tipe",
			dataIndex: "type",
			width: 100,
			align: "center",
			renderer: function (v) {
				if (v == 1) {
					return "Kartu";
				} else {
					return "Tag";
				}
			}
		}, {
			header: "Warga",
			dataIndex: "denizen_id",
			flex: 1,
			renderer: this.storeDenizens.renderData("id", "name")
		}, {
			header: "Status",
			dataIndex: "status",
			width: 100,
			align: "center",
			renderer: function (v) {
				if (v == 1) {
					return "Aktif";
				} else {
					return "Tidak Aktif";
				}
			}
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
		hidden: true
	});

	this.formWarga = Ext.create("Ext.form.field.ComboBox", {
		fieldLabel: "Warga",
		itemId: "denizen_id",
		name: "denizen_id",
		store: this.storeDenizens,
		valueField: "id",
		displayField: "name",
		queryMode: "local",
		allowBlank: false
	});

	this.formRFID = Ext.create("Ext.form.field.Text", {
		fieldLabel: "Scan RFID",
		itemId: "card_id",
		name: "card_id",
		allowBlank: false
	});

	this.formStatusAktif = Ext.create("Ext.form.field.Radio", {
		itemId: "status_aktif",
		name: "status",
		boxLabel: "Aktif",
		inputValue: 1
	});

	this.formStatusTidakAktif = Ext.create("Ext.form.field.Radio", {
		itemId: "status_tidak_aktif",
		name: "status",
		boxLabel: "Tidak AKtif",
		inputValue: 0
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
			title: "Data Registrasi Kartu",
			defaults: {
				labelWidth: 100,
				anchor: "100%"
			},
			items: [
				this.formID,
				this.formWarga,
				this.formRFID,
				{
					xtype: "fieldcontainer",
					fieldLabel: "Status",
					layout: "hbox",
					defaults: {
						flex: 1
					},
					items: [
						this.formStatusAktif,
						this.formStatusTidakAktif
					]
				}
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
		defaultFocus: "denizen_id",
		items: [
			this.form
		]
	});

	this.doAdd = function () {
		this.form.getForm().reset();
		this.formID.setReadOnly(false);
		this.formStatusAktif.setValue(1);
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
		this.storeDenizens.load({
			scope: this,
			callback: function () {
				this.store.load();
			}
		})
	};

	this.doRefresh = function () {
		this.doLoad();
	};
}

var Transaksi_RegistrasiKartu = new XWebTransaksiRegistrasiKartu();