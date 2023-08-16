import SqsNotification from '@Sqs/SqsNotification';

export class Helpers {
    static isSQS(): boolean {
        return process.env.INTERNAL_CHANNEL === 'sqs';
    }

    static sendNotifyCompleted (integrationId: number, apiUrl: string, entity: string, totalRecords: number, options: any ): boolean {
        if ( Helpers.isSQS() ) {
            const noti = SqsNotification.getInstance(integrationId, apiUrl, options);
            noti.request(entity, totalRecords);
        }

        return true;
    }
}
