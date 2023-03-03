import './App.css';
import {
  getWallets,
  addWallet,
  setCustomExchangeRate,
  setWalletFavorite,
  getExchangeRate,
} from './apiUtils';
import {
  formatCurrency,
  ethBalanceToFiat,
  getRateFromCurrency,
} from './currencyUtils';
import { useEffect, useState } from 'react';

function App() {
  const [wallets, setWallets] = useState(null);
  const [newWallet, setNewWallet] = useState({
    address: '',
  });
  const [exchangeRate, setExchangeRate] = useState(null);
  const [isEditingExchange, setIsEditingExchange] = useState(false);
  const [exchangeRateCurrency, setExchangeRateCurrency] = useState('USD');
  const [newExchangeRate, setNewExchangeRate] = useState(null);

  useEffect(() => {
    updateWallets();
    updateExchangeRate();
  }, []);

  async function updateWallets() {
    const updatedWallets = await getWallets();
    setWallets(updatedWallets);
  }

  async function updateExchangeRate() {
    if (!newExchangeRate) {
      const updatedExchangeRate = await getExchangeRate();
      setExchangeRate(updatedExchangeRate);
    }
  }

  async function handleAddWallet() {
    try {
      await addWallet(newWallet);
      await updateWallets();
      setNewWallet({ address: '', favorite: false });
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSetFavorite(wallet) {
    console.log({wallet});
    try {
      await setWalletFavorite(wallet);
      await updateWallets();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSetExchangeRate() {
    if (!newExchangeRate) return;
    try {
      await setCustomExchangeRate(newExchangeRate);
      setExchangeRate(newExchangeRate);
      setIsEditingExchange(false);
    } catch (error) {
      console.error(error);
    }
  }

  function cancelCustomExchangeRate() {
    setIsEditingExchange(false);
    setNewExchangeRate(null);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>Exchange Rate</h2>
        <div className="exchange-rate">
          <div className="rate-container">
            <span>Current Rate</span>
            <select onChange={(e) => setExchangeRateCurrency(e.target.value)}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
            {isEditingExchange ? (
              <>
                <div className="rate-control-buttons">
                  <button onClick={cancelCustomExchangeRate}>✖</button>
                  <button onClick={handleSetExchangeRate}>✔</button>
                </div>
                <span>1 ETH</span>
                <span>↓</span>
                <input
                  type="number"
                  step="0.01"
                  onChange={(e) =>
                    !!e.target.value &&
                    setNewExchangeRate({ ethusd: e.target.value })
                  }
                  placeholder={getRateFromCurrency(
                    exchangeRate,
                    exchangeRateCurrency,
                  )}
                />
              </>
            ) : (
              <>
                <button onClick={() => setIsEditingExchange(true)}>🖉</button>
                <span>1 ETH</span>
                <span>↓</span>
                <p>
                  {formatCurrency(
                    getRateFromCurrency(exchangeRate, exchangeRateCurrency),
                    exchangeRateCurrency,
                  )}
                </p>
              </>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2>Add Wallet</h2>
          <input
            type="text"
            placeholder="Address"
            value={newWallet.address}
            onChange={(e) => setNewWallet({ address: e.target.value })}
          />
          <button onClick={handleAddWallet}>Add</button>
        </div>
        <div className="wallets-list">
          <h2>Wallets</h2>
          <span>(Click on star to favorite wallet)</span>
          {wallets?.length ? (
            <ul>
              {wallets.map((wallet) => (
                <li key={wallet.id}>
                  {wallet.isOld && <p className="old-wallet">Wallet is old!</p>}
                  <span>{wallet.address}</span>
                  <span
                    className="wallet-favorite"
                    onClick={() =>
                      handleSetFavorite({
                        ...wallet,
                        favorite: !wallet.favorite,
                      })
                    }
                  >
                    {wallet.favorite ? '★' : '☆'}
                  </span>
                  <p>
                    Balance:{' '}
                    {formatCurrency(
                      ethBalanceToFiat(
                        wallet.balance,
                        getRateFromCurrency(exchangeRate, exchangeRateCurrency),
                      ),
                      exchangeRateCurrency,
                    )}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No wallets were added yet</p>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
