
export class Helpers {
    static isSQS(): boolean {
        return process.env.INTERNAL_CHANNEL === 'sqs';
    }

    static sendNotifyCompleted (integrationId: number, apiUrl: string, entity: string, totalRecords: number, options: any ): boolean {
        return true;
    }
}
