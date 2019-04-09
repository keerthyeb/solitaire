class winningPiles {
  constructor() {
    let card = { type: "", number: "", unicode: "", color: "" };
    this.cards = { spade: [card], heart: [card], club: [card], diamond: [card] };
    this.colors = { spade: "black", heart: "red", club: "black", diamond: "red" };
  }

  isDropable(card) {
    let cardLength = this.cards[card.type].length;
    if (this.isEmpty(cardLength)) {
      if (this.isFirstCard(card)) {
        this.setDraggable(card);
        this.cards[card.type].push(card);
        return true;
      }
      return false;
    }
    if (this.isThisDropable(card)) {
      this.setDraggable(card);
      this.cards[card.type].push(card);
      return true;
    }
    return false;
  }

  setDraggable = card => (card.draggable = true);

  isThisDropable(card) {
    let cardLength = this.cards[card.type].length;
    let lastCard = this.cards[card.type][cardLength - 1];
    return +lastCard.number + 1 == card.number && this.colors[card.type] == card.color;
  }
  getWinningPiles = () => this.cards;
  isEmpty = cardLength => cardLength == 1;
  isFirstCard = card => card.number == "1" && this.colors[card.type] == card.color;
}

export default winningPiles;
