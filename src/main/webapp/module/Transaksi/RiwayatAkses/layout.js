function XWebTransaksiRiwayatAkses() {
	this.id = "Transaksi_RiwayatAkses";
	this.dir = XWeb.generateModDir(this.id);
	this.perm = "4";

	this.store = Ext.create("Ext.data.Store", {
		autoLoad: false,
		pageSize: _g_paging_size,
		fields: [
			"id",
			"card_id",
			"house_id",
			"name",
			"type",
			"log_date"
		],
		proxy: {
			type: "ajax",
			url: this.dir + "/read.jsp",
			extraParams: {
				query: ""
			},
			reader: {
				type: "json",
				rootProperty: "data",
				totalProperty: "total"
			}
		}
	});

	this.formCari = Ext.create("Ext.form.field.Text", {
		emptyText: "Cari...",
		width: 250,
		triggers: {
			foo: {
				cls: "x-fa fa-search",
				handler: function () {
					this.up("grid").getStore().proxy.extraParams.query = this.getValue();
					this.up("grid").getStore().load();
				}
			}
		},
		listeners: {
			specialkey: function (f, e) {
				if (e.ENTER === e.getKey()) {
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
		title: "Transaksi - Riwayat Akses",
		headerPosition: "left",
		titleRotation: 2,
		titleAlign: "right",
		viewConfig: {
			enableTextSelection: true
		},
		columns: [{
			header: "RFID",
			dataIndex: "card_id",
			width: 100,
			align: "center"
		}, {
			header: "Blok",
			dataIndex: "house_id",
			width: 100,
			align: "center"
		}, {
			header: "Nama",
			dataIndex: "name",
			flex: 1
		}, {
			header: "Tipe",
			dataIndex: "type",
			width: 100,
			align: "center"
		}, {
			header: "Tanggal",
			dataIndex: "log_date",
			width: 175,
			align: "center",
			xtype: "datecolumn",
			format: "d-m-Y H:i:s"
		}],
		dockedItems: [{
			xtype: "toolbar",
			dock: "top",
			items: [
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

	this.doLoad = function () {
		this.store.load();
	};

	this.doRefresh = function () {
		this.doLoad();
	};
}

var Transaksi_RiwayatAkses = new XWebTransaksiRiwayatAkses();