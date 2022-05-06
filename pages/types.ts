const cardTypes = [
  'yellow',
  'blue',
  'green',
  'red',
  'violet',
] as const;

export type CardType = typeof cardTypes[number];

const cardSymbols = [
  // blue
  'field',
  'farm',
  'engineering',
  'sea-work',
  // green
  'store',
  'factory',
  'market',
  // red
  'public-catering',
] as const;

export type CardSymbol = typeof cardSymbols[number];

const cardNames = [
  // yellow
  'Порт',
  // blue
  'Пшеничное поле',
  'Ферма',
  'Цветник',
  'Лес',
  'Рыбацкий баркас',
  'Шахта',
  'Яблоневый сад',
  'Траулер',
  // green
  'Пекарня',
  'Магазин',
  'Цветочный магазин',
  'Сыроварня',
  'Мебельная фабрика',
  'Фруктовый рынок',
  'Склад продовольствия',
  // red
  'Суси-бар',
  'Кафе',
  'Пиццерия',
  'Закусочная',
  'Ресторан',
  // violet
] as const;

type CardName = typeof cardNames[number];

type BaseCard = {
  symbol?: CardSymbol;
  name: CardName;
  price: number;
};

export type TriggeredBy = number | [begin: number, end: number];

export type YellowCard = BaseCard & {
  type: 'yellow';
  isActive: boolean;
  onActivate(): void;
};

export type BlueCard = BaseCard & {
  type: 'blue';
  triggeredBy: TriggeredBy;
  onTriggered?(diceNumber: number, myCards: CardStack[]): boolean;
  profit: number | 'dice-roll';
};

export type GreenCard = BaseCard & {
  type: 'green';
  symbol: CardSymbol;
  triggeredBy: TriggeredBy;
  profit?: number;
  onProfit?(myCards: CardStack[]): number;
};

export type RedCard = BaseCard & {
  type: 'red';
  symbol: CardSymbol;
  triggeredBy: TriggeredBy;
  onTriggered?(diceNumber: number, myCards: CardStack[]): boolean;
  profit: number;
};

export type VioletCard = BaseCard & {
  type: 'violet';
  triggeredBy: TriggeredBy;
  onProfit(gamers: Gamer[]): Gamer[];
};

export type Card = YellowCard | BlueCard | GreenCard | RedCard | VioletCard;

export type CardStack = {
  card: Card;
  count: number;
};

export type Gamer = {
  name: string;
  cards: CardStack[];
  money: number;
  isActive: boolean;
};

export const steps = [
  'dice-roll',
  'buying',
  'end-game',
] as const;

export type Step = typeof steps[number];
