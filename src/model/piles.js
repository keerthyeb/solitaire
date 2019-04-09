class Piles {
  constructor() {
    this.piles = [];
  }

  addPile = pile => this.piles.push(pile);
  getPiles = () => this.piles;
  getPileAndLength(pileNumber) {
    let pile = this.piles[pileNumber];
    let length = pile.length;
    return { length, pile };
  }

  isThisDropableOnPile(lastCard, card) {
    return +lastCard.number - 1 == card.number && lastCard.color != card.color;
  }

  setDraggable = (pileNumber, pileLength) => {
    if (this.piles[pileNumber][pileLength - 2])
      this.piles[pileNumber][pileLength - 2].draggable = true;
  };

  removeCard = pileNumber => this.piles[pileNumber].pop();
  getPileLength = index => this.piles[index].length;
  getLastCard = index => this.piles[index][this.getPileLength(index) - 1];
  isKing = card => +card.number == 13;

  isDropableFromPile(card, sourcePile, destinationPile) {
    let { length, pile } = this.getPileAndLength(destinationPile);
    if (length == 0 && this.isKing(card)) {
      this.updatePiles(destinationPile, sourcePile, card);
      return;
    }
    let lastCard = pile[length - 1];
    if (this.isThisDropableOnPile(lastCard, card))
      this.updatePiles(destinationPile, sourcePile, card);
  }

  setLastCardDraggable(sourcePile) {
    if (this.piles[sourcePile].length)
      this.piles[sourcePile][this.piles[sourcePile].length - 1].draggable = true;
  }

  isDropableFromOpenCard(card, pileNumber) {
    let { length, pile } = this.getPileAndLength(pileNumber);
    if (length == 0 && this.isKing(card)) {
      card.draggable = true;
      this.piles[pileNumber].push(card);
      return true;
    }
    let lastCard = pile[length - 1];
    if (this.isThisDropableOnPile(lastCard, card)) {
      card.draggable = true;
      this.piles[pileNumber].push(card);
      return true;
    }
    return false;
  }

  updatePiles(destinationPile, sourcePile, card) {
    let sourcePileLength = this.piles[sourcePile].length;
    let length = 0;
    for (let index = 0; index < sourcePileLength; index++) {
      let currentCard = this.piles[sourcePile][index];
      if (currentCard.unicode == card.unicode) break;
      length++;
    }
    let sourcePileArray = this.piles[sourcePile].splice(length);
    sourcePileArray.forEach(card => {
      this.piles[destinationPile].push(card);
    });
    this.piles[destinationPile].concat(sourcePileArray);
    this.setLastCardDraggable(sourcePile);
  }
}

export default Piles;
