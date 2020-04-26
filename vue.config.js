module.exports = {
  pwa: {
    name: "TicTacToe",
    themeColor: "#f5eded",
    msTileColor: "#f5eded",
    manifestOptions: {
      background_color: "#f5eded"
    },
    icons: [
      {
        src: "img/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "img/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "img/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "img/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ],
    iconPaths: {
      favicon32: "img/icons/favicon-32x32.png",
      favicon16: "img/icons/favicon-16x16.png",
      appleTouchIcon: "img/icons/icon-152x152.png",
      maskIcon: "img/icons/logo.svg",
      msTileImage: "img/icons/icon-144x144.png"
    }
  }
};
