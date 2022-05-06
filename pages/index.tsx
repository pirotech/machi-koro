import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { NextPage } from 'next'
import Head from 'next/head'
import { CardStack, Gamer, Step, steps } from './types';
import { initialCards } from './utils';
import { Cards } from '../components/cards/cards';
import styles from '../styles/Home.module.scss'

const gamersNames = ['gamer 1', 'gamer 2'];

const MAX_DICE_NUMBER = 8;

const Home: NextPage = () => {
  const [step, setStep] = useState<Step>('dice-roll');
  const [diceNumber, setDiceNumber] = useState(0);
  const [gamers, setGamers] = useState<Gamer[]>([]);
  const [cards, setCards] = useState(initialCards);

  const blueCards = useMemo<CardStack[]>(() => {
    return cards.filter(item => item.card.type === 'blue');
  }, [cards]);

  const greenCards = useMemo<CardStack[]>(() => {
    return cards.filter(item => item.card.type === 'green');
  }, [cards]);

  const redCards = useMemo<CardStack[]>(() => {
    return cards.filter(item => item.card.type === 'red');
  }, [cards]);

  const stepLabel = useMemo(() => {
    switch (step) {
      case 'dice-roll': {
        return 'Бросок';
      }
      case 'buying': {
        return 'Покупки';
      }
    }
  }, [step]);

  const toNextGamer = useCallback((gamers: Gamer[]): Gamer[] => {
    const updatedGamers = gamers;
    const activeIndex = updatedGamers.findIndex(item => item.isActive);
    updatedGamers[activeIndex].isActive = false;
    const nextActiveIndex = activeIndex === updatedGamers.length - 1 ? 0 : activeIndex + 1;
    updatedGamers[nextActiveIndex].isActive = true;
    return updatedGamers;
  }, []);

  const diceRoll = useCallback(() => {
    return Math.ceil(Math.random() * MAX_DICE_NUMBER);
  }, []);

  const redCardsStep = useCallback((diceNumber: number, gamers: Gamer[]): Gamer[] => {
    let updatedGamers = gamers;

    // todo: раздаём деньги против часовой
    let activeGamerMoney = updatedGamers.find(gamer => gamer.isActive)?.money ?? 0;
    updatedGamers = updatedGamers.map(gamer => {
      let penalty = 0;
      // работает у неактивного игрока
      if (gamer.isActive) {
        penalty = gamer.cards.reduce((sum, stack) => {
          // работает красная карта
          if (stack.card.type === 'red') {
            let triggered = false;
            if (Array.isArray(stack.card.triggeredBy)) {
              const [begin, end] = stack.card.triggeredBy;
              triggered = diceNumber > begin && diceNumber < end;
            } else {
              triggered = diceNumber === stack.card.triggeredBy;
            }
            if (stack.card.onTriggered) {
              triggered &&= stack.card.onTriggered(diceNumber, gamer.cards);
            }

            if (triggered) {
              return sum + stack.card.profit * stack.count;
            }
          }
          return sum;
        }, penalty);
      }

      if (activeGamerMoney >= penalty) {
        activeGamerMoney -= penalty;
        return { ...gamer, money: gamer.money + penalty };
      } else if (activeGamerMoney > 0) {
        penalty = activeGamerMoney;
        activeGamerMoney = 0;
        return { ...gamer, money: gamer.money + penalty };
      }

      return gamer;
    });

    updatedGamers = updatedGamers.map(gamer => {
      if (gamer.isActive) {
        return { ...gamer, money: activeGamerMoney };
      }
      return gamer;
    });

    return updatedGamers;
  }, []);

  const blueCardsStep = useCallback((diceNumber: number, gamers: Gamer[]): Gamer[] => {
    let updatedGamers = gamers;

    updatedGamers = updatedGamers.map(gamer => {
      // работает у всех
      const money = gamer.cards.reduce((sum, stack) => {
        // работает синяя карта
        if (stack.card.type === 'blue') {
          let triggered = false;
          if (Array.isArray(stack.card.triggeredBy)) {
            const [begin, end] = stack.card.triggeredBy;
            triggered = diceNumber > begin && diceNumber < end;
          } else {
            triggered = diceNumber === stack.card.triggeredBy;
          }
          if (stack.card.onTriggered) {
            triggered &&= stack.card.onTriggered(diceNumber, gamer.cards);
          }

          if (triggered) {
            // todo: переход на стадию броска кубиков
            const profit = stack.card.profit === 'dice-roll'
              ? diceRoll()
              : stack.card.profit;
            return sum + profit * stack.count;
          }
        }
        return sum;
      }, gamer.money);
      return { ...gamer, money };
    });

    return updatedGamers;
  }, []);

  const greenCardsStep = useCallback((diceNumber: number, gamers: Gamer[]): Gamer[] => {
    let updatedGamers = gamers;

    updatedGamers = updatedGamers.map(gamer => {
      let money = gamer.money;
      // работает у активного игрока
      if (gamer.isActive) {
        money = gamer.cards.reduce((sum, stack) => {
          // работает зелёная карта
          if (stack.card.type === 'green') {
            let triggered = false;
            if (Array.isArray(stack.card.triggeredBy)) {
              const [begin, end] = stack.card.triggeredBy;
              triggered = diceNumber > begin && diceNumber < end;
            } else {
              triggered = diceNumber === stack.card.triggeredBy;
            }

            if (triggered) {
              let profit = 0;
              if (stack.card.onProfit) {
                profit = stack.card.onProfit(gamer.cards);
              } else if (stack.card.profit) {
                profit = stack.card.profit;
              }
              return sum + profit * stack.count;
            }
          }
          return sum;
        }, money);
      }
      return { ...gamer, money };
    });

    return updatedGamers;
  }, []);

  const checkWinner = useCallback((gamers: Gamer[]): Gamer[] => {
    return gamers.filter(gamer => {
      return gamer.cards.every(stack => {
        const isNotYellow = stack.card.type !== 'yellow';
        const activeYellow = stack.card.type === 'yellow' && stack.card.isActive;
        return isNotYellow || activeYellow;
      });
    })
  }, []);

  const nextStep = useCallback(() => {
    switch (step) {
      case 'dice-roll': {
        const diceNumber = diceRoll();
        setDiceNumber(diceNumber);
        let updatedGamers = [...gamers];
        console.log(gamers);
        updatedGamers = redCardsStep(diceNumber, updatedGamers);
        updatedGamers = blueCardsStep(diceNumber, updatedGamers);
        updatedGamers = greenCardsStep(diceNumber, updatedGamers);
        setGamers(updatedGamers);
        setStep('buying');
        break;
      }
      case 'buying': {
        const winners = checkWinner(gamers);
        if (winners.length > 0) {
          setStep('end-game');
        }

        let updatedGamers = [...gamers];
        updatedGamers = toNextGamer(updatedGamers);
        setGamers(updatedGamers);
        setStep('dice-roll');
        break;
      }
    }
  }, [gamers]);

  useEffect(() => {
    setGamers(gamersNames.map((name, index) => ({
      name,
      isActive: index === 0,
      money: 3,
      cards: []
    })));
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Machi Koro</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ul className={styles.gamers}>
        {gamers.map(gamer => (
          <li className={styles.gamer} key={gamer.name}>
            <h3>{gamer.name} ({gamer.money}) {gamer.isActive ? 'active' : ''}</h3>
            <Cards className={styles.cards} cards={gamer.cards} />
          </li>
        ))}
      </ul>

      <button className={styles.nextStepButton} onClick={nextStep}>
        {stepLabel}
      </button>

      <Cards className={styles.bankCards} cards={blueCards} />
      <Cards className={styles.bankCards} cards={greenCards} />
      <Cards className={styles.bankCards} cards={redCards} />
    </div>
  );
};

export default Home;
