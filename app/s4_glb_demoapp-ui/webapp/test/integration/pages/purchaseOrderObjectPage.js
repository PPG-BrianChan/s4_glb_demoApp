sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 's4glbdemoApp.s4glbdemoappui',
            componentId: 'purchaseOrderObjectPage',
            entitySet: 'purchaseOrder'
        },
        CustomPageDefinitions
    );
});