import React, { Component } from 'react';
import './App.css';
import store from './data.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      imageSelected: null,
      delayedRender: false,
    }
  }
  handleImageClick(imageSelected, event) {
    this.setState({imageSelected});
    event.preventDefault();
  }

  handleActivateDelayedRendering = (event) => {
    this.setState({ delayedRender: event.currentTarget.checked });
  }

  render() {
    const { imageSelected, delayedRender } = this.state;
    return (
      <div className="App">
        <label><input type="checkbox" checked={delayedRender} onChange={this.handleActivateDelayedRendering} /> activate keywords delayed rendering</label> 
        <div className="images">
          <div className={imageSelected === 1 ? 'selected image' : 'image'}>
            <a href="#" onClick={() => this.handleImageClick(1, event)}>
              <img src="http://lorempixel.com/400/200/" alt=" " />
            </a>
          </div>
          <div className={imageSelected === 2 ? 'selected image' : 'image'}>
            <a href="#" onClick={() => this.handleImageClick(2, event)}>
              <img src="http://lorempixel.com/400/200/?2" alt=" " />
            </a>
          </div>
        </div>
        <div className="keywords-list">
          {this.state.imageSelected ? <Keywords imageSelected={this.state.imageSelected} delayedRender={delayedRender} /> : null}
          {this.state.imageSelected ? `${store.keywords[imageSelected].length} keywords` : null}
        </div>
      </div>
    );
  }
}

export default App;

class Keywords extends Component {
  constructor() {
    super();
    this.state = {
      renderCounter: 100,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.imageSelected !== nextProps.imageSelected) {
      if (this.reRenderTimeout) {
        clearTimeout(this.reRenderTimeout);
      }
      this.setState({ renderCounter: 100 });
    }
  }

  /**
   * We know this is bad but this is the only way we found
   * to improve the initial render of this component that can contain thousands of keywords.
   */
  componentDidUpdate() {
    if (store.keywords[this.props.imageSelected].length > this.state.renderCounter) {
      this.reRenderTimeout = setTimeout(() => {
        this.setState({ renderCounter: this.state.renderCounter + 250 }); // eslint-disable-line react/no-did-update-set-state
      }, 500);
    }
  }

  componentWillUnmount() {
    if (this.reRenderTimeout) {
      clearTimeout(this.reRenderTimeout);
    }
  }

  render() {
    const { imageSelected, delayedRender } = this.props;
    return (
      <div className="keywords">
        {store.keywords[imageSelected].map((keyword, i) => {
          if (delayedRender && this.state.renderCounter < i) {
            return null;
          }
          return <Keyword key={`${keyword}-${imageSelected}-${i}`} name={keyword} />
        })}
      </div>
    );
  }
}


class Keyword extends Component {
  handleKeywordClick(name, event) {
    this.setState({ name });
    event.preventDefault();
  }
  render() {
    return <a className="keyword" href="#" onClick={() => this.handleKeywordClick(name, event)}>{this.props.name}</a>;
  }
}

