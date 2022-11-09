import "./css/index.css"
import IMask, { MaskedRange } from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    americanExpress: ["#ffffff", "#447A9A"],
    default: ["black", "gray"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}
globalThis.setCardType = setCardType

const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)
const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  // pegar o mês atual e não permitir que a pessoa coloque um mês qe já tenha passado!
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
      autofix: "pad",
    },
  },
}
expirationDate.addEventListener("input", () => {
  let date = new Date()
  let Presentmonth = date.getMonth()
  let expirationDateValue = expirationDate.value.split("/")

  console.log(expirationDateValue[0])

  if (expirationDate.value == "") {
    expirationDate.classList.remove("invalid")
  } else if (expirationDateValue[0] < Presentmonth) {
    expirationDate.classList.add("invalid")
  } else {
    expirationDate.classList.remove("invalid")
  }
})
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^37[0-9]|^34[0-9])/,
      cardtype: "americanExpress",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })
    // Outra forma de fazer:
    //const foundMask = dynamicMasked.compiledMasks.find(({regex}) => number.match(regex))

    return foundMask
  },
}
const cardNUmberMasked = IMask(cardNumber, cardNumberPattern)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  checkFieldFilling(array)
  if (validation == true) {
    alert("Preencha os campos corretamente antes de enviar!")
  } else {
    alert("Cartão adicionado!")
  }
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerText =
    cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})
cardHolder.addEventListener("input", () => {
  if (cardHolder.value == "") {
    cardHolder.classList.remove("invalid")
  } else if (/[^\w|\s]|[0-9]/.test(cardHolder.value)) {
    cardHolder.classList.add("invalid")
  } else {
    cardHolder.classList.remove("invalid")
  }
})
securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})
function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length === 0 ? "123" : code
  // verificar qual o tipo do cartão, se for o tipo "a", so podera receber "x" caracteres.
}

cardNUmberMasked.on("accept", () => {
  const cardType = cardNUmberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNUmberMasked.value)
  if (cardNumber.value == "") {
    cardNumber.classList.remove("invalid")
  } else if (cardType == "default") {
    cardNumber.classList.add("invalid")
  } else {
    cardNumber.classList.remove("invalid")
  }
})
function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})
function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-extra .value")
  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}
const array = [securityCode, expirationDate, cardHolder, cardNumber]
let validation
function checkFieldFilling(array) {
  for (const element of array) {
    if (element.value == "") {
      validation = true
    }
  }
  for (const element of array) {
    if (element.classList.value == "invalid") {
      validation = true
    }
  }
}
