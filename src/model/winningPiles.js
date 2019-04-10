class winningPiles {
  constructor() {
    let card = { type: "", number: "", unicode: "", color: "" };
    this.decks = { spade: [card], heart: [card], club: [card], diamond: [card] };
    this.colors = { spade: "black", heart: "red", club: "black", diamond: "red" };
  }

  isWon() {
    let length = 0;
    Object.keys(this.decks).forEach(suit => {
      length += this.decks[suit].length;
    });
    if (length == 56) return true;
    return false;
  }

  isDropable(card) {
    let cardLength = this.decks[card.type].length;
    if (this.isEmpty(cardLength)) {
      if (this.isFirstCard(card)) {
        this.setDraggable(card);
        this.decks[card.type].push(card);
        return true;
      }
      return false;
    }
    if (this.isThisDropable(card)) {
      this.setDraggable(card);
      this.decks[card.type].push(card);
      return true;
    }
    return false;
  }

  setDraggable = card => (card.draggable = true);

  isThisDropable(card) {
    let cardLength = this.decks[card.type].length;
    let lastCard = this.decks[card.type][cardLength - 1];
    return +lastCard.number + 1 == card.number && this.colors[card.type] == card.color;
  }
  getWinningPiles = () => this.decks;
  isEmpty = cardLength => cardLength == 1;
  isFirstCard = card => card.number == "1" && this.colors[card.type] == card.color;
}

export default winningPiles;
