var PengaturanHakAsesGroup;
var PengaturanHakAsesMenu;

function XWebPengaturanHakAksesGroup() {
    this.id = "Pengaturan_HakAkses";
    this.dir = XWeb.generateModDir(this.id);

    this.store = Ext.create("Ext.data.Store", {
        autoLoad: false,
        fields: [
            "id",
            "name"
        ],
        proxy: {
            type: "ajax",
            url: this.dir + "/readGroup.jsp",
            reader: {
                type: "json",
                rootProperty: "data"
            }
        }
    });

    this.panel = Ext.create("Ext.grid.Panel", {
        store: this.store,
        layout: "fit",
        title: "Group",
        region: "west",
        width: "50%",
        iconCls: "x-fa fa-users",
        ui: "light",
        viewConfig: {
            enableTextSelection: true
        },
        columns: [{
            header: "ID",
            dataIndex: "id",
            hidden: true,
            hideable: false
        }, {
            header: "Nama Group",
            dataIndex: "name",
            flex: 1
        }],
        listeners: {
            scope: this,
            selectionchange: function (g, r) {
                this.onSelectionChange(r);
            }
        }
    });

    this.onSelectionChange = function (r) {
        var group_id = 0;

        if (r.length > 0) {
            group_id = r[0].get("id");

			PengaturanHakAsesMenu.doRefresh(group_id);
        }
    };

    this.doLoad = function () {
		this.store.load();
    };

    this.doRefresh = function () {
        this.doLoad();
    }
}

function XWebPengaturanHakAksesMenu() {
    this.id = "Pengaturan_HakAkses";
    this.dir = XWeb.generateModDir(this.id);

    this.store = Ext.create("Ext.data.TreeStore", {
        autoSync: true,
        fields: [
            "id",
            "pid",
            "label",
            "iconCls",
            "module",
            "group_id",
            "permission"
        ],
        proxy: {
            type: "ajax",
            api: {
                read: this.dir + "/readMenu.jsp",
                create: undefined,
                update: this.dir + "/submitHakAkses.jsp",
                destroy: undefined
            },
            extraParams: {
                group_id: 0
            },
            writer: {
                type: "json",
                allowSingle: false
            }
        }
    });

    this.storeHakAkses = Ext.create("Ext.data.Store", {
        fields: [
            "permission",
            "name"
        ],
        data: [{
            permission: 0,
            name: "No Access"
        }, {
            permission: 1,
            name: "View only"
        }, {
            permission: 2,
            name: "Only allow create"
        }, {
            permission: 3,
            name: "Only allow create and update"
        }, {
            permission: 4,
            name: "Full access"
        }]
    });

    this.panel = Ext.create("Ext.tree.Panel", {
        title: "Hak Akses",
        region: "center",
        margin: "0 0 0 5",
        layout: "fit",
        useArrows: true,
        rootVisible: false,
        store: this.store,
        iconCls: "x-fa fa-shield",
        ui: "light",
        plugins: [
            Ext.create("Ext.grid.plugin.CellEditing", {
                clicksToEdit: 2
            })
        ],
        columns: [{
            xtype: "treecolumn",
            text: "Nama Menu",
            dataIndex: "label",
            flex: 1
        }, {
            text: "Hak Akses",
            dataIndex: "permission",
            flex: 1,
            renderer: this.storeHakAkses.renderData("permission", "name"),
            editor: {
                xtype: "combobox",
                valueField: "permission",
                displayField: "name",
                store: this.storeHakAkses,
                editable: false
            }
        }]
    });

    this.doRefresh = function (group_id) {
        if (group_id <= 0) {
            return;
        }

        this.store.proxy.extraParams.group_id = group_id;
        this.store.load();
    }
}

function XWebPengaturanHakAkses() {
    PengaturanHakAsesGroup = new XWebPengaturanHakAksesGroup();
    PengaturanHakAsesMenu = new XWebPengaturanHakAksesMenu();

    this.panel = Ext.create("Ext.panel.Panel", {
        title: "Pengaturan - Hak Akses",
        headerPosition: "left",
        titleRotation: 2,
        titleAlign: "right",
        layout: "border",
        bodyPadding: "0 0 0 5",
        items: [
            PengaturanHakAsesGroup.panel,
            PengaturanHakAsesMenu.panel
        ]
    });

    this.doRefresh = function (perm) {
		PengaturanHakAsesGroup.doRefresh(perm);
    }
}

var Pengaturan_HakAkses = new XWebPengaturanHakAkses();