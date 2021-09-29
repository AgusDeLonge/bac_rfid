XWeb = {
    pageSize: _g_paging_size,
	msg: {
		AJAX_FAILURE: "Komunikasi AJAX gagal.",
		AJAX_SUCCESS: "Data telah tersimpan.",
		ACTION_UNKNOWN: "action tidak dikenal",
		CLIENT_INVALID: "Form tidak bisa di submit dengan data yang tidak benar.",
		SERVER_ERROR: "Permintaan ke Server gagal."
	},
	toast: {
        display: function (title, message, icon, duration) {
            Ext.toast({
                title: title,
                html: message,
                align: "t",
                iconCls: icon,
                closable: false,
                slideInDuration: duration,
                minWidth: 400
            });
        },
        info: function (message) {
            this.display("Informasi", message, "x-fa fa-info-circle", 400);
        },
		warning: function (message) {
			this.display("Peringatan", message, "fa fa-exclamation-triangle", 600);
		},
        error: function (message) {
            this.display("Kesalahan", message, "fa fa-exclamation-circle", 600);
        }
    },
    generateModDir: function (id) {
        return _g_module_dir + id.replace(/_/g, "/");
    },
	generateToYears: function (count) {
		var d = new Date();
		var y = d.getFullYear();
		var years = [];

		for (var i = 0; i < count; i++) {
			var a = [];
			a.push((y - i));
			years.push(a);
		}

		return years;
	},
    generateYears: function (count) {
		var d = new Date();
		var y = d.getFullYear() + 1;
		var years = [];

		for (var i = 0; i < count; i++) {
			var a = [];
			a.push((y - i));
			years.push(a);
		}

		return years;
	},
    renderMoney: function (val) {
        return Ext.util.Format.number(val, '0,000.00');
    },
    renderNumber: function (val) {
        return Ext.util.Format.number(val, '0,000');
    }
};

Ext.tip.QuickTipManager.init();

Ext.define("Ext.plugin.form.PasswordStrength", {
    extend: "Ext.AbstractPlugin",
    alias: "plugin.passwordstrength",
    colors: ["C11B17", "FDD017", "4AA02C", "6AFB92", "00FF00"],
    init: function (cmp) {
        var me = this;
        cmp.on("change", me.onFieldChange, me);
    },
    onFieldChange: function (field, newVal) {
        if (newVal === "") {
            field.inputEl.setStyle({
                "background-color": null,
                "background-image": null
            });
            field.score = 0;
            return;
        }
        var me = this,
            score = me.scorePassword(newVal);

        field.score = score;

        me.processValue(field, score);
    },
    processValue: function (field, score) {
        var me = this,
            colors = me.colors,
            color;

        if (score < 16) {
            color = colors[0]; //very weak
        } else if (score > 15 && score < 25) {
            color = colors[1]; //weak
        } else if (score > 24 && score < 35) {
            color = colors[2]; //mediocre
        } else if (score > 34 && score < 45) {
            color = colors[3]; //strong
        } else {
            color = colors[4]; //very strong
        }

        field.inputEl.setStyle({
            "background-color": "#" + color,
            "background-image": "none"
        });
    },
    scorePassword: function (passwd) {
        var score = 0;

        if (passwd.length < 5) {
            score += 3;
        } else if (passwd.length > 4 && passwd.length < 8) {
            score += 6;
        } else if (passwd.length > 7 && passwd.length < 16) {
            score += 12;
        } else if (passwd.length > 15) {
            score += 18;
        }

        if (passwd.match(/[a-z]/)) {
            score += 1;
        }

        if (passwd.match(/[A-Z]/)) {
            score += 5;
        }

        if (passwd.match(/\d+/)) {
            score += 5;
        }

        if (passwd.match(/(.*[0-9].*[0-9].*[0-9])/)) {
            score += 5;
        }

        if (passwd.match(/.[!,@,#,$,%,^,&,*,?,_,~]/)) {
            score += 5;
        }

        if (passwd.match(/(.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~])/)) {
            score += 5;
        }

        if (passwd.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
            score += 2;
        }

        if (passwd.match(/([a-zA-Z])/) && passwd.match(/([0-9])/)) {
            score += 2;
        }

        if (passwd.match(/([a-zA-Z0-9].*[!,@,#,$,%,^,&,*,?,_,~])|([!,@,#,$,%,^,&,*,?,_,~].*[a-zA-Z0-9])/)) {
            score += 2;
        }

        return score;
    }
});

Ext.override(Ext.data.Store, {
    renderData: function (valueField, displayField) {
        var store = this;
        return function (v) {
            var i = store.findExact(valueField, v);
            if (i < 0) {
                return v;
            }
            var r = store.getAt(i);
            return r ? r.get(displayField) : "[no data found]";
        }
    }
});

Ext.override(Ext.toolbar.Paging, {
    displayInfo: true,
    firstText: 'Halaman pertama',
    prevText: 'Halaman sebelumnya',
    nextText: 'Halaman selanjutnya',
    lastText: 'Halaman terakhir',
    refreshText: 'Muat ulang',
    beforePageText: 'Hal.',
    afterPageText: 'dari {0}',
    displayMsg: 'Data ke {0} - {1} dari {2} data',
    emptyMsg: 'Tidak ada data untuk ditampilkan'
});

Ext.define('Overrides.list.RootTreeItem', {
	override: 'Ext.list.RootTreeItem',
	config: {
		floated: null
	},
	// Implement a setter.
	// There *is* no "floated" config in Classic.
	// We're still an inner item, we just get put inside a Container.
	setFloated: function(floated) {
		var me = this,
			el = me.element,
			placeholder = me.placeholder,
			node, wasExpanded;
		if (me.treeItemFloated !== floated) {
			if (floated) {
				placeholder = el.clone(false, true);
				// shallow, asDom
				placeholder.id += '-placeholder';
				// avoid duplicate id
				me.placeholder = Ext.get(placeholder);
				me.wasExpanded = me.getExpanded();
				me.setExpanded(true);
				el.addCls(me.floatedCls);
				el.dom.parentNode.insertBefore(placeholder, el.dom);
				me.floater = me.createFloater();
			}
			// toolkit-specific
			else if (placeholder) {
				wasExpanded = me.wasExpanded;
				node = me.getNode();
				me.setExpanded(wasExpanded);
				if (!wasExpanded && node.isExpanded()) {
					// If we have been floating and expanded a child, we may have been
					// expanded as part of the ancestors. Attempt to restore state.
					me.preventAnimation = true;
					node.collapse();
					me.preventAnimation = false;
				}
				me.floater.remove(me, false);
				// don't destroy
				el.removeCls(me.floatedCls);
				placeholder.dom.parentNode.insertBefore(el.dom, placeholder.dom);
				placeholder.destroy();
				me.floater.destroy();
				me.placeholder = me.floater = null;
			}
			// Use an internal property name. We are NOT really floated
			me.treeItemFloated = floated;
		}
	},
	getFloated: function() {
		return this.treeItemFloated;
	},
	runAnimation: function(animation) {
		return this.itemContainer.addAnimation(animation);
	},
	stopAnimation: function(animation) {
		animation.jumpToEnd();
	},
	privates: {
		createFloater: function() {
			var me = this,
				owner = me.getOwner(),
				ownerTree = me.up('treelist'),
				floater,
				toolElement = me.getToolElement();
			me.floater = floater = new Ext.container.Container({
				cls: ownerTree.self.prototype.element.cls + ' ' + ownerTree.uiPrefix + ownerTree.getUi() + ' ' + Ext.baseCSSPrefix + 'treelist-floater',
				floating: true,
				// We do not get element resize events on IE8
				// so fall back to 6.0.1 sizing to 200 wide.
				width: Ext.isIE8 ? 200 : (ownerTree.expandedWidth - toolElement.getWidth()),
				shadow: false,
				renderTo: Ext.getBody(),
				listeners: {
					element: 'el',
					click: function(e) {
						return owner.onClick(e);
					}
				}
			});
			floater.add(me);
			floater.show();
			floater.el.alignTo(toolElement, 'tr?');
			return floater;
		}
	}
});

Ext.define("XWeb.window.Report", {
	extend: "Ext.window.Window",
	alias: "widget.winreport",
	title: "Print Preview",
	iconCls: "x-fa fa-eye",
	width: 1024,
	height: 600,
	layout: "fit",
	src: "",
	modal: true,
	initComponent: function () {
		this.buttonPDF = Ext.create("Ext.button.Button", {
			text: "Cetak PDF",
			iconCls: "x-fa fa-file-pdf-o",
			scope: this,
			handler: function () {
				this.doCetak("pdf");
			}
		});

		this.buttonWord = Ext.create("Ext.button.Button", {
			text: "Cetak Word",
			iconCls: "x-fa fa-file-word-o",
			scope: this,
			handler: function () {
				this.doCetak("docx");
			}
		});

		this.buttonExcel = Ext.create("Ext.button.Button", {
			text: "Cetak Excel",
			iconCls: "x-fa fa-file-excel-o",
			scope: this,
			handler: function () {
				this.doCetak("xlsx");
			}
		});

		this.panel = Ext.create("Ext.panel.Panel", {
			autoScroll: true,
			layout: "fit",
			items: [{
				xtype: "component",
				autoEl: {
					tag: "iframe",
					src: this.src
				}
			}],
			dockedItems: [{
				xtype: "toolbar",
				dock: "top",
				items: [
					this.buttonPDF,
					this.buttonWord,
					this.buttonExcel
				]
			}]
		});

		this.items = [
			this.panel
		];

		this.callParent();
	},
	doCetak: function (tipe) {
		var form;
		var url;

		url = this.src + "&tipe=" + tipe;

		if (tipe == "pdf") {
			url = url + "&mode=download";
		}

		form = document.createElement('form');

		form.setAttribute('method', 'post');
		form.setAttribute('target', '_blank');
		form.setAttribute('action', url);
		document.body.appendChild(form);
		form.submit();
	}
});

Ext.util.Format.thousandSeparator = ".";
Ext.util.Format.decimalSeparator = ",";