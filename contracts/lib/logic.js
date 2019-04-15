/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/* global getParticipantRegistry emit */


/**
 * A Member grants access to their record to another Member.
 * @param {org.ibm.dms.AuthorizeAccess} authorize - the authorize to be processed
 * @transaction
 */
async function authorizeAccess(authorize) {  // eslint-disable-line no-unused-vars

    const me = getCurrentParticipant();
    console.log('**** AUTH: ' + me.getIdentifier() + ' granting access to ' + authorize.memberId );

    if(!me) {
        throw new Error('A participant/certificate mapping does not exist.');
    }

    // if the member is not already authorized, we authorize them
    let index = -1;

    if(!me.authorized) {
        me.authorized = [];
    }
    else {
        index = me.authorized.indexOf(authorize.memberId);
    }

    if(index < 0) {
        me.authorized.push(authorize.memberId);

        // emit an event
        const event = getFactory().newEvent('org.ibm.dms', 'MemberEvent');
        event.memberTransaction = authorize;
        emit(event);

        // persist the state of the member
        const memberRegistry = await getParticipantRegistry('org.ibm.dms.Member');
        await memberRegistry.update(me);
    }
}
/**
 * A Regulator approve documents of member.
 * @param {org.ibm.dms.ApproveDocument} authorize - the authorize to be processed
 * @transaction
 */
async function ApproveDocument(authorize) {  // eslint-disable-line no-unused-vars

    const me = getCurrentParticipant();
    console.log('**** AUTH: ' + me.getIdentifier() + ' granting access to ' + authorize.memberId );

    if(!me) {
        throw new Error('A participant/certificate mapping does not exist.');
    }

    // if the member is not already authorized, we authorize them
    let index = -1;

    if(!me.authorized) {
        me.authorized = [];
    }
    else {
        index = me.authorized.indexOf(authorize.memberId);
    }

    if(index < 0) {
        me.authorized.push(authorize.memberId);

        // emit an event
        const event = getFactory().newEvent('org.ibm.dms', 'MemberEvent');
        event.memberTransaction = authorize;
        emit(event);

        // persist the state of the member
        const memberRegistry = await getParticipantRegistry('org.ibm.dms.Member');
        await memberRegistry.update(me);
    }
}

/**
 * A Member revokes access to their record from another Member.
 * @param {org.ibm.dms.RevokeAccess} revoke - the RevokeAccess to be processed
 * @transaction
 */
async function revokeAccess(revoke) {  // eslint-disable-line no-unused-vars

    const me = getCurrentParticipant();
    console.log('**** REVOKE: ' + me.getIdentifier() + ' revoking access to ' + revoke.memberId );

    if(!me) {
        throw new Error('A participant/certificate mapping does not exist.');
    }

    // if the member is authorized, we remove them
    const index = me.authorized ? me.authorized.indexOf(revoke.memberId) : -1;

    if(index>-1) {
        me.authorized.splice(index, 1);

        // emit an event
        const event = getFactory().newEvent('org.ibm.dms', 'MemberEvent');
        event.memberTransaction = revoke;
        emit(event);

        // persist the state of the member
        const memberRegistry = await getParticipantRegistry('org.ibm.dms.Member');
        await memberRegistry.update(me);
    }
}


/**
* A transaction processor function to change docAIApprovalStatus.
* @param {org.ibm.dms.ChangeDocumentStatusByAITransaction} tx
* @transaction
*/

async function changeDocumentStatusByAITransaction(tx){

    try{
    const assetRegistry = await getAssetRegistry('org.ibm.dms' + '.Document');
    var myDocument = await assetRegistry.get(tx.documentId);
    let oldValue = myDocument.docAIApprovalStatus;
    myDocument.docAIApprovalStatus=tx.docAIApprovalStatus;
    await assetRegistry.update(myDocument);
    let event = getFactory().newEvent('org.ibm.dms', 'ChangeDocumentStatusByAIEvent');
    event.changeDocumentStatusByAITransaction = tx;
    emit(event);
    return "success";
    }catch(err) {
        //print and return error
        console.log(err);
        throw new Error(err.message);
      }
}

/**
* A transaction processor function to add a new document to asset registry.
* @param {org.ibm.dms.AddDocumentTransaction} tx
* @transaction
*/
async function addDocumentTransaction(tx){
    try{
        console.log('addDocumentTransaction IN ');
        console.log(
            'tx.documentId:'+tx.documentId+
            'tx.docName:'+tx.docName+
            'tx.documentDescription:'+tx.documentDescription+
            'tx.docStatus:'+tx.docStatus+
            'tx.docAIApprovalStatus:'+tx.docAIApprovalStatus+
            'tx.docFinalApproval:'+tx.docFinalApproval+
            'tx.docPath:'+tx.docPath+
            'tx.originalname:'+tx.originalname+
            'tx.mimetype:'+tx.mimetype+
            'tx.size:'+tx.size+
            'tx.accountNumber:'+tx.owneraccnum
        );
        const assetRegistry = await getAssetRegistry('org.ibm.dms' + '.Document');
        const document = getFactory().newResource('org.ibm.dms', 'Document', tx.documentId);
        document.documentId = tx.documentId;
        document.docName = tx.docName;
        document.documentDescription = tx.documentDescription;
        document.docStatus = tx.docStatus;
        document.docAIApprovalStatus = tx.docAIApprovalStatus;
        document.docFinalApproval = tx.docFinalApproval;
        document.docPath = tx.docPath;
        document.originalname = tx.originalname;
        document.mimetype = tx.mimetype;
        document.size = tx.size;
        document.owner = getFactory().newRelationship('org.ibm.dms', 'Member', tx.owneraccnum);
        await assetRegistry.add(document);

        let event = getFactory().newEvent('org.ibm.dms', 'AddDocumentEvent');
        event.addDocumentTransaction = tx;
        emit(event);

        console.log('addDocumentTransaction returning success');
        return "success";
  
    }catch(err) {
        //print and return error
        console.log('addDocumentTransaction err : '+err);
        throw new Error(err.message);
      }
}

/**
* A transaction processor function to add a new document to asset registry.
* @param {org.ibm.dms.ChangeDocumentStatusByRegulatorTransaction} tx
* @transaction
*/

async function changeDocumentStatusByRegulatorTransaction(tx){
    try{
        console.log('changeDocumentStatusByRegulatorTransaction IN ');
        const assetRegistry = await getAssetRegistry('org.ibm.dms' + '.Document');
        const document = await assetRegistry.get(tx.documentId);
        document.docStatus=tx.docStatus;
        document.docFinalApproval=tx.docStatus;
        await assetRegistry.update(document);

        let event = getFactory().newEvent('org.ibm.dms', 'ChangeDocumentStatusByRegulatorEvent');
        event.changeDocumentStatusByRegulatorTransaction = tx;
        emit(event);

        console.log('changeDocumentStatusByRegulatorTransaction returning success');

        return "success";
  
    }catch(err) {
        //print and return error
        console.log('changeDocumentStatusByRegulatorTransaction err : '+err);
        throw new Error(err.message);
      }
}

/**
* A transaction processor function to add a new document to asset registry.
* @param {org.ibm.dms.GetDocumentTxnsByIdTransaction} tx
* @transaction
*/

async function getDocumentTxnsByIdTransaction(tx){
        //fetch ledger txns
        const nativeKey = getNativeAPI().createCompositeKey('Asset:org.ibm.dms.Document', [tx.documentId]);
        const iterator = await getNativeAPI().getHistoryForKey(nativeKey);
        let results = [];
        let res = {done : false};
        while (!res.done) {
            res = await iterator.next();
    
            if (res && res.value && res.value.value) {
                let val = res.value.value.toString('utf8');
                if (val.length > 0) {
                    results.push(JSON.parse(val));
                }
            }
            if (res && res.done) {
                try {
                    iterator.close();
                }
                catch (err) {
                }
            }
        }
return JSON.stringify(results);
}