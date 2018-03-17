var matrices = [];
var matrixRead = false;
var am;
var an;
var bm;
var bn;



/*============================================================
  FUNKCIJA KOJA SE STARA DA UNETI FORMATI MATRICA BUDU VALIDNI
==============================================================*/
function ensureValidFormat(updated, toChange) {
  toChange.value = updated.value;
}



/*=======================================================
  FUNKCIJA BRISE SVE CHILD NODOVE NAKON PARAGRAFA U CVORU
  PROSLEDJENOM KAO ARGUMENT
  =======================================================*/
function removeChildrenType(element) {
  while (element.lastChild.nodeName === 'DIV' ||
         element.lastChild.nodeName === '#text') {
    element.removeChild(element.lastChild);
  }
}



/*============================================================
  FUNCKIJA INICIJALIZUJE OSNOVNU FORMU ZA UNOS FORMATA MATRICA
  ============================================================*/
function initialize() {
  var formatForm = document.querySelector('section.forms');
  removeChildrenType(formatForm);
  formatForm.appendChild(createFormatForm());

  var an = document.querySelector('#matrixan');
  var bm = document.querySelector('#matrixbm');
  an.addEventListener('input', function() { ensureValidFormat(an, bm) });
  bm.addEventListener('input', function() { ensureValidFormat(bm, an) });

  document.querySelector('div.format button').addEventListener('click', getData);
}



/*=========================================================
  FUNKCIJA UZIMA VREDNOSTI IZ POLJA ZA UNOS FORMATA MATRICA
  I POHRANJUJE IH U ZA TO PREDVIDJENE GLOBALNE PROMENJIVE.
  PORED TOGA, VREDNOSTI IM OGRANICAVA NA 20
  =========================================================*/
function getFormat() {
  am = Number(document.querySelector('#matrixam').value);
  an = Number(document.querySelector('#matrixan').value);
  bm = Number(document.querySelector('#matrixbm').value);
  bn = Number(document.querySelector('#matrixbn').value);
  // Ne dozvoljavamo da bilo koja dimenzija bude veca od 20
  if (an > 20) an = 20;
  if (am > 20) am = 20;
  if (bn > 20) bn = 20;
  if (bm > 20) bm = 20;
}



/*====================================================
  FUNKCIJA CITA PODATKE UNETE U FORME ZA UNOS PODATAKA
  ====================================================*/
function getData() {
  if (!matrixRead) {
    matrixRead = true;
    getFormat();
    createMatrixForm();
  }

  else {
    matrixRead = false;
    matrices = getMatrixData();
    var product = calculateProduct(matrices);
    var resultForm = createProductForm(product);
  }
}



/*==================================================
  FUNKCIJA KOJA KREIRA FORMU ZA UNOS FORMATA MATRICA
  ==================================================*/
function createFormatForm() {
  var formatForm = document.createElement('div');
  formatForm.className = 'format';

  var label = document.createElement('label');
  label.setAttribute('for', 'matrixam');
  label.textContent = "Matrica A:"

  var inputm = document.createElement('input');
  var inputn = document.createElement('input');

  inputm.type = 'text';
  inputm.id = 'matrixam';
  inputm.name = 'am'
  inputn.type = 'text';
  inputn.id = 'matrixan';
  inputn.name = 'an'

  formatForm.appendChild(label);
  formatForm.appendChild(inputm);
  formatForm.appendChild(document.createTextNode('X'));
  formatForm.appendChild(inputn);
  formatForm.appendChild(document.createElement('br'));

  label = document.createElement('label');
  label.setAttribute('for', 'matrixbm');
  label.textContent = "Matrica B:"

  inputm = document.createElement('input');
  inputn = document.createElement('input');

  inputm.type = 'text';
  inputm.id = 'matrixbm';
  inputm.name = 'bm'
  inputn.type = 'text';
  inputn.id = 'matrixbn';
  inputn.name = 'bn'

  formatForm.appendChild(label);
  formatForm.appendChild(inputm);
  formatForm.appendChild(document.createTextNode('X'));
  formatForm.appendChild(inputn);
  formatForm.appendChild(document.createElement('br'));

  var div_btn = document.createElement('div');
  div_btn.className = 'btn-div';
  var button = document.createElement('button');
  button.textContent = 'PROSLEDI';

  div_btn.appendChild(button);
  formatForm.appendChild(div_btn);

  return formatForm;
}



/*===========================================
  FUNKCIJA KOJA KREIRA TABELU ZA UNOS MATRICE
  ===========================================*/
function createMatrixTable(m, n) {
  var formTable = document.createElement('table');

  for (i = 1; i <= m; i++) {
    var row = document.createElement('tr');

    for (j = 1; j <= n; j++) {
      var tableData = document.createElement('td');
      var inputText = document.createElement('input');
      inputText.setAttribute('maxlength', 3);
      inputText.name = i + ':' + j;
      inputText.type = 'text';

      tableData.appendChild(inputText);
      row.appendChild(tableData);
    }

    formTable.appendChild(row);
  }

  return formTable;
}



/*========================================================
  FUNKCIJA KOJA KREIRA CELOKUPNU FORMU ZA UNOS DVE MATRICE
  NA OSNOVU UNETIH VREDNOSTI FORMATA
  ========================================================*/
function createMatrixForm() {
  var sec = document.querySelector('section.forms');
  removeChildrenType(sec);

  var matrixTable = document.createElement('div');
  matrixTable.className = "matrix";

  matrixTable.appendChild(createMatrixTable(am, an));
  matrixTable.appendChild(document.createTextNode(' X '));
  matrixTable.appendChild(createMatrixTable(bm, bn));

  sec.appendChild(matrixTable);

  var div_btn = document.createElement('div');
  div_btn.className = 'btn-div';
  var button = document.createElement('button');
  button.textContent = 'IZRACUNAJ';
  button.className = 'dugmence';
  div_btn.appendChild(button);
  matrixTable.appendChild(div_btn);

  document.querySelector('div.matrix button').
           addEventListener('click', getData);
}



/*====================================================================
  FUNKCIJA PRIKUPLJA KOEFICIJENTE MATRICA UNETE U FORME ZA UNOS
  I VRACA IH U OBLIKU NIZA OD DVA NIZA NIZOVA NUMERICKIH KOEFICIJENATA
  ====================================================================*/
function getMatrixData() {
  var matrixForms = document.querySelectorAll('div.matrix table');
  var matrixFormsValues = [];

  for (var mat = 0; mat < matrixForms.length; mat++) {
    var matrixFormRows = matrixForms[mat].children;
    var matrix = [];
    for (var row = 0; row < matrixFormRows.length; row++) {
      var matrixRow = [];
      var matrixFormRowValues = matrixFormRows[row].children;
      for (var val = 0; val < matrixFormRowValues.length; val++) {
        matrixRow.push(Number(matrixFormRowValues[val].firstChild.value));
      }
      matrix.push(matrixRow);
    }
    matrixFormsValues.push(matrix);
  }

  return matrixFormsValues;
}



/*=======================================================
  FUNKCIJA RACUNA PROZVOD DVE MATRICE I VRACA GA U OBLIKU
  NIZA NIZOVA KOEFICIJENATA
  =======================================================*/
function calculateProduct(matrices) {
  var matrixProduct = [];

  for (var i = 0; i < matrices[0].length; i++) {
    var rowProduct = [];
    for (var j = 0; j < matrices[1][0].length; j++) {
      var scalarProduct = 0;
      for (var k = 0; k < matrices[0][0].length; k++) {
        // i,k * k,j
        scalarProduct += (matrices[0][i][k] * matrices[1][k][j]);
      }
      rowProduct.push(scalarProduct);
    }
    matrixProduct.push(rowProduct);
  }

  return matrixProduct;
}



/*====================================================================
  FUNKCIJA KREIRA TABELU ZA PRIKAZ MATRICE NA OSNOVU DVODIMENZIONALNOG
  NIZA KOJI PREDSTAVLJA PROIZVOD UNETIH MATRICA
  ====================================================================*/
function createProductTable(product) {
  var productTable = document.createElement('table');

  for (var row = 0; row < product.length; row++) {
    var productRow = document.createElement('tr');
    for (var col = 0; col < product[row].length; col++) {
      var productComponent = document.createElement('td');
      productComponent.className = 'prod-result';
      var componentValue = document.createTextNode(product[row][col]);
      productComponent.appendChild(componentValue);
      productRow.appendChild(productComponent);
    }
    productTable.appendChild(productRow);
  }

  return productTable;
}



/*==================================================================
  FUNKCIJA KREIRA CELOKUPNU SEKCIJU ZA PRIKAZ MATRICE I DODAJE JE NA
  DOM. TIME SE PRIKAZUJE REZULTAT
  ==================================================================*/
function createProductForm(product) {

  var formatForm = document.querySelector('section.forms');
  removeChildrenType(formatForm);

  var productTable = createProductTable(product);
  var productDiv = document.createElement('div');
  productDiv.className = 'matrix';
  productDiv.appendChild(productTable);

  var div_btn = document.createElement('div');
  div_btn.className = 'btn-div';
  var button = document.createElement('button');
  button.textContent = 'RESETUJ';
  button.className = 'dugmence';
  div_btn.appendChild(button);
  productDiv.appendChild(div_btn);

  formatForm.appendChild(productDiv);

  document.querySelector('div.matrix button').
           addEventListener('click', initialize);
}



// INICIJALIZACIJA NAKON PRVOBITNOG UCITAVANJA SADRZAJA
document.addEventListener('DOMContentLoaded', initialize);
