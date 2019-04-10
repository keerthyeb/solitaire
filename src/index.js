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
    this.state = this.game.getGameDetails();

    this.rendCards = this.rendCards.bind(this);
    this.drop = this.drop.bind(this);
    this.dropOnPile = this.dropOnPile.bind(this);
    this.updateOpenCards = this.updateOpenCards.bind(this);
    this.rendOpenCards = this.rendOpenCards.bind(this);
    this.rendWinningDiv = this.rendWinningDiv.bind(this);
    this.dropOnEmptyPile = this.dropOnEmptyPile.bind(this);
  }

  allowDrop = ev => ev.preventDefault();
  drag = ev => ev.dataTransfer.setData("text", ev.target.id);
  updateOpenCards = () => this.setState({ openCards: this.game.updateOpenCards() });

  drop(event) {
    const data = event.dataTransfer.getData("text");
    let pileNumber = data.split("_")[3];
    this.setState(this.game.isDropable(pileNumber));
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
      return this.setState(game);
    }
    let unicode = document.getElementById(data).innerHTML;
    let card = { color: id[0], number: id[1], type: id[2], unicode };
    game = this.game.isDropableOnPileFromPile(card, sourcePile, destinationPile);
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
    this.state.piles[pile].forEach(card => {
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
    });
    if (pileLength) {
      cardsDiv.push(<Card id={"pile_" + pile} className="pile" text={elements} />);
      return;
    }
    cardsDiv.push(
      <div
        id={"pile_" + pile}
        className="pile"
        onDrop={this.dropOnEmptyPile}
        onDragOver={this.allowDrop.bind(this)}
      />
    );
  }

  rendOpenCards() {
    let openCards = this.state.openCards;
    if (!openCards.length) return <div className="back">{element}</div>;
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

  rendWinningDiv() {
    let winningState = this.state.winningState;
    let winningDeck = [];
    Object.keys(winningState).forEach(suit => {
      let length = winningState[suit].length;
      let { unicode, color } = winningState[suit][length - 1];
      winningDeck.push(
        <ReservedDeck
          class="reservedCard"
          id={suit}
          onDrop={this.drop}
          onDragOver={this.allowDrop.bind(this)}
          text={<div style={{ color }}>{unicode}</div>}
        />
      );
    });
    return <div className="reservedSection">{winningDeck}</div>;
  }

  render() {
    console.log(this.state.isWon);
    if (this.state.isWon) {
      return (
        <div>
          <img src="https://cdn2.iconfinder.com/data/icons/kick-off/450/Throphy-512.png" />
        </div>
      );
    }
    return (
      <div className="solitaire">
        <div className="upperContainer">
          <div className="backAndCurrentCard">
            <Card className="back" id="back" onClick={this.updateOpenCards} text={this.BACK} />
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

function ReservedDeck(props) {
  return (
    <div
      className={props.class}
      id={props.card}
      onDrop={props.onDrop}
      onDragOver={props.onDragOver}
    >
      {props.text}
    </div>
  );
}

ReactDOM.render(<Solitaire />, document.getElementById("root"));
