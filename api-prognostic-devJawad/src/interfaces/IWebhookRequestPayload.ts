export interface IWebhookRequestPayload {
  id: string;
  object: string;
  api_version: string;
  created: number;
  data: {
    object: {
      id: string;
      amount_paid: number;
      created: number;
      metadata: {
        userId: string;
      };
      subscription_details: {
        metaData: {
          userId: string;
        };
      };
    };
  };
  type: string;
}
