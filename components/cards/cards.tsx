import React from 'react';
import styles from './cards.module.scss';
import { CardStack } from '../../pages/types';
import classNames from 'classnames';

type Props = {
  className: string;
  cards: readonly CardStack[];
};

export const Cards: React.FC<Props> = (props) => {
  const { className, cards } = props;

  return (
    <ul className={classNames(styles.cards, className)}>
      {cards.map(stack => {
        const triggeredBy = stack.card.type !== 'yellow'
          ? Array.isArray(stack.card.triggeredBy)
            ? stack.card.triggeredBy.join(', ')
            : stack.card.triggeredBy
          : null;
        const profit = stack.card.type !== 'yellow' ? stack.card.price : null;

        return (
          <li className={classNames(styles.card, styles[`card_${stack.card.type}`])} key={stack.card.name}>
            <p className={styles.card__count}>{stack.count}</p>
            {triggeredBy && (
              <p className={styles.card__triggeredBy}>{triggeredBy}</p>
            )}
            <p className={styles.card__name}>{stack.card.name}</p>
            {profit && (
              <small className={styles.card__tip}>
                Возьмите {profit} монеты из банка
              </small>
            )}
            <p className={styles.card__price}>{stack.card.price}</p>
          </li>
        );
      })}
    </ul>
  );
};
