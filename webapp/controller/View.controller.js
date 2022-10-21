sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator"
], function(Controller, MessageToast, MessageBox, BusyIndicator) {
	"use strict";

	return Controller.extend("zui5sd_leadszui5sd_leads.controller.View", {
		onInit: function() {
			this.getView().byId("lcnpj").setVisible(true);
			this.getView().byId("icnpj").setVisible(true);
			this.getView().byId("lcpf").setVisible(false);
			this.getView().byId("icpf").setVisible(false);
			//			this.getView().byId("itaxjurcode").setSuggestionRowValidator(this.suggestionRowValidator);
		},

		onSelectJ: function() {
			this.getView().byId("lcnpj").setVisible(true);
			this.getView().byId("icnpj").setVisible(true);
			this.getView().byId("lcpf").setVisible(false);
			this.getView().byId("icpf").setVisible(false);
			this.getView().byId("lname1").setText("Razão Social");
			this.getView().byId("iname1").setPlaceholder("Informe a razão social...");
		},

		onSelectF: function() {
			this.getView().byId("lcpf").setVisible(true);
			this.getView().byId("icpf").setVisible(true);
			this.getView().byId("lcnpj").setVisible(false);
			this.getView().byId("icnpj").setVisible(false);
			this.getView().byId("lname1").setText("Nome");
			this.getView().byId("iname1").setPlaceholder("Informe o nome...");
		},
		/*
				suggestionRowValidator: function (oColumnListItem) {
					var aCells = oColumnListItem.getCells();
					return new sap.ui.core.Item({
						key: aCells[0].getText(),
						text: aCells[1].getText()
					});
				},
		*/
		onSuggest: function(oEvent) {
			var sValue = oEvent.getParameters().suggestValue,
				aFilters = [];
			if (sValue) {
				aFilters.push(new sap.ui.model.Filter({
					filters: [
						new sap.ui.model.Filter("city", sap.ui.model.FilterOperator.Contains, sValue.toUpperCase()),
						new sap.ui.model.Filter("city", sap.ui.model.FilterOperator.Contains, sValue.toLowerCase()),
						new sap.ui.model.Filter("region", sap.ui.model.FilterOperator.Contains, sValue.toUpperCase()),
						new sap.ui.model.Filter("region", sap.ui.model.FilterOperator.Contains, sValue.toLowerCase())
					],
					and: false
				}));
			}
			var oSource = oEvent.getSource();
			var oBinding = oSource.getBinding("suggestionRows");
			oBinding.filter(aFilters);
			oBinding.attachEventOnce("dataReceived", function() {
				oSource.suggest();
			});
		},

		onSuggestionItemTaxjurcode: function(oEvent) {
			var aCells = oEvent.getParameter("selectedRow").getCells();

			this.getView().byId("icity").setValue(aCells[0].getText() + "/" + aCells[1].getText());
		},

		onToggle: function(oEvent) {
			if (oEvent.getSource().getPressed()) {
				oEvent.getSource().setType("Accept");
				this.getView().byId("irating").setValue(this.getView().byId("irating").getValue() + 1);
				MessageToast.show("Possui " + oEvent.getSource().getText());
			} else {
				oEvent.getSource().setType("Reject");
				this.getView().byId("irating").setValue(this.getView().byId("irating").getValue() - 1);
				MessageToast.show("Não possui " + oEvent.getSource().getText());
			}
		},

		onSave: function(oEvent) {
			/*
						if (this.getView().byId("rdbJ").getSelected(true) && this.getView().byId("icnpj").getValue() === "") {
							MessageBox.error("CNPJ não informado!");
							this.getView().byId("icnpj").setValueState(sap.ui.core.ValueState.Error);
							return;
						}

						if (this.getView().byId("rdbF").getSelected(true) && this.getView().byId("icpf").getValue() === "") {
							MessageBox.error("CPF não informado!");
							this.getView().byId("icpf").setValueState(sap.ui.core.ValueState.Error);
							return;
						}

						if (this.getView().byId("iname1").getValue() === "") {
							switch (true) {
								case this.getView().byId("rdbJ").getSelected():
									MessageBox.error("Razão Social não informado!");
									break;
								case this.getView().byId("rdbF").getSelected():
									MessageBox.error("Nome não informado!");
									break;
							}
							this.getView().byId("iname1").setValueState(sap.ui.core.ValueState.Error);
							return;
						}
			*/
			BusyIndicator.show(0);

			var oLead = {
				cgc: (this.getView().byId("rdbJ").getSelected() ? this.getView().byId("icnpj").getValue() : this.getView().byId("icpf").getValue()),
				name: this.getView().byId("iname1").getValue(),
				region: this.getView().byId("icity").getValue().split("/")[1],
				city: this.getView().byId("icity").getValue().split("/")[0],
				phone: this.getView().byId("iphone").getValue(),
				email: this.getView().byId("iemail").getValue()				
			};

			var oModel = this.getView().getModel("leadSRV");
			oModel.create("/leadSet()", oLead, {
				success: this.onSuccess.bind(this)
					//				error: this.onError.bind(this)
			});
		},

		onSuccess: function(oEvent) {

			BusyIndicator.hide();

			MessageBox.error(oEvent.message);
		}

	});
});