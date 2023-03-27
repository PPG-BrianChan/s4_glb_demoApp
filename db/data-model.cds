namespace s4_glb_demoApp;

using {
    cuid,
    managed,
    Currency
} from '@sap/cds/common';


entity purchaseOrder  : cuid, managed{
    poDocumentNumber : String(10);
    supplier : String;
    requestedDeliveryDate : Date;
    currency : Currency;
    amount : Decimal(15, 2);
    status : Association to one status
}

entity status {
    key code : String(1);
    description : String;
}