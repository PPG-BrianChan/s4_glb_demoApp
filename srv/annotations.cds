using main from './s4_glb_demoApp';

annotate main.purchaseOrder with @odata.draft.enabled : true;

annotate main.purchaseOrder with {
    ID                    @title : '{i18n>ID}'
                          @readonly;
    poDocumentNumber      @title : '{i18n>poDocumentNumber}'
                          @readonly;
    supplier              @title : '{i18n>supplier}';
    amount                @title : '{i18n>amount}';
    currency              @title : '{i18n>currency}';
    requestedDeliveryDate @title : '{i18n>requestedDeliveryDate}';
    @Common.ValueListWithFixedValues : true
    @Common.ValueList                : {
        $Type          : 'Common.ValueListType',
        Label          : 'Status',
        CollectionPath : 'status',
        Parameters     : [
            {
                $Type             : 'Common.ValueListParameterInOut',
                LocalDataProperty : 'status_code',
                ValueListProperty : 'code',
            },
            {
                $Type             : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'description',
            }
        ]
    }
    @Common                          : {
        Text            : status.description,
        TextArrangement : #TextOnly
    }
    @title                           : '{i18n>status}'
    @readonly
    status;

    createdBy             @title : '{i18n>CreatedBy}';
    createdAt             @title : '{i18n>CreatedAt}';
    modifiedBy            @title : '{i18n>ModifiedBy}';
    modifiedAt            @title : '{i18n>ModifiedAt}';
};

annotate main.status with {
    @Common : {
        Text            : description,
        TextArrangement : #TextOnly
    }
    code
}

annotate main.purchaseOrder with
@UI : {
    HeaderInfo          : {
        TypeName       : '{i18n>PurchaseDocument}',
        TypeNamePlural : '{i18n>PurchaseDocuments}',
        Title          : {Value : '{i18n>PurchaseDocument}'},
        Description    : {Value : poDocumentNumber}
    },
    SelectionFields     : [
        poDocumentNumber,
        supplier,
        status_code
    ],
    Facets              : [
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>Details}',
            Target : '@UI.FieldGroup#Details'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>Admin}',
            Target : '@UI.FieldGroup#Admin'
        }
    ],

    FieldGroup #Details : {Data : [
        {Value : poDocumentNumber},
        {Value : supplier},
        {Value : requestedDeliveryDate},
        {Value : currency_code},
        {Value : amount},
        {Value : status_code}
    ]},

    FieldGroup #Admin   : {Data : [
        {Value : ID},
        {Value : createdBy},
        {Value : createdAt},
        {Value : modifiedBy},
        {Value : modifiedAt}
    ]},

    LineItem            : [
        {
            $Type  : 'UI.DataFieldForAction',
            Action : 'main.releaseOrder',
            Label  : 'Release Order'
        },
        {Value : poDocumentNumber},
        {Value : supplier},
        {Value : requestedDeliveryDate},
        {Value : currency_code},
        {Value : amount},
        {Value : status_code},
        {Value : createdBy},
        {Value : createdAt}
    ]
};
