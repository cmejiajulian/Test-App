export class CreateTransactionDto {
    amount: number;
  
    customerInfo: {
      name:       string;   // ← nombre en la tarjeta
      cardNumber: string;
      expMonth:   string;   // “02”, “11”… (2 dígitos)
      expYear:    string;   // “2026”      (4 dígitos)
      cvc:        string;
      email:      string;
    };
  
    deliveryInfo: {
      productId: number;
      quantity:  number;
    };
  }
  