import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import cards from "./cards";
import lodash from "lodash";

class RenderCards extends React.Component {
  constructor(props) {
    super(props);
    this.cardColor = {
      black: "black",
      red: "red"
    };
    this.BACK = ["\uD83C\uDCA0"];
    this.cards = lodash.shuffle(cards);
    this.cardCount = 0;
    this.rendCards = this.rendCards.bind(this);
    this.allowDrop = this.allowDrop.bind(this);
    this.drag = this.drag.bind(this);
    this.drop = this.drop.bind(this);
    this.rendNextCard = this.rendNextCard.bind(this);
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }

  drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    event.target.appendChild(document.getElementById(data));
  }

  rendCards() {
    const cardsDiv = [];
    for (let i = 0; i < 7; i++) {
      const elements = [];
      for (let j = 0; j <= i; j++) {
        let card = this.cards[this.cardCount];
        let element = (
          <div
            id={card.color + " _" + card.number + "_" + card.type}
            className={this.cardColor[card.color]}
          >
            {card.unicode}
          </div>
        );
        if (j == i) {
          element = (
            <div
              id={card.color + " _" + card.number + "_" + card.type}
              className={this.cardColor[card.color]}
              draggable
              onDragStart={this.drag}
            >
              {card.unicode}
            </div>
          );
        }

        elements.push(element);
        this.cardCount++;
      }
      cardsDiv.push(<div className="pile">{elements}</div>);
    }
    return <div className="piles">{cardsDiv}</div>;
  }

  rendNextCard() {
    this.cardCount++;
    if (this.cardCount == 52) this.cardCount = 28;
    let card = this.cards[this.cardCount];
    let currentCardDiv = document.getElementById("currentCard");
    currentCardDiv.style.color = card.color;
    currentCardDiv.innerHTML = card.unicode;
    currentCardDiv.draggable = true;
  }

  render() {
    return (
      <div className="solitaire">
        <div className="upperContainer">
          <div className="backAndCurrentCard">
            <div className="back" id="back" onClick={this.rendNextCard}>
              {this.BACK}
            </div>
            <div className="back" id="currentCard" />
          </div>
          <div className="reservedcardSection">
            <div
              className="reservedDeckCard"
              id="reservedCards1"
              onDrop={this.drop}
              onDragOver={this.allowDrop}
            />
            <div
              className="reservedDeckCard"
              id="reservedCards2"
              onDrop={this.drop}
              onDragOver={this.allowDrop}
            />
            <div
              className="reservedDeckCard"
              id="reservedCards3"
              onDrop={this.drop}
              onDragOver={this.allowDrop}
            />
            <div
              className="reservedDeckCard"
              id="reservedCards4"
              onDrop={this.drop}
              onDragOver={this.allowDrop}
            />
          </div>
        </div>
        {this.rendCards()}
      </div>
    );
  }
}

ReactDOM.render(<RenderCards />, document.getElementById("root"));
