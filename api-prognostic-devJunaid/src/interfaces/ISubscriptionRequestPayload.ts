export interface ISubscriptionRequestPayload {
  userId: number;
  plan: "monthly" | "yearly";
  isTrial: boolean;
}
