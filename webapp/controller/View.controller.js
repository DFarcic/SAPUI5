sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"sap/m/Dialog"
], function(Controller, MessageToast, MessageBox, BusyIndicator, Dialog) {
	"use strict";

	return Controller.extend("zui5sd_leadszui5sd_leads.controller.View", {
		onInit: function() {
			this.getView().byId("lcnpj").setVisible(true);
			this.getView().byId("icnpj").setVisible(true);
			this.getView().byId("lcpf").setVisible(false);
			this.getView().byId("icpf").setVisible(false);
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

		onPhoto: function(oEvent) {

			var that = this;

			this.dialog = new Dialog({
				title: "Tire uma foto!",
				state: sap.ui.core.ValueState.Information,
				beginButton: new sap.m.Button({
					type: "Accept",
					icon: "sap-icon://camera",
					press: function(oEvent) {
						that.imageValue = document.getElementById("player");
						that.dialog.close();
					}
				}),
				content: [
					new sap.ui.core.HTML({
						content: "<video id='player' autoplay></video>"
					})
				],
				endButton: new sap.m.Button({
					type: "Reject",
					icon: "sap-icon://cancel",
					press: function(oEvent) {
						that.dialog.close();
					}
				})
			});
			this.getView().addDependent(this.dialog);
			this.dialog.open();
			this.dialog.attachBeforeClose(this.setImage, this);

			var handleSuccess = function(stream) {
				player.srcObject = stream;
			};

			navigator.mediaDevices.getUserMedia({
				video: true
			}).then(handleSuccess);

		},

		setImage: function() {

			var oVBox = this.getView().byId("iphoto");
			var items = oVBox.getItems();
			var snapId = 'rk-' + items.length;
			var textId = snapId + '-text';
			var imageVal = this.imageVal;
			//Set that as a canvas  element on HTML page
			var oCanvas = new sap.ui.core.HTML({
				content: "<canvas id='" + snapId + "' width='320px' heght='320px'" +
					"style='2px solid red '></canvas>" +
					"<label id='" + textId + "'>" + this.attachName + "</label>"
			});
			oVBox.addItem(oCanvas);
			oCanvas.addEventDelegate({
				onAfterRendering: function() {
					var snapShotCanvas = document.getElementById(snapId);
					var oContext = snapShotCanvas.getContext('2d');
					oContext.drawImage(imageVal, 0, 0, snapShotCanvas.width, snapShotCanvas.height);
				}
			});

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
						
						if (this.getView().byId("icity").getValue() === "") {
							MessageBox.error("Cidade/Estado não informado!");
							this.getView().byId("icity").setValueState(sap.ui.core.ValueState.Error);
							return;
						}						

						if (this.getView().byId("iphone").getValue() === "") {
							MessageBox.error("Telefone não informado!");
							this.getView().byId("iphone").setValueState(sap.ui.core.ValueState.Error);
							return;
						}	

						if (this.getView().byId("iemail").getValue() === "") {
							MessageBox.error("E-mail não informado!");
							this.getView().byId("iemail").setValueState(sap.ui.core.ValueState.Error);
							return;
						}	
			*/
			BusyIndicator.show(0);

			var oLead = {
				cgc: (this.getView().byId("rdbJ").getSelected() ? this.getView().byId("icnpj").getValue() : this.getView().byId("icpf").getValue()),
				type: (this.getView().byId("rdbJ").getSelected() ? "J" : "F"),
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
