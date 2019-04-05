import cards from "../data/cards.js";
import lodash from "lodash";
import WinningPiles from "./winningPiles";
import Piles from "./piles";

class Game {
  constructor() {
    this.shuffledCards = lodash.shuffle(cards);
    this.cardCount = 27;
    this.winningPiles = new WinningPiles();
    this.piles = new Piles();
  }

  rendPileCards() {
    let cardCount = 0;
    for (let pileIndex = 0; pileIndex < 7; pileIndex++) {
      let pile = [];
      cardCount = this.generatePile(pileIndex, cardCount, pile);
      this.piles.addPile(pile);
    }
    return this.piles.getPiles();
  }

  generatePile(pileIndex, cardCount, pile) {
    for (let cardIndex = 0; cardIndex <= pileIndex; cardIndex++) {
      let card = this.shuffledCards[cardCount];
      if (this.isLastCard(cardIndex, pileIndex)) card.draggable = true;
      pile.push(card);
      cardCount++;
    }
    return cardCount;
  }

  rendNextCard() {
    this.cardCount++;
    if (this.cardCount == 52) this.cardCount = 28;
    return this.shuffledCards[this.cardCount];
  }

  isDropable(pileNumber) {
    let pileLength = this.piles.getPileLength(pileNumber);
    let card = this.piles.getLastCard(pileNumber);
    let isDropable = this.winningPiles.isDropable(card);
    if (isDropable) {
      this.piles.setDraggable(pileNumber, pileLength);
    }
    return isDropable;
  }

  aaaaa(pileNumber, pileLength) {
    this.piles[pileNumber][pileLength - 2].draggable = true;
  }

  isDropableOnPile(card, fromPile, toPile) {
    this.piles.isDropable(card, fromPile, toPile);
    return this.piles.getPiles();
  }

  rendLastCard(type) {
    let length = this.cards[type].length;
    return this.cards[type][length - 1];
  }

  getPiles = () => this.piles.getPiles();
  isLastCard = (cardIndex, pileIndex) => cardIndex == pileIndex;
}

export default Game;
