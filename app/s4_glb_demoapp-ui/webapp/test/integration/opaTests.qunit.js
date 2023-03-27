sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        's4glbdemoApp/s4glbdemoappui/test/integration/FirstJourney',
		's4glbdemoApp/s4glbdemoappui/test/integration/pages/purchaseOrderList',
		's4glbdemoApp/s4glbdemoappui/test/integration/pages/purchaseOrderObjectPage'
    ],
    function(JourneyRunner, opaJourney, purchaseOrderList, purchaseOrderObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('s4glbdemoApp/s4glbdemoappui') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThepurchaseOrderList: purchaseOrderList,
					onThepurchaseOrderObjectPage: purchaseOrderObjectPage
                }
            },
            opaJourney.run
        );
    }
);