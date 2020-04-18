const { shell } = remote;

const openWindow = (url) => shell.openExternal(url);

const myGithub = document.querySelector("#myGithub");
const myLinkedin = document.querySelector("#myLinkedin");
const myPortfolio = document.querySelector("#myPortfolio");

const repository = document.querySelector("#repository");

myGithub.addEventListener("click", () => {
  openWindow("https://github.com/filipemelo2002");
});

myLinkedin.addEventListener("click", () => {
  openWindow("https://www.linkedin.com/in/filipe-melo-872183170/");
});

myPortfolio.addEventListener("click", () => {
  openWindow("https://filipemelo2002.github.io/Portfolio/");
});

repository.addEventListener("click", () => {
  openWindow("https://github.com/filipemelo2002/syncplayer");
});
