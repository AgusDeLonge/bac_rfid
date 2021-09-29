Ext.define('Ext.ux.CurrencyField', {
	extend: 'Ext.form.field.Number',
	alias: ['widget.currencyfield'],
	currency: ' ', //change to the symbol you would like to display.
	fieldStyle: 'text-align: right;',
	listeners: {
		render: function(cmp) {
			cmp.showCurrency(cmp);
		},
		blur: function(cmp) {
			cmp.showCurrency(cmp);
		},
		focus: function(cmp) {
			cmp.setRawValue(cmp.valueToRaw(cmp.getValue()));
		}
	},
	showCurrency: function(cmp) {
		cmp.setRawValue(Ext.util.Format.currency(cmp.valueToRaw(cmp.getValue()), cmp.currency, 2, false));
	},
	valueToRaw: function(value) {
		return value.toString().replace(/[^0-9.]/g, '');
	},
	rawToValue: function(value) {
		return Ext.util.Format.round(this.valueToRaw(value), 2);
	}
});

