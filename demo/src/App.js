import React, { Component } from "react";
import ImagePaletteProvider from "react-image-theme-parser";

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
        this.setState({ albums: json.topalbums.album, loading: false })
      );
  };

  getLargestImageUrl(images) {
    const image = images && (images[3] || images[2] || images[1] || images[0]);
    return image ? image["#text"] : null;
  }

  render() {
    const albums = this.state.albums.map(album => {
      const image = this.getLargestImageUrl(album.image);
      if (image === null) {
        return null;
      }
      return (
        <ImagePaletteProvider image={image}>
          {({ backgroundColor, color, alternativeColor }) => (
            <div
              style={{
                width: 400,
                margin: 20,
                padding: 30,
                backgroundColor,
                color,
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <h1>{album.name}</h1>
              <a href={album.url} style={{ color: alternativeColor }}>
                Learn More
              </a>
              <br />
              <img src={image} style={{ width: 300 }} />
            </div>
          )}
        </ImagePaletteProvider>
      );
    });
    return (
      <div style={{ fontFamily: "Nunito", padding: 30, textAlign: "center" }}>
        <h1 style={{ fontSize: 40, marginBottom: 0 }}>
          <pre>
            react-image-palette
          </pre>
        </h1>
        <p style={{ maxWidth: '50%', margin: 'auto' }}>
          Search for an artist to see generated color palettes for all the album art in their discog.
        </p>
        <br />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 20
          }}
        >
          <input
            style={{
              boxSizing: "border-box",
              height: 40,
              fontSize: 16,
              padding: 10,
              width: "100%",
              maxWidth: 400
            }}
            value={this.state.artist}
            onChange={this.updateArist}
          />
          <button onClick={this.updateSearch}>Search</button>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center"
          }}
        >
          {(this.state.loading || !this.state.albums.length) && (
            <span>Loading...</span>
          )}
          {albums}
        </div>
      </div>
    );
  }
}

export default App;
