sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, Filter, FilterOperator, JSONModel) {
        "use strict";

        return Controller.extend("com.airbus.zdefaultval.controller.View1", {
            onInit: function () {



            },
            onAfterRendering: function () {

                sap.ui.core.BusyIndicator.show();
                var oModel = new JSONModel();
                oModel.setSizeLimit(10000);
                var oDataModel = this.getOwnerComponent().getModel();

                var sPath = "/NonConfirmanceUsrDefaultsSet";
                oDataModel.read(sPath, {
                    success: function (data) {
                        sap.ui.core.BusyIndicator.hide();
                        if (data.results[0]) {
                            var nctype = data.results[0].NcType;
                            var area = data.results[0].AreaSo;
                            var subcat = data.results[0].SubCategory
                            var notification = data.results[0].NotificationActive

                            this.getView().byId("idInpNcType").setValue(nctype);
                            this.getView().byId("idInpArea").setValue(area);
                            this.getView().byId("idInpSubcat").setValue(subcat);

                            if (notification) {
                                this.getView().byId("idChkBxNA").setSelected(true);
                            }
                            else {
                                this.getView().byId("idChkBxNA").setSelected(false);
                            }
                        }

                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });
            },
            onNCTypeValuhelp: function () {
                if (!this.NCTypeDialog) {
                    this.NCTypeDialog = sap.ui.xmlfragment(this.getView().getId(), "com.airbus.zdefaultval.view.NcTypeValuehelp", this);
                    this.getView().addDependent(this.NCTypeDialog);
                }
                this.NCTypeDialog.open();
            },
            onCloseNcTypeDialog: function () {
                this.NCTypeDialog.close();

            },
            onSelectNcType: function (oEvent) {
                var nctype = oEvent.getParameter("listItem").getBindingContext().getProperty("Nctype");
                this.getView().byId("idInpNcType").setValue(nctype);
                this.NCTypeDialog.close();

            },
            onAreaValuhelp: function () {

                sap.ui.core.BusyIndicator.show();
                var oModel = new JSONModel();
                oModel.setSizeLimit(10000);
                var oDataModel = this.getOwnerComponent().getModel();
                var aFilter = [];
                aFilter.push(new Filter("Key", FilterOperator.EQ, "DAREA"));
                var sPath = "/f4_genericSet"
                oDataModel.read(sPath, {
                    filters: aFilter,
                    success: function (oData, oResult) {
                        sap.ui.core.BusyIndicator.hide();
                        var data = oData.results;
                        oModel.setData(data);
                        this.getView().setModel(oModel, "areaModel");
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });

                if (!this.AreaDialog) {
                    this.AreaDialog = sap.ui.xmlfragment(this.getView().getId(), "com.airbus.zdefaultval.view.AreaValuehelp", this);
                    this.getView().addDependent(this.AreaDialog);
                }
                this.AreaDialog.open();
            },
            onCloseAreaDialog: function () {
                this.AreaDialog.close();
            },
            onSelectArea: function (oEvent) {
                //var area = oEvent.getParameter("listItem").getBindingContext().getProperty("Area");
                var area = oEvent.getParameters("selectedItem").listItem.getBindingContext("areaModel").getProperty("Description");
                this.getView().byId("idInpArea").setValue(area);
                this.AreaDialog.close();
            },
            onSubCatValuhelp: function () {
                var nctype = this.getView().byId("idInpNcType").getValue();
                if(nctype != "")
                {
                    if (!this.SubcatDialog) {
                        this.SubcatDialog = sap.ui.xmlfragment(this.getView().getId(), "com.airbus.zdefaultval.view.SubCategoryValuehelp", this);
                        this.getView().addDependent(this.SubcatDialog);
                    }
                    this.SubcatDialog.open();
    
                    sap.ui.core.BusyIndicator.show();
                    var oModel = new JSONModel();
                    oModel.setSizeLimit(10000);
                    var oDataModel = this.getOwnerComponent().getModel();
                    var aFilter = [];
                   
                    aFilter.push(new Filter("NcType", FilterOperator.EQ, nctype));
                    var sPath = "/Subcat_SoSet"
                    oDataModel.read(sPath, {
                        filters: aFilter,
                        success: function (oData, oResult) {
                            sap.ui.core.BusyIndicator.hide();
                            var data = oData.results;
                            oModel.setData(data);
                            this.getView().setModel(oModel, "subcatModel");
                        }.bind(this),
                        error: function (oError) {
                            sap.ui.core.BusyIndicator.hide();
                            var msg = JSON.parse(oError.responseText).error.message.value;
                            MessageBox.error(msg);
                        }
                    });
                }else{
                    MessageBox.error("Please select NcType");
                }

                
            },
            onCloseSubcatDialog: function () {
                this.SubcatDialog.close();
            },
            onSelectSubcategory: function (oEvent) {
                //var subcat = oEvent.getParameter("listItem").getBindingContext().getProperty("Subcat");
                var subcat = oEvent.getParameters("selectedItem").listItem.getBindingContext("subcatModel").getProperty("Subcat");

                this.getView().byId("idInpSubcat").setValue(subcat);
                this.SubcatDialog.close();
            },
            onPressSave: function () {
                var nctype = this.getView().byId("idInpNcType").getValue();
                var area = this.getView().byId("idInpArea").getValue();
                var subcat = this.getView().byId("idInpSubcat").getValue();
                var notifactchk = this.getView().byId("idChkBxNA").getSelected();

                var notifactive = ""

                if (notifactchk) {
                    notifactive = "X";
                }

                var payload = {
                    NcType: nctype,
                    AreaSo: area,
                    SubCategory: subcat,
                    NotificationActive: notifactive
                };

                var oModel = this.getOwnerComponent().getModel();
                oModel.create("/NonConfirmanceUsrDefaultsSet", payload, {
                    success: function (data) {
                        MessageBox.success("User Default Values Created Successfully.");
                    },
                    error: function (oError) {
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                        //MessageBox.error("An error occurred with statusCode:"+req.statusCode+" and statusText:"+req.statusText+" and with message:"+req.message);
                    }
                });

            },
            onPressCancel: function () {
                window.close();
            }
        });
    });
