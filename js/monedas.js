// api que da los datos de conversión con el dólar como referencia
const API_URL = "https://api.exchangerate-api.com/v5/latest";

// Seleccionamos el formulario y el párrafo donde vamos escribir los resultados de la conversión
const converter = document.querySelector("#converter");
const result = document.querySelector('#result');


async function start() {
  const response = await fetch(API_URL);
  const data = await response.json();
  const { rates } = data;
  const { origin, target, amount, calculate } = converter.elements;
  origin.append(buildOptions(rates));
  target.append(buildOptions(rates));
  calculate.removeAttribute('disabled');
  converter.addEventListener("submit", event => {
    event.preventDefault();
    const amountValue = Number(amount.value);

    if (amountValue > 0) {
      const amountInUSD = amount.value / rates[origin.value];
      // Teniendo la cantidad introducida en dólares ahora simplemente convertimos a la moneda de destino.
      const amountInTargetCurrency = amountInUSD * rates[target.value];
      // Escribimos el resultado en el párrafo correspondiente
      result.textContent = `${formatMoney(amountValue)} ${origin.value} son ${formatMoney(amountInTargetCurrency)} ${target.value}`;
    // En caso de que el valor introducido sea 0 o menor avisamos de que la cantidad es incorrecta
    } else {
      result.textContent = "Cantidad incorrecta";
    }
  });
}
start();

// Esta función recibe el objecto con las monedas y valores y devuelve un fragmento de DOM
// con una lista de <options> para rellenar los selects
function buildOptions(data) {
  const fragment = document.createDocumentFragment();
  for (const currency of Object.keys(data)) {
    const option = document.createElement("option");
    option.setAttribute("value", currency);
    option.textContent = currency;
    fragment.append(option);
  }
  return fragment;
}
// Esta función convierte un número a un formato local (no la vimos en clase, pero investigando un poco es fácil de encontrar)
function formatMoney(amount) {
  return amount.toLocaleString('es')
}