import React, { Component } from 'react';
import web3 from './web3';
import lottery from './lottery';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      manager: '',
      players: [],
      balance: '',
      value: '',
      message: '',
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getAllPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  async onSubmit(event) {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Please hold while transaction is processed.' });

    await lottery.methods.enterLottery()
      .send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether'),
      });

    this.setState({ message: 'You\'ve been successfully entered into the lottery!' });
  }

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by {this.state.manager}.</p>
        <p>
          Currently there are {this.state.players.length} users entered in
          the lottery. The current pot
          holds {web3.utils.fromWei(this.state.balance, 'ether')} ether to win!
        </p>
        <hr/>
        <form onSubmit={this.onSubmit}>
          <h4>Enter Lottery</h4>
          <div>
            <label>Amount of ether to put into the pot </label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter Now</button>
        </form>
        <hr/>
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
