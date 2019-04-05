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
    this.state = { openCards: [], piles, winningState, fromPile: 0 };

    this.rendCards = this.rendCards.bind(this);
    this.drop = this.drop.bind(this);
    this.dropOnPile = this.dropOnPile.bind(this);
    this.RendNextCard = this.RendNextCard.bind(this);
    this.RendNextCardDiv = this.RendNextCardDiv.bind(this);
    this.Card = this.Card.bind(this);
    this.RendWinningDiv = this.RendWinningDiv.bind(this);
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
    let type = id[2];
    if (this.game.isDropable(pileNumber)) {
      let piles = this.state.piles;
      let winningState = this.state.winningState;
      winningState[type].push(piles[pileNumber].pop());
      this.setState({ piles: this.game.getPiles(), winningState });
    }
  }

  dropOnPile(event) {
    const data = event.dataTransfer.getData("text");
    let id = data.split("_");
    let sourcePile = id[3];
    let card = this.state.piles[sourcePile][this.state.piles[sourcePile].length - 1];
    let destinationPile = event.target.parentElement.id.split("_")[1];
    let piles = this.game.isDropableOnPile(card, sourcePile, destinationPile);
    this.setState({ piles });
  }

  rendCards() {
    const cardsDiv = [];
    console.log(this.state.piles);
    for (let pile = 0; pile < 7; pile++) {
      const elements = [];
      let pileLength = this.state.piles[pile].length;
      for (let index = 0; index <= pileLength - 1; index++) {
        let card = this.state.piles[pile][index];
        let id = [card.color, card.number, card.type, pile].join("_");
        let element = <this.Card id={id} className="black" text={this.BACK} />;
        if (card.draggable) {
          element = (
            <div
              id={id}
              className={this.cardColor[card.color]}
              draggable
              onDragStart={this.drag.bind(this)}
              onDrop={this.dropOnPile}
              onDragOver={this.allowDrop.bind(this)}
            >
              {card.unicode}
            </div>
          );
        }
        elements.push(element);
      }
      cardsDiv.push(
        <div id={"pile_" + pile} className="pile">
          {elements}
        </div>
      );
    }
    return <div className="piles">{cardsDiv}</div>;
  }

  RendNextCard() {
    let cards = this.state.openCards;
    cards.push(this.game.RendNextCard());
    this.setState({ openCards: cards });
  }

  Card = props => (
    <div id={props.id} className={props.className}>
      {props.text}
    </div>
  );

  render() {
    return (
      <div className="solitaire">
        <div className="upperContainer">
          <div className="backAndCurrentCard">
            <div className="back" id="back" onClick={this.RendNextCard}>
              {this.BACK}
            </div>
            <this.RendNextCardDiv />
          </div>
          <this.RendWinningDiv />
        </div>
        {this.rendCards()}
      </div>
    );
  }

  RendWinningDiv() {
    let winningState = this.state.winningState;
    let types = Object.keys(winningState);
    let winningSections = [];

    types.forEach(cardType => {
      let length = winningState[cardType].length;
      let { unicode, color } = winningState[cardType][length - 1];
      let winningSection = (
        <div className="reservedCard" id={cardType} onDrop={this.drop} onDragOver={this.allowDrop.bind(this)}>
          <this.Card className={this.cardColor[color]} text={unicode} />
        </div>
      );
      winningSections.push(winningSection);
    });

    return <div className="reservedSection">{winningSections}</div>;
  }

  RendNextCardDiv() {
    if (this.state.openCards.length == 0) {
      return <div className="back" />;
    }
    let elementDivs = [];
    for (let i = 0; i < this.state.openCards.length; i++) {
      let card = this.state.openCards[i];
      let id = [card.color, card.number, card.type].join("_");
      let className = this.cardColor[card.color];
      let elementDiv = (
        <div id={id} className={className}>
          {card.unicode}
        </div>
      );
      if (i + 1 == this.state.openCards.length) {
        elementDiv = (
          <div id={id} className={className} draggable="true" onDragStart={this.drag.bind(this)}>
            {card.unicode}
          </div>
        );
      }
      elementDivs.push(elementDiv);
    }
    return <div className="back">{elementDivs}</div>;
  }
}

ReactDOM.render(<Solitaire />, document.getElementById("root"));
