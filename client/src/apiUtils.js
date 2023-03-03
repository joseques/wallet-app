export async function getWallets() {
  try {
    const response = await fetch('api/wallet');
    if (!response.ok) {
      throw new Error('Error fetching wallets');
    }
    const data = await response.json();
    return data.sort((a, b) => a.favorite - b.favorite);
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching wallets');
  }
}

export async function addWallet(wallet) {
  try {
    const response = await fetch('api/wallet/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wallet),
    });
    if (!response.ok) {
      throw new Error('Error adding wallet');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function setCustomExchangeRate(exchangeRate) {
  try {
    const response = await fetch('api/eth/exchange-rate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exchangeRate),
    });
    if (!response.ok) {
      throw new Error('Error setting custom exchange rate');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function setWalletFavorite(wallet) {
  try {
    const response = await fetch('api/wallet/toggle-favorite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: wallet.id }),
    });
    console.error(response);
    if (!response.ok) {
      throw new Error('Error setting wallet favorite');
    }
    const data = await response.json();
  } catch (error) {
    console.error(error);
  }
}

export async function getExchangeRate() {
  try {
    const response = await fetch('api/eth/exchange-rate', {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Error getting exchange rate');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
