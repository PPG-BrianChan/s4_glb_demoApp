sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 's4glbdemoApp.s4glbdemoappui',
            componentId: 'purchaseOrderList',
            entitySet: 'purchaseOrder'
        },
        CustomPageDefinitions
    );
});