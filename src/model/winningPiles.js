class winningPiles {
  constructor() {
    this.cards = { spade: [], heart: [], club: [], diamond: [] };
    this.colors = { spade: "black", heart: "red", club: "black", diamond: "red" };
  }

  isDropable(card) {
    let cardLength = this.cards[card.type].length;
    if (this.isEmpty(cardLength)) {
      if (this.isFirstCard(card)) {
        this.cards[card.type].push(card);
        return true;
      }
      return false;
    }
    if (this.isThisDropable(card)) {
      this.cards[card.type].push(card);
      return true;
    }
    return false;
  }

  isThisDropable(card) {
    let cardLength = this.cards[card.type].length;
    let lastCard = this.cards[card.type][cardLength - 1];
    return +lastCard.number + 1 == card.number && this.colors[card.type] == card.color;
  }

  isEmpty = cardLength => cardLength == 0;
  isFirstCard = card => card.number == "1" && this.colors[card.type] == card.color;
}

export default winningPiles;
