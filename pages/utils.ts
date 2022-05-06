import { BlueCard, CardStack, GreenCard, RedCard } from './types';

export const getNextIndex = <T>(values: T[], index: number): T => {
  return values[index];
};

// blue
const wheatField: BlueCard = {
  type: 'blue',
  symbol: 'field',
  name: 'Пшеничное поле',
  price: 1,
  triggeredBy: 1,
  profit: 1,
};

const farm: BlueCard = {
  type: 'blue',
  symbol: 'farm',
  name: 'Ферма',
  price: 1,
  triggeredBy: 2,
  profit: 1,
};

const flowerGarden: BlueCard = {
  type: 'blue',
  symbol: 'field',
  name: 'Цветник',
  price: 2,
  triggeredBy: 4,
  profit: 1,
};

const forest: BlueCard = {
  type: 'blue',
  symbol: 'engineering',
  name: 'Лес',
  price: 3,
  triggeredBy: 5,
  profit: 1,
};

const fishingBoat: BlueCard = {
  type: 'blue',
  symbol: 'sea-work',
  name: 'Рыбацкий баркас',
  price: 2,
  triggeredBy: 8,
  onTriggered(diceNumber: number, myCards: CardStack[]): boolean {
    const hasPort = myCards.some(stack => (
      stack.card.type === 'yellow' && stack.card.isActive && stack.card.name === 'Порт'
    ));
    return diceNumber === 8 && hasPort;
  },
  profit: 3,
};

const mine: BlueCard = {
  type: 'blue',
  symbol: 'engineering',
  name: 'Шахта',
  price: 6,
  triggeredBy: 9,
  profit: 5,
};

const appleOrchard: BlueCard = {
  type: 'blue',
  symbol: 'field',
  name: 'Яблоневый сад',
  price: 3,
  triggeredBy: 10,
  profit: 3,
};

const trawler: BlueCard = {
  type: 'blue',
  symbol: 'sea-work',
  name: 'Траулер',
  price: 5,
  triggeredBy: [12, 14],
  onTriggered(diceNumber: number, myCards: CardStack[]): boolean {
    return myCards.some(stack => (
      stack.card.type === 'yellow' && stack.card.isActive && stack.card.name === 'Порт'
    ));
  },
  profit: 'dice-roll',
};

// green
const bakery: GreenCard = {
  type: 'green',
  symbol: 'store',
  name: 'Пекарня',
  price: 1,
  triggeredBy: [2, 3],
  profit: 1,
};

const shop: GreenCard = {
  type: 'green',
  symbol: 'store',
  name: 'Магазин',
  price: 2,
  triggeredBy: 4,
  profit: 3,
};

const flowerShop: GreenCard = {
  type: 'green',
  symbol: 'store',
  name: 'Цветочный магазин',
  price: 1,
  triggeredBy: 6,
  profit: 1,
  onProfit(myCards: CardStack[]): number {
    return myCards.reduce((sum, stack) => {
      return sum + stack.card.name === 'Цветник' ? stack.count : 0;
    }, 0);
  },
};

const cheeseDairy: GreenCard = {
  type: 'green',
  symbol: 'factory',
  name: 'Сыроварня',
  price: 5,
  triggeredBy: 7,
  profit: 3,
  onProfit(myCards: CardStack[]): number {
    return myCards
      .filter(stack => stack.card.symbol === 'farm')
      .reduce((sum, stack) => sum + stack.count * 3, 0);
  }
};

const furnitureFactory: GreenCard = {
  type: 'green',
  symbol: 'factory',
  name: 'Мебельная фабрика',
  price: 3,
  triggeredBy: 8,
  profit: 3,
  onProfit(myCards: CardStack[]): number {
    return myCards
      .filter(stack => stack.card.symbol === 'engineering')
      .reduce((sum, stack) => sum + stack.count * 3, 0);
  }
};

const fruitMarket: GreenCard = {
  type: 'green',
  symbol: 'market',
  name: 'Фруктовый рынок',
  price: 2,
  triggeredBy: [11, 12],
  profit: 2,
  onProfit(myCards: CardStack[]): number {
    return myCards
      .filter(stack => stack.card.symbol === 'field')
      .reduce((sum, stack) => sum + stack.count * 2, 0);
  }
};

const foodWarehouse: GreenCard = {
  type: 'green',
  symbol: 'factory',
  name: 'Склад продовольствия',
  price: 2,
  triggeredBy: [12, 13],
  profit: 2,
  onProfit(myCards: CardStack[]): number {
    return myCards
      .filter(stack => stack.card.symbol === 'public-catering')
      .reduce((sum, stack) => sum + stack.count * 2, 0);
  }
};

// red
const sushiBar: RedCard = {
  type: 'red',
  symbol: 'public-catering',
  name: 'Суси-бар',
  price: 2,
  triggeredBy: 1,
  profit: 3,
};

const caffe: RedCard = {
  type: 'red',
  symbol: 'public-catering',
  name: 'Кафе',
  price: 2,
  triggeredBy: 3,
  profit: 1,
};

const pizzeria: RedCard = {
  type: 'red',
  symbol: 'public-catering',
  name: 'Пиццерия',
  price: 1,
  triggeredBy: 7,
  profit: 1,
};

const snackBar: RedCard = {
  type: 'red',
  symbol: 'public-catering',
  name: 'Закусочная',
  price: 1,
  triggeredBy: 8,
  profit: 1,
};

const restaurant: RedCard = {
  type: 'red',
  symbol: 'public-catering',
  name: 'Ресторан',
  price: 3,
  triggeredBy: [9, 10],
  profit: 2,
};

export const initialCards: readonly CardStack[] = [
  // yellow
  // blue
  { card: wheatField, count: 12 },
  { card: farm, count: 6 },
  { card: flowerGarden, count: 6 },
  { card: forest, count: 6 },
  { card: fishingBoat, count: 6 },
  { card: mine, count: 6 },
  { card: appleOrchard, count: 6 },
  { card: trawler, count: 6 },
  // green
  { card: bakery, count: 12 },
  { card: shop, count: 6 },
  { card: flowerShop, count: 6 },
  { card: cheeseDairy, count: 6 },
  { card: furnitureFactory, count: 6 },
  { card: fruitMarket, count: 6 },
  { card: foodWarehouse, count: 6 },
  // red
  { card: sushiBar, count: 6 },
  { card: caffe, count: 6 },
  { card: pizzeria, count: 6 },
  { card: snackBar, count: 6 },
  { card: restaurant, count: 6 },
  // violet
] as const;
