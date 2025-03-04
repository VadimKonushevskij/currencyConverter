import React, { useEffect, useState, useRef } from "react";
import { Block } from "./Block";
import "./index.css";

const base = "BYN";
const symbols = ["USD,EUR,PLN,RUB,BYN"];
let myHeaders = new Headers();
myHeaders.append("apikey", "7gvPGEP1shEea39fMj3g3JwMpvkkvpFD");
const requestOptions = {
  method: "GET",
  redirect: "follow",
  headers: myHeaders,
};

function App() {
  const [fromCurrencyType, setFromCurrencyType] = useState("BYN");
  const [toCurrencyType, setToCurrencyType] = useState("USD");
  const [fromPrice, setFromPrice] = useState(0);
  const [toPrice, setToPrice] = useState(1);

  const ratesRef = useRef({});

  useEffect(() => {
    fetch(
      `https://api.apilayer.com/exchangerates_data/latest?symbols=${symbols}&base=${base}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((json) => {
        ratesRef.current = json.rates;
        onToPriceChange(1);
      })
      .catch((err) => {
        console.warn(err);
        alert("Не удалось загрузить актуальные курсы валют!");
      });
  }, []);

  function onFromPriceChange(value) {
    if (fromCurrencyType === toCurrencyType) {
      setFromPrice(value);
      setToPrice(value);
      return;
    }
    const price = value / ratesRef.current[fromCurrencyType];
    const result = price * ratesRef.current[toCurrencyType];
    setFromPrice(value);
    setToPrice(parseFloat(result.toFixed(6)));
  }
  function onToPriceChange(value) {
    if (fromCurrencyType === toCurrencyType) {
      setFromPrice(value);
      setToPrice(value);
      return;
    }
    const result =
      (ratesRef.current[fromCurrencyType] / ratesRef.current[toCurrencyType]) *
      value;
    setFromPrice(parseFloat(result.toFixed(6)));
    setToPrice(value);
  }

  useEffect(() => {
    onFromPriceChange(fromPrice);
  }, [fromCurrencyType, fromPrice]);
  useEffect(() => {
    onToPriceChange(toPrice);
  }, [toCurrencyType, toPrice]);

  return (
    <div className="App">
      <Block
        value={fromPrice}
        currency={fromCurrencyType}
        onCurrencyTypeChange={setFromCurrencyType}
        onValueChange={onFromPriceChange}
      />
      <Block
        value={toPrice}
        currency={toCurrencyType}
        onCurrencyTypeChange={setToCurrencyType}
        onValueChange={onToPriceChange}
      />
    </div>
  );
}

export default App;
