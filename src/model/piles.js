class Piles {
  constructor() {
    this.piles = [];
  }
  addPile(pile) {
    this.piles.push(pile);
  }
  getPiles = () => this.piles;

  isDropable(card, sourcePile, destinationPile) {
    let pile = this.piles[destinationPile];
    let length = pile.length;
    let lastCard = pile[length - 1];
    if (this.isThisDropableOnPile(lastCard, card)) {
      this.piles[destinationPile].push(this.piles[sourcePile].pop());
      if (this.piles[sourcePile].length) {
        this.piles[sourcePile][this.piles[sourcePile].length - 1].draggable = true;
      }
    }
    return this.piles;
  }

  isThisDropableOnPile(lastCard, card) {
    return +lastCard.number - 1 == card.number && lastCard.color != card.color;
  }

  getPileLength = index => this.piles[index].length;
  getLastCard = index => this.piles[index][this.getPileLength(index) - 1];
  setDraggable = (pileNumber, pileLength) => {
    if (this.piles[pileNumber][pileLength - 2]) {
      this.piles[pileNumber][pileLength - 2].draggable = true;
    }
  };
}

export default Piles;
