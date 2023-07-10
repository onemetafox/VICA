import { CoinsTypes } from './coins';

export type PaymentMethod = { id: number; name: string; type: string };
export type Offers = {
  amount: string;
  available_amount: number;
  created_at: Date;
  currency: CoinsTypes;
  current_trade_limit_max: number;
  current_trade_limit_min: number;
  id: number;
  instructions: string;
  label: string;
  payment_method: number;
  price: string;
  reached_amount: number;
  status: string;
  terms: string;
  time_limit: 15;
  trade_limit_max: string;
  trade_limit_min: string;
  type: 'BUY' | 'SELL';
  updated_at: Date;
  username: string;
  user_country: string;
};
