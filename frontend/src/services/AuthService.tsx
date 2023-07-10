type FetchData = {
  [x: string]: any;
};

class AuthService {
  url: string;

  def: string;

  constructor() {
    this.url = process.env.url;
    this.def = 'logout';
  }

  async execute(
    method: string,
    path: string,
    data?: FetchData,
    token?: string
  ) {
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Content-Type', 'application/json');
    let body;

    if (data !== null) {
      body = JSON.stringify(data);
    }
    if (token) {
      requestHeaders.set('Authorization', `Token ${token}`);
    }

    const res = await fetch(`${this.url}${path}`, {
      method,
      body,
      headers: requestHeaders,
    });
    const response = await res.json();

    if (!res.ok) {
      throw response;
    } else {
      return response;
    }
  }

  async executeImage(
    method: string,
    path: string,
    data?: FetchData,
    token?: string
  ) {
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set(
      'Content-Type',
      'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
    );
    let body;

    if (data !== null) {
      body = data;
    }
    if (token) {
      requestHeaders.set('Authorization', `Token ${token}`);
    }

    const res = await fetch(`${this.url}${path}`, {
      method,
      body,
      headers: requestHeaders,
    });
    const response = await res.json();

    if (!res.ok) {
      throw response;
    } else {
      return response;
    }
  }

  async register(data: FetchData) {
    return this.execute('POST', 'rest-auth/registration/', data);
  }

  async login(data: FetchData) {
    return this.execute('POST', 'rest-auth/login/', data);
  }

  async logout() {
    localStorage.removeItem('Session');
    return this.def;
  }

  async resetPassword(data: FetchData) {
    return this.execute('POST', 'rest-auth/password/reset/', data);
  }

  async user() {
    if (typeof window === undefined) {
      return null;
    }
    const token = localStorage.getItem('Session');
    return token
      ? this.execute('GET', 'rest-auth/user/', undefined, token)
      : null;
  }

  async changePassword(data: FetchData) {
    if (typeof window === undefined) {
      return null;
    }
    const token = localStorage.getItem('Session');
    return token
      ? this.execute('POST', 'rest-auth/password/change/', data, token)
      : null;
  }

  async updateUserImage(data: FetchData) {
    if (typeof window === undefined) {
      return null;
    }
    const token = localStorage.getItem('Session');
    return token
      ? this.executeImage('PUT', 'rest-auth/user/', data, token)
      : null;
  }

  async updateUserInfos(data: FetchData) {
    if (typeof window === undefined) {
      return null;
    }
    const token = localStorage.getItem('Session');
    return token ? this.execute('PUT', 'rest-auth/user/', data, token) : null;
  }

  async offers() {
    if (typeof window === undefined) {
      return null;
    }
    const token = localStorage.getItem('Session');
    return token ? this.execute('GET', 'p2p/offers/', undefined, token) : null;
  }

  async getOrders() {
    if (typeof window === undefined) {
      return null;
    }
    const token = localStorage.getItem('Session');
    return token ? this.execute('GET', 'p2p/orders/', undefined, token) : null;
  }

  async coinsConverter(from: string | null, to: string | null) {
    if (from === null || to === null) return null;
    return this.execute(
      'GET',
      `wallet/currency-converter/?from=${from}&to=${to}&amount=1`
    );
  }

  async paymentMethods() {
    if (typeof window === undefined) {
      return null;
    }
    const token = localStorage.getItem('Session');
    return token
      ? this.execute('GET', 'p2p/payment-methods/', undefined, token)
      : null;
  }

  async getUserOffers() {
    if (typeof window === undefined) {
      return null;
    }
    const token = localStorage.getItem('Session');
    return token
      ? this.execute('GET', 'p2p/offers/my-offers', undefined, token)
      : null;
  }

  async getUserOfferOrders(offerId: any) {
    if (typeof window === undefined || !offerId) {
      return null;
    }
    const token = localStorage.getItem('Session');
    return token
      ? this.execute(
          'GET',
          `p2p/offers/${offerId}/related-orders`,
          undefined,
          token
        )
      : null;
  }

  async createOffer(data: FetchData) {
    if (typeof window === undefined) {
      return null;
    }
    const token = localStorage.getItem('Session');
    return token ? this.execute('POST', 'p2p/offers/', data, token) : null;
  }

  // @dev closing an existing offre
  async closeOffre(orderId: string) {
    if (typeof window === undefined) {
      return null;
    }
    const token = localStorage.getItem('Session');
    return token
      ? this.execute(
          'DELETE',
          `p2p/offers/${orderId}/cancel/`,
          undefined,
          token
        )
      : null;
  }

  async createOrder(data: FetchData) {
    if (typeof window === undefined) {
      return null;
    }
    const token = localStorage.getItem('Session');
    return token ? this.execute('POST', 'p2p/orders/', data, token) : null;
  }

  async sendMessage(data: FetchData) {
    if (typeof window === undefined) {
      return null;
    }
    const token = localStorage.getItem('Session');
    return token
      ? this.execute(
          'POST',
          `p2p/create-message/${data?.orderId}`,
          { message: data?.message },
          token
        )
      : null;
  }

  async sendFeedback(data: FetchData, orderId: string) {
    if (typeof window === undefined) {
      return null;
    }
    const token = localStorage.getItem('Session');
    return token
      ? this.execute('POST', `p2p/review-order/${orderId}`, data, token)
      : null;
  }

  async userConfirmOrder(orderId: string) {
    if (typeof window === undefined) {
      return null;
    }
    const token = localStorage.getItem('Session');
    return token
      ? this.execute(
          'PUT',
          `p2p/orders/${orderId}/user-confirm/`,
          undefined,
          token
        )
      : null;
  }

  async ownerConfirmOrder(orderId: string) {
    if (typeof window === undefined) {
      return null;
    }
    const token = localStorage.getItem('Session');
    return token
      ? this.execute(
          'PUT',
          `p2p/orders/${orderId}/owner-confirm/`,
          undefined,
          token
        )
      : null;
  }

  async createUserPaymentMethod(data: FetchData) {
    if (typeof window === undefined) {
      return null;
    }
    const token = localStorage.getItem('Session');
    return token
      ? this.execute('POST', 'p2p/my-payment-methods/', data, token)
      : null;
  }

  async getUserPaymentMethod() {
    if (typeof window === undefined) {
      return null;
    }
    const token = localStorage.getItem('Session');
    return token
      ? this.execute('GET', 'p2p/my-payment-methods/', undefined, token)
      : null;
  }

  async createBtcTransaction(data: FetchData) {
    if (typeof window === undefined) {
      return null;
    }
    const token = localStorage.getItem('Session');
    return token
      ? this.execute('POST', 'wallet/btc_transactions/', data, token)
      : null;
  }

  async createEthTransaction(data: FetchData) {
    if (typeof window === undefined) {
      return null;
    }
    const token = localStorage.getItem('Session');
    return token
      ? this.execute('POST', 'wallet/ether_transactions/', data, token)
      : null;
  }

  async getUserTransactions() {
    if (typeof window === undefined) {
      return null;
    }
    const token = localStorage.getItem('Session');
    if (!token) return;

    const btcTransactions =
      (await this.execute(
        'GET',
        'wallet/btc_transactions/',
        undefined,
        token
      )) ?? [];

    const ethTransactions =
      (await this.execute(
        'GET',
        'wallet/ether_transactions/',
        undefined,
        token
      )) ?? [];

    return btcTransactions.concat(ethTransactions);
  }

  async getArbitrageTransactions() {
    if (typeof window === undefined) {
      return null;
    }
    const token = localStorage.getItem('Session');

    return token
      ? this.execute(
          'GET',
          'arbitrage/arbitrage-transactions/',
          undefined,
          token
        )
      : null;
  }

  async createArbitrageTransaction(data: FetchData) {
    if (typeof window === undefined) {
      return null;
    }
    const token = localStorage.getItem('Session');

    return token
      ? this.execute('POST', 'arbitrage/arbitrage-transactions/', data, token)
      : null;
  }

  async getFee(data: FetchData) {
    if (typeof window === undefined) {
      return null;
    }

    return this.execute(
      'GET',
      `wallet/estimate-transaction-fees?to=${data?.to}&amount=${data?.amount}&currency=${data?.currency}`
    );
  }

  // @dev Subscribe on Arbitrage
  async subscribeArbitrage() {
    if (typeof window === undefined) {
      return null;
    }
    const token = localStorage.getItem('Session');
    return token
      ? this.execute(
          'POST',
          'arbitrage/create-arbitrage-subscription/',
          undefined,
          token
        )
      : null;
  }

  // @dev request withdraw
  async requestWithdraw(TransactionId: string) {
    if (typeof window === undefined) {
      return null;
    }
    const token = localStorage.getItem('Session');
    return token
      ? this.execute(
          'PUT',
          `arbitrage/arbitrage-transactions/${TransactionId}/request-withdraw/`,
          undefined,
          token
        )
      : null;
  }
}

export default new AuthService();
