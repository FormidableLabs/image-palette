import React, { Component } from "react";
import ImagePaletteProvider from "react-image-palette";
import Spinner from "react-spinkit";
import "./main.css";

const getAPIURL = artist =>
  `http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${encodeURIComponent(
    artist.toLowerCase()
  )}&api_key=ff4b76a7c5f5029f2196a4ae65468679&format=json`;

class App extends Component {
  state = { albums: [], artist: "Com Truise", loading: true };

  componentWillMount() {
    this.mounted = true;
    this.updateSearch();
  }

  updateArist = event => this.setState({ artist: event.target.value });

  updateSearch = () => {
    const { artist } = this.state;
    this.setState({ albums: [] });
    fetch(getAPIURL(this.state.artist))
      .then(res => res.json())
      .then(json =>
        this.setState({
          albums: json.topalbums ? json.topalbums.album : [],
          loading: false
        })
      );
  };

  getLargestImageUrl(images) {
    const image = images && (images[3] || images[2] || images[1] || images[0]);
    return image ? image["#text"] : null;
  }

  handleKeyDown = event => {
    if (event.key === "Enter") {
      this.updateSearch();
    }
  };

  render() {
    const { albums, loading } = this.state;
    const renderedAlbums = albums.map(album => {
      const image = this.getLargestImageUrl(album.image);
      if (!image) {
        return null;
      }
      return (
        <ImagePaletteProvider crossOrigin image={image} key={image}>
          {({ backgroundColor, color, alternativeColor }) => (
            <div className="album" style={{ backgroundColor, color }}>
              <h1>{album.name}</h1>
              <a href={album.url} style={{ color: alternativeColor }}>
                Learn More
              </a>
              <br />
              <img src={image} />
            </div>
          )}
        </ImagePaletteProvider>
      );
    });
    return (
      <div className="container">
        <a
          className="github-ribbon"
          href="https://github.com/FormidableLabs/react-image-palette/"
        >
          <img
            style={{ position: "absolute", top: 0, right: 0, border: 0 }}
            src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67"
            alt="Fork me on GitHub"
            data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"
          />
        </a>
        <h1 className="title">
          <a href="https://github.com/FormidableLabs/react-image-palette">
            <pre>react-image-palette</pre>
          </a>
        </h1>
        <p>
          Search for an artist to see generated color palettes for all the album
          art in their discog.
        </p>
        <br />
        <div className="search--container">
          <input
            spellCheck={false}
            className="search--input"
            value={this.state.artist}
            onChange={this.updateArist}
            onKeyDown={this.handleKeyDown}
          />
          <button className="search--button" onClick={this.updateSearch}>
            Search
          </button>
        </div>
        <div className="album--container">
          {loading && (
            <div className="spinner--container">
              <Spinner name="ball-spin-fade-loader" />
            </div>
          )}
          {!loading && renderedAlbums}
        </div>
      </div>
    );
  }
}

export default App;
