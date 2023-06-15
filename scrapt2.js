const puppeteer = require("puppeteer");

(async () => {
  try {
    // Configurar Puppeteer en el nuevo modo Headless
    const browser = await puppeteer.launch({ headless: "false" });
    const page = await browser.newPage();

    // Navegar a la página web
    await page.goto("https://open.bymadata.com.ar/#/nyse-nasdaq-cedears", {
      waitUntil: "networkidle0",
    });
    page.on("console", (message) => {
      if (message.type() === "error") {
        console.error(`Error en la página: ${message.text()}`);
      }
    });

    const abuscar = 'KO';

    const segundoGridsterItem = (await page.$$("ngx-gridster-item"))[1];
    const Listainput = await segundoGridsterItem.$$(
        "datatable-header-cell input"
    );
    const inputEspecie = Listainput[0];
    await inputEspecie.type(abuscar);

    // tomo el Ultimo en pesos
    
    const pesos = await page.evaluate((abuscar) => {
      let ListaEspecies = document
        .querySelectorAll("ngx-gridster-item")[1]
        .querySelectorAll("datatable-row-wrapper");
      let peso;
      ListaEspecies.forEach((element) => {
        let row = element.querySelectorAll("datatable-body-cell");
        if (row[0].innerText == abuscar) {
          peso = parseFloat(row[10].innerText);
        }
      });
      return peso;
    },abuscar);
    const dolares = await page.evaluate((abuscar) => {
      let ListaEspecies = document
        .querySelectorAll("ngx-gridster-item")[1]
        .querySelectorAll("datatable-row-wrapper");
      let dolar;
      ListaEspecies.forEach((element) => {
        let row = element.querySelectorAll("datatable-body-cell");
        if (row[0].innerText == abuscar+'D') {
          dolar = parseFloat(row[10].innerText);
        }
      });
      return dolar;
    }, abuscar);

    const ccl = 500;
    const calc = (ccl / (pesos / dolares))*100 % 100;
    console.log('KOD: ',dolares,'KO: ',pesos,'calculo: ',calc)
    // Cerrar el navegador
    await browser.close();
  } catch (e) {
    console.log("Error:", e);
  }
})();