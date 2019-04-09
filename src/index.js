import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Game from "./model/game";

class Solitaire extends React.Component {
  constructor(props) {
    super(props);
    this.cardColor = { black: "black", red: "red" };
    this.BACK = ["\uD83C\uDCA0"];
    this.game = new Game();
    let piles = this.game.rendPileCards();
    let card = { type: "", number: "", unicode: "", color: "" };
    let winningState = { spade: [card], heart: [card], club: [card], diamond: [card] };
    let openCards = this.game.initializeOpenCards();
    this.state = { openCards, piles, winningState, fromPile: 0 };

    this.drop = this.drop.bind(this);
    this.dropOnPile = this.dropOnPile.bind(this);
    this.rendNextCard = this.rendNextCard.bind(this);
    this.rendOpenCards = this.rendOpenCards.bind(this);
    this.rendWinningDiv = this.rendWinningDiv.bind(this);
    this.dropOnEmptyPile = this.dropOnEmptyPile.bind(this);
  }

  allowDrop = ev => ev.preventDefault();
  drag = ev => {
    let id = ev.target.id.split("_");
    let pileNumber = id[3];
    this.setState({ fromPile: pileNumber });
    ev.dataTransfer.setData("text", ev.target.id);
  };

  drop(event) {
    const data = event.dataTransfer.getData("text");
    let id = data.split("_");
    let pileNumber = id[3];
    let game = this.game.isDropable(pileNumber);
    this.setState(game);
  }

  dropOnPile(event) {
    let destinationPile = event.target.parentElement.id.split("_")[1];
    this.updateGame(event, destinationPile);
  }

  dropOnEmptyPile(event) {
    let destinationPile = event.target.id.split("_")[1];
    this.updateGame(event, destinationPile);
  }

  updateGame(event, destinationPile) {
    const data = event.dataTransfer.getData("text");
    let id = data.split("_");
    let sourcePile = id[3];
    let game;
    if (sourcePile == "back") {
      let card = this.state.openCards[this.state.openCards.length - 1];
      game = this.game.isDropableOnPileFromOpenCard(card, destinationPile);
    } else {
      let unicode = document.getElementById(data).innerHTML;
      let card = { color: id[0], number: id[1], type: id[2], unicode };
      game = this.game.isDropableOnPileFromPile(card, sourcePile, destinationPile);
    }
    this.setState(game);
  }

  rendCards() {
    const cardsDiv = [];
    for (let pile = 0; pile < 7; pile++) {
      const elements = [];
      let pileLength = this.state.piles[pile].length;
      this.createPile(pileLength, pile, elements, cardsDiv);
    }
    return <div className="piles">{cardsDiv}</div>;
  }

  createPile(pileLength, pile, elements, cardsDiv) {
    for (let index = 0; index <= pileLength - 1; index++) {
      let card = this.state.piles[pile][index];
      let id = [card.color, card.number, card.type, pile].join("_");
      let element = <Card id={id} className="black" text={this.BACK} />;
      if (card.draggable)
        element = (
          <OpenCard
            id={id}
            class={this.cardColor[card.color]}
            onDragStart={this.drag.bind(this)}
            onDrop={this.dropOnPile}
            onDragOver={this.allowDrop.bind(this)}
            text={card.unicode}
          />
        );
      elements.push(element);
    }
    if (pileLength) {
      cardsDiv.push(<Card id={"pile_" + pile} className="pile" text={elements} />);
      return;
    }
    cardsDiv.push(
      <div id={"pile_" + pile} className="pile" onDrop={this.dropOnEmptyPile} onDragOver={this.allowDrop.bind(this)} />
    );
  }

  rendNextCard() {
    let cards = this.game.rendNextCard();
    this.setState({ openCards: cards });
  }

  rendWinningDiv() {
    let winningState = this.state.winningState;
    let types = Object.keys(winningState);
    let winningSections = [];
    types.forEach(cardType => {
      let length = winningState[cardType].length;
      let { unicode, color } = winningState[cardType][length - 1];
      let winningSection = (
        <div className="reservedCard" id={cardType} onDrop={this.drop} onDragOver={this.allowDrop.bind(this)}>
          <div style={{ color }}>{unicode}</div>
        </div>
      );
      winningSections.push(winningSection);
    });
    return <div className="reservedSection">{winningSections}</div>;
  }

  rendOpenCards() {
    let openCards = this.state.openCards;
    if (!openCards.length) {
      return <div className="back">{element}</div>;
    }
    let card = openCards[openCards.length - 1];
    let id = [card.color, card.number, card.type, "back"].join("_");
    let color = this.cardColor[card.color];
    let element = (
      <div id={id} style={{ color }} draggable="true" onDragStart={this.drag.bind(this)}>
        {card.unicode}
      </div>
    );
    return <div className="back">{element}</div>;
  }

  render() {
    return (
      <div className="solitaire">
        <div className="upperContainer">
          <div className="backAndCurrentCard">
            <Card className="back" id="back" onClick={this.rendNextCard} text={this.BACK} />
            <this.rendOpenCards />
          </div>
          <this.rendWinningDiv />
        </div>
        {this.rendCards()}
      </div>
    );
  }
}

function Card(props) {
  return (
    <div id={props.id} className={props.className} onClick={props.onClick}>
      {props.text}
    </div>
  );
}

function OpenCard(props) {
  return (
    <div
      id={props.id}
      className={props.class}
      draggable
      onDragStart={props.onDragStart}
      onDrop={props.onDrop}
      onDragOver={props.onDragOver}
    >
      {props.text}
    </div>
  );
}

ReactDOM.render(<Solitaire />, document.getElementById("root"));
