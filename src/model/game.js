import cards from "../data/cards.js";
import lodash from "lodash";
import WinningPiles from "./winningPiles";
import Piles from "./piles";

class Game {
  constructor() {
    this.shuffledCards = lodash.shuffle(cards);
    this.winningPiles = new WinningPiles();
    this.piles = new Piles();
    this.openCards = [];
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

  initializeOpenCards() {
    for (let index = 28; index < 52; index++) {
      this.openCards.push(this.shuffledCards[index]);
    }
    return this.openCards;
  }

  rendNextCard() {
    this.openCards.unshift(this.openCards.pop());
    let lastCard = this.openCards[this.openCards.length - 1];
    lastCard.draggable = true;
    return this.openCards;
  }

  isDropable(pile) {
    if (pile == "back") return this.isDropableFromOpenCards();
    return this.isDropableFromPile(pile);
  }

  isDropableFromPile(pileNumber) {
    let pileLength = this.piles.getPileLength(pileNumber);
    let card = this.piles.getLastCard(pileNumber);
    let isDropable = this.winningPiles.isDropable(card);
    if (isDropable) {
      this.piles.removeCard(pileNumber);
      this.piles.setDraggable(pileNumber, pileLength);
    }
    return this.getGameDetails();
  }

  isDropableFromOpenCards() {
    let card = this.openCards[this.openCards.length - 1];
    let isDropable = this.winningPiles.isDropable(card);
    if (isDropable) this.openCards.pop();
    return this.getGameDetails();
  }

  isDropableOnPileFromPile(card, fromPile, toPile) {
    this.piles.isDropableFromPile(card, fromPile, toPile);
    return this.getGameDetails();
  }

  isDropableOnPileFromOpenCard(card, pileNumber) {
    if (this.piles.isDropableFromOpenCard(card, pileNumber)) {
      this.openCards.pop();
    }
    return this.getGameDetails();
  }

  rendLastCard(type) {
    let length = this.cards[type].length;
    return this.cards[type][length - 1];
  }

  getGameDetails() {
    let piles = this.piles.getPiles();
    let openCards = this.openCards;
    let winningState = this.winningPiles.getWinningPiles();
    return { piles, openCards, winningState };
  }

  getPiles = () => this.piles.getPiles();
  isLastCard = (cardIndex, pileIndex) => cardIndex == pileIndex;
}

export default Game;
