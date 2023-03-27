const { executeHttpRequest } = require('@sap-cloud-sdk/core');

module.exports = (srv) => {
    const { purchaseOrder } = srv.entities;

    srv.before('CREATE', 'purchaseOrder', async (req) => {
        var docno = 0;
        const maxLength = 9;
        const query_get_docno = SELECT.one
            .from(purchaseOrder)
            .columns("max(poDocumentNumber) as docno");
        const result = await cds.run(query_get_docno);
        const jsonobj = JSON.parse(JSON.stringify(result));
        if (jsonobj.docno != null) {
            docno = parseInt(jsonobj.docno) + 1
        };
        console.log(String(docno).length);
        if (String(docno).length < 10) {
            docno = `1${'0'.repeat(Math.max(0, maxLength - String(docno).length))}${docno}`.slice(-maxLength - 1)
        }
        req.data.poDocumentNumber = JSON.stringify(eval(docno));
        req.data.status_code = `O`;
    })

    srv.after('CREATE', 'purchaseOrder', async (req) => {
        console.log(`Creating workflow for PO: ${req.poDocumentNumber}`)
        const amountNum = parseFloat(req.amount);
        const payload = {
            "definitionId": "eu10.s4-dev-7ydmdsrh.s4glbdemoprocess.purchaseOrderApprovalProcess",
            "context": {
                "podocumentnumber": req.poDocumentNumber,
                "supplier": req.supplier,
                "requesteddeliverydate": req.requestedDeliveryDate,
                "currency": req.currency_code,
                "amount": amountNum,
                "approvalsubject": `PO Approval Request:${req.poDocumentNumber}`,
                "recipient": "cchan@ppg.com",
                "const_approve": "Approve",
                "const_reject": "Reject",
                "poguid": req.ID
            }
        }
        try {
            const result = await executeHttpRequest(
                {
                    destinationName: 'spa_process_trigger_destination'
                },
                {
                    method: 'POST',
                    data: payload,
                    headers: {
                        'content-type': 'application/json'
                    }
                }
            )
            console.log('Success:', result.data)
        } catch (error) {
            console.log(error.message)
        }
    })

    srv.on('updateApprovalStatus', async (req) => {
        console.log(`Received request from workflow with data:${req.data}`)
        var updateStatus;
        if (req.data.decision == 'Approve') {
            updateStatus = 'A'
        } else {
            updateStatus = 'R'
        }
        try {
            const query_update_status = UPDATE(purchaseOrder, { ID: req.data.orderID }).set({ status_code: updateStatus });
            await cds.run(query_update_status)
        } catch (error) {
            console.log(error.message);
        }
    })

    srv.on('releaseOrder', async (req) => {
        const query_getData = SELECT.one.from(purchaseOrder).columns('poDocumentNumber', 'status_code').where({ ID: req.params[0].ID })
        const getResult = await cds.run(query_getData);

        if (getResult !== null) {
            if (getResult.status_code !== 'A') {
                req.error(`Error when releasing PO ${getResult.poDocumentNumber}: Not allowed due to status`)
            } else {
                const query_releaseOrder = UPDATE(purchaseOrder, { ID: req.params[0].ID }).set({ status_code: 'C' });
                const updateResult = await cds.run(query_releaseOrder);
            }
        }
    })
}