'use strict';

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelDate = document.querySelector('.date');
const labelTimer = document.querySelector('.timer');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const btnLogin = document.querySelector('.login__btn');
const btnLoan = document.querySelector('.form__btn--loan');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [
    5000, 3400, -150, -790, -3210, -1000, 8500, -30, 100, 325, -100, 987,
  ],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
    '2023-07-27T12:01:20.894Z',
    '2023-11-29T12:01:20.894Z',
    '2023-11-28T12:01:20.894Z',
    '2023-11-27T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];
let currentAccount, timer;

// FUNCTIONS

// Timer
const startLogOutTimer = function () {
  let time = 300;
  const tick = function () {
    let min = String(Math.trunc(time / 60)).padStart(2, 0);
    let sec = String(time % 60).padStart(2, 0);
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    labelTimer.textContent = `${min} : ${sec}`;
    time--;
  };
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

// Formating movements dates
const formatMovementsDate = function (date, locale) {
  const calculateDayPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));
  const dayPassed = calculateDayPassed(new Date(), date);

  if (dayPassed === 0) return 'Today';
  if (dayPassed === 1) return 'One day ago';
  if (dayPassed <= 7) return `${dayPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

// Formating currency
const formatCur = function (locale, currency, value) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// Update UI
const updateUI = function (acc) {
  displayBalance(acc);
  displayMovements(acc);
  calcDisplaySummary(acc);
  console.log(accounts);
};

// Create username
const createUsername = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsername(accounts);

// Login
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    containerApp.style.opacity = '100';
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Display date
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
  }

  if (timer) clearInterval(timer);
  startLogOutTimer();

  updateUI(currentAccount);
});

// Display balance
const displayBalance = function (acc) {
  currentAccount.balance = acc.movements.reduce((accu, curr) => accu + curr, 0);

  labelBalance.textContent = formatCur(
    acc.locale,
    acc.currency,
    currentAccount.balance
  );
};

// Display movements
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // Formating movements
    const formattedMov = formatCur(acc.locale, acc.currency, mov);

    // Formating movements date
    const date = new Date(acc.movementsDates[i]);

    const displayMovementDate = formatMovementsDate(date, acc.locale);

    const html = `
     <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayMovementDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Display Summary
const calcDisplaySummary = function (acc) {
  const incomens = acc.movements
    .filter(mov => mov > 0)
    .reduce((accu, curr) => accu + curr, 0);
  labelSumIn.textContent = formatCur(acc.locale, acc.currency, incomens);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((accu, curr) => accu + curr, 0);
  labelSumOut.textContent = formatCur(acc.locale, acc.currency, Math.abs(out));

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int > 1)
    .reduce((accu, curr) => accu + curr, 0);
  labelSumInterest.textContent = formatCur(acc.locale, acc.currency, interest);
};

// Request Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0) currentAccount.movements.push(amount);

  inputLoanAmount.value = '';

  currentAccount.movementsDates.push(new Date().toISOString());

  clearInterval(timer);
  startLogOutTimer();

  updateUI(currentAccount);
});

// Transfer money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;

  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance > amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    inputTransferAmount.value = inputTransferTo.value = '';

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    clearInterval(timer);
    startLogOutTimer();
    updateUI(currentAccount);
  }
});

// Close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);

    updateUI(currentAccount);

    inputCloseUsername.value = inputClosePin.value = '';

    containerApp.style.opacity = 0;
  }
});

// Sorting
let sort = false;
btnSort.addEventListener('click', function () {
  displayMovements(currentAccount, !sort);
  sort = !sort;
});
