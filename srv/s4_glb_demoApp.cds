using s4_glb_demoApp as db from '../db/data-model';

service main {
    @Capabilities.Insertable : true
    entity purchaseOrder as projection on db.purchaseOrder actions {
        action releaseOrder()
    };

    entity status        as projection on db.status;
    action updateApprovalStatus(orderID : String, decision : String);
}
