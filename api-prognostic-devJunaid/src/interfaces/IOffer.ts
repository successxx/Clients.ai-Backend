export interface IOffer {
  id: number; // Primary key
  offerName: string; // Offer name, cannot be null
  price?: string; // Optional price field
  offerDescription: string; // Description of the offer
  primaryBenefits: string; // Key benefits of the offer
  targetActionURL: string; // Target URL for the action
  userId: number; // Foreign key referencing the User model
}
