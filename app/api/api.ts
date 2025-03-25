const BASE_URL = 'https://wallet-demo-435v2.ondigitalocean.app';
const API_KEY = 'TxDONKnVZslnzVq2kZHoxQt9715WTZHyYVcbij0nQQTKHKIFVYmRGZtOWUP8SnEp';

export interface BalanceResponse {
  status: {
    code: string;
    error: boolean;
    error_message: string;
  };
  balance: number;
  currency: string;
}

export interface TransactionResponse extends BalanceResponse {
  transaction_id: string;
  internal_transaction_id: string;
  free_spins: number;
}


export const fetchBalance = async (customerId: string): Promise<BalanceResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/user-wallet/v1/gaming/sessions/balance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY,
      },
      body: JSON.stringify({
        provider: 'Hogamba',
        customer: {
          id: customerId,
          token: '40d80626-e63d-44fa-a801-595cc4624ed3'
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch balance: ${response.status}`);
    }
    
    const data: BalanceResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
};


export const placeBet = async (customerId: string, betAmount: number): Promise<TransactionResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/user-wallet/v1/gaming/transactions/debit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY,
      },
      body: JSON.stringify({
        transaction: {
          provider: 'Hogamba',
          customer: {
            id: customerId,
            token: '40d80626-e63d-44fa-a801-595cc4624ed3',
            session_id: '908734530-gh53-4535-tm51-fd1486nr352'
          },
          game_id: 'hogamba_mines',
          spin_id: `spin_${Date.now()}`,
          external_id: `external_${Date.now()}`,
          amount: betAmount,
          currency: 'EUR'
        },
        free_spin: false
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to place bet: ${response.status}`);
    }
    
    const data: TransactionResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error placing bet:', error);
    throw error;
  }
};


export const processCashout = async (customerId: string, cashoutAmount: number): Promise<TransactionResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/user-wallet/v1/gaming/transactions/credit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY,
      },
      body: JSON.stringify({
        transaction: {
          provider: 'Hogamba',
          customer: {
            id: customerId,
            token: '40d80626-e63d-44fa-a801-595cc4624ed3',
            session_id: '908734530-gh53-4535-tm51-fd1486nr352'
          },
          game_id: 'hogamba_mines',
          spin_id: `spin_${Date.now()}`,
          external_id: `external_${Date.now()}`,
          amount: cashoutAmount,
          currency: 'EUR'
        },
        jackpot: false
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to process cashout: ${response.status}`);
    }
    
    const data: TransactionResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error processing cashout:', error);
    throw error;
  }
};